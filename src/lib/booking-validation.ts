import { meetingRoomSlots } from "./booking-slots";

export function isBookingDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000")) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function isBookingEmail(value: string) {
  return value.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateBooking(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  if (!isBookingDate(data.date) || !Array.isArray(data.selectedSlots) ||
    data.selectedSlots.length < 1 || data.selectedSlots.length > meetingRoomSlots.length ||
    new Set(data.selectedSlots).size !== data.selectedSlots.length ||
    !data.selectedSlots.every((start) => meetingRoomSlots.some((slot) => slot.startTime === start))) return null;
  if (typeof data.name !== "string" || !data.name.trim() || data.name.trim().length > 120 ||
    typeof data.email !== "string" || !isBookingEmail(data.email.trim()) ||
    typeof data.numberOfPeople !== "number" || !Number.isInteger(data.numberOfPeople) ||
    data.numberOfPeople < 1 || data.numberOfPeople > 2147483647) return null;
  if (data.phone !== undefined && (typeof data.phone !== "string" || data.phone.trim().length > 50)) return null;
  if (data.notes !== undefined && (typeof data.notes !== "string" || data.notes.trim().length > 5000)) return null;
  const strings = [data.name, data.email, data.phone, data.notes];
  if (strings.some((entry) => typeof entry === "string" && entry.includes("\0"))) return null;
  return {
    date: data.date,
    slots: meetingRoomSlots.filter((slot) => data.selectedSlots instanceof Array && data.selectedSlots.includes(slot.startTime)),
    customer: {
      name: data.name.trim(), email: data.email.trim(), numberOfPeople: data.numberOfPeople,
      phone: typeof data.phone === "string" ? data.phone.trim() || null : null,
      notes: typeof data.notes === "string" ? data.notes.trim() || null : null,
    },
  };
}

// Drizzle wraps postgres-js errors in a query error; inspect its cause too.
export function isBookingConflict(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { code?: string; constraint_name?: string; cause?: unknown };
  return (candidate.code === "23505" && candidate.constraint_name === "booking_slot_unique") ||
    (candidate.cause !== undefined && candidate.cause !== error && isBookingConflict(candidate.cause));
}
