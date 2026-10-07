import type { VenueEvent } from "./types.ts";
import { upcomingEvents } from "./presentation.ts";

/** Calendar displays each event on its start date in the venue's timezone. */
export function eventLocalDate(timestamp: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(timestamp));
  return ["year", "month", "day"]
    .map((type) => parts.find((part) => part.type === type)!.value)
    .join("-");
}
export function calendarMonth(value: unknown, fallback: string) {
  return typeof value === "string" &&
    /^(19|20|21)\d{2}-(0[1-9]|1[0-2])$/.test(value)
    ? value
    : fallback.slice(0, 7);
}
export function monthView(
  events: readonly VenueEvent[],
  month: string,
  timeZone: string,
) {
  const first = new Date(`${month}-01T12:00:00Z`);
  const offset = (first.getUTCDay() + 6) % 7;
  const total = new Date(
    Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0),
  ).getUTCDate();
  // Reuse the homepage's publication/cancellation filtering and chronological ordering.
  const programme = upcomingEvents(events, `${month}-01`, timeZone).filter(
    (event) => eventLocalDate(event.startsAt, timeZone).startsWith(month),
  );
  const cells = Array.from(
    { length: Math.ceil((offset + total) / 7) * 7 },
    (_, index) => {
      const day = index - offset + 1;
      return day < 1 || day > total
        ? null
        : {
            day,
            events: programme.filter(
              (event) =>
                Number(eventLocalDate(event.startsAt, timeZone).slice(-2)) ===
                day,
            ),
          };
    },
  );
  const adjacent = (delta: number) =>
    new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + delta, 1))
      .toISOString()
      .slice(0, 7);
  return { first, cells, programme, previous: adjacent(-1), next: adjacent(1) };
}
