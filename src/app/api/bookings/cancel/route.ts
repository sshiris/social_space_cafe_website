import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { and, eq, asc } from "drizzle-orm";

import { db } from "@/db";
import { bookings, bookingSlots } from "@/db/schema";
import { Temporal } from "@js-temporal/polyfill";

export const runtime = "nodejs";

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export async function POST(request: Request) {
    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            {error: "Invalid JSON"},
            { status: 400 }
        );
    }
    
      if (
        typeof body !== "object" ||
        body === null ||
        !("token" in body) ||
        typeof body.token !== "string" ||
        !/^[a-f0-9]{64}$/.test(body.token)
      ) {
        return NextResponse.json(
          { error: "Invalid cancellation token" },
          { status: 400 },
        );
      }

      const tokenHash = createHash("sha256")
      .update(body.token)
      .digest("hex");

      try{
        const result = await db.transaction(async (tx) => {
            const [booking] = await tx
                .select({
                    id: bookings.id,
                    status: bookings.status
                })
                .from(bookings)
                .where(eq(bookings.cancellationTokenHash, tokenHash))
                .for("update");

                if(!booking){
                    return {status:404, error: "Booking not found"};
                }

                if (booking.status !== "confirmed") {
                    return { status: 409, error: "Booking is not active" };
                }

                const slots = await tx
                    .select({
                        date: bookingSlots.date,
                        startTime: bookingSlots.startTime,
                    })
                    .from(bookingSlots)
                    .where(eq(bookingSlots.bookingId, booking.id))
                    .orderBy(asc(bookingSlots.date), asc(bookingSlots.startTime));

                if (slots.length === 0) {
                    return { status: 409, error: "No slots found for this booking" };
                }

                const firstSlot = slots[0];

                const start = Temporal.ZonedDateTime.from({
                  timeZone: "Europe/Helsinki",
                  year: Number(firstSlot.date.slice(0, 4)),
                  month: Number(firstSlot.date.slice(5, 7)),
                  day: Number(firstSlot.date.slice(8, 10)),
                  hour: Number(firstSlot.startTime.slice(0, 2)),
                  minute: Number(firstSlot.startTime.slice(3, 5)),
                });

                const bookingStartMs = start.epochMilliseconds;
                const deadlineMs = bookingStartMs - TWO_HOURS_MS;

                if (Date.now() >= deadlineMs) {
                  return {
                    status: 409,
                    error: "Cancellation deadline has passed",
                  };
                }

                await tx
                .update(bookings)
                .set({
                    status: "cancelled",
                    cancelledAt: new Date(),
                })
                .where(
                    and(
                        eq(bookings.id, booking.id),
                        eq(bookings.status, "confirmed")
                    )
                );

                await tx
                .delete(bookingSlots)
                .where(eq(bookingSlots.bookingId, booking.id));

                return{status: 200, success: true};
        });

        return NextResponse.json(result, { status: result.status });
      } catch (error) {
        console.error("Booking cancellation failed", error);
        return NextResponse.json(
          { error: "Unable to cancel booking" },
          { status: 500 }
        );
      }

}