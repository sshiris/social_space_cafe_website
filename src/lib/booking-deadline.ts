import { Temporal } from "@js-temporal/polyfill";

export const BOOKING_TIME_ZONE = "Europe/Helsinki";

// The cutoff is exclusive: at exactly two hours before the first slot, cancellation closes.
export function cancellationDeadline(date: string, startTime: string): number {
  return Temporal.PlainDate.from(date)
    .toZonedDateTime({ timeZone: BOOKING_TIME_ZONE, plainTime: startTime })
    .subtract({ hours: 2 }).epochMilliseconds;
}
