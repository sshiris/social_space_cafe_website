import { createHash } from "node:crypto";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, bookingSlots } from "@/db/schema";
import { cancellationDeadline } from "@/lib/booking-deadline";

export const runtime = "nodejs";

function reply(status: number, code: string, success = false) {
  return Response.json(
    { code, success },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply(400, "invalidToken");
  }
  if (
    !body ||
    typeof body !== "object" ||
    !("token" in body) ||
    typeof body.token !== "string" ||
    !/^[a-f0-9]{64}$/.test(body.token)
  ) {
    return reply(400, "invalidToken");
  }
  const tokenHash = createHash("sha256").update(body.token).digest("hex");
  try {
    const result = await db.transaction(async (tx) => {
      const [booking] = await tx
        .select({ id: bookings.id, status: bookings.status })
        .from(bookings)
        .where(eq(bookings.cancellationTokenHash, tokenHash))
        .for("update");
      if (!booking) return { status: 404, code: "notFound" };
      // A retry after a lost response reports the actual, already-completed outcome.
      if (booking.status === "cancelled")
        return { status: 200, code: "alreadyCancelled", success: true };
      if (booking.status !== "confirmed")
        return { status: 409, code: "notActive" };
      const [firstSlot] = await tx
        .select({ date: bookingSlots.date, startTime: bookingSlots.startTime })
        .from(bookingSlots)
        .where(eq(bookingSlots.bookingId, booking.id))
        .orderBy(asc(bookingSlots.date), asc(bookingSlots.startTime));
      if (!firstSlot) return { status: 409, code: "noSlots" };
      const now = new Date();
      if (
        now.getTime() >=
        cancellationDeadline(firstSlot.date, firstSlot.startTime)
      ) {
        return { status: 409, code: "deadlinePassed" };
      }
      await tx
        .update(bookings)
        .set({ status: "cancelled", cancelledAt: now })
        .where(eq(bookings.id, booking.id));
      await tx
        .update(bookingSlots)
        .set({ releasedAt: now })
        .where(eq(bookingSlots.bookingId, booking.id));
      return { status: 200, code: "cancelled", success: true };
    });
    return reply(result.status, result.code, result.success);
  } catch {
    // Do not log raw query errors, which can include parameters and customer data.
    return reply(503, "unavailable");
  }
}
