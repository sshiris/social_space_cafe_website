import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, bookingSlots } from "@/db/schema";
import { isBookingConflict, isBookingDate, validateBooking } from "@/lib/booking-validation";

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date");
  if (!isBookingDate(date)) {
    return Response.json({ error: "Please provide a valid date in YYYY-MM-DD format." }, { status: 400 });
  }
  try {
    const slots = await db
      .select({ startTime: bookingSlots.startTime, endTime: bookingSlots.endTime })
      .from(bookingSlots).where(eq(bookingSlots.date, date)).orderBy(bookingSlots.startTime);
    return Response.json({ slots }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Availability could not be loaded. Please try again." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Please send a valid JSON booking request." }, { status: 400 });
  }
  const data = validateBooking(body);
  if (!data) {
    return Response.json({ error: "Please check the date, slots and customer details." }, { status: 400 });
  }
  try {
    await db.transaction(async (tx) => {
      const [booking] = await tx.insert(bookings).values(data.customer).returning({ id: bookings.id });
      await tx.insert(bookingSlots).values(data.slots.map((slot) => ({
        bookingId: booking.id, date: data.date, ...slot,
      })));
    });
    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    if (isBookingConflict(error)) {
      return Response.json({ error: "One or more selected slots have just been booked. Please choose from the updated availability." }, { status: 409 });
    }
    return Response.json({ error: "Your booking could not be completed. Please try again." }, { status: 503 });
  }
}
