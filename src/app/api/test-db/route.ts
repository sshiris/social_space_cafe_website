import { db } from "@/db";
import { bookings, bookingSlots } from "@/db/schema";
import { eq } from "drizzle-orm";

function jsonResponse(data: unknown) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export async function GET(request: Request) {

    const {searchParams } = new URL(request.url);
    const date = searchParams.get("date");

      if (!date) {
        return Response.json({ error: "Date is required" }, { status: 400 });
      }
  const slots = await db
    .select()
    .from(bookingSlots)
    .where(eq(bookingSlots.date, date));

  return Response.json(slots);
}

export async function POST() {
  const result = await db.transaction(async (tx) => {
    const [booking] = await tx
      .insert(bookings)
      .values({
        name: "Test Customer",
        email: "test@example.com",
        numberOfPeople: 4,
        notes: "This is our first test booking",
      })
      .returning();

    const slots = await tx
      .insert(bookingSlots)
      .values([
        {
          bookingId: booking.id,
          date: "2026-10-15",
          startTime: "10:00",
          endTime: "11:00",
        },
        {
          bookingId: booking.id,
          date: "2026-10-15",
          startTime: "11:00",
          endTime: "12:00",
        },
        {
          bookingId: booking.id,
          date: "2026-10-15",
          startTime: "14:00",
          endTime: "15:00",
        },
      ])
      .returning();

    return { booking, slots };
  });

  return jsonResponse({
    success: true,
    ...result,
  });
}