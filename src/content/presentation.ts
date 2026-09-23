import type { Locale } from "../i18n/locales.ts";
import type { Money, VenueAreaHours, Weekday, WeeklyMenu, VenueEvent } from "./types.ts";

export const formatPrice = (price: Money, locale: Locale) =>
  new Intl.NumberFormat(locale, { style: "currency", currency: price.currency }).format(price.amountCents / 100);

/** Calendar-only values are deliberately formatted in UTC, avoiding a timezone shift. */
export const formatDate = (date: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));

export function hoursOnDate(area: VenueAreaHours, date: string) {
  const exception = area.exceptions.find((entry) => entry.date === date);
  const weekday = (new Date(`${date}T12:00:00Z`).getUTCDay() || 7) as Weekday;
  return { intervals: exception?.intervals ?? area.regular[weekday], reason: exception?.reason };
}

export function publishedMenuForDate(menus: readonly WeeklyMenu[], date: string) {
  return menus.find((menu) => {
    const end = new Date(`${menu.weekStart}T12:00:00Z`);
    end.setUTCDate(end.getUTCDate() + 6);
    return menu.status === "published" && menu.weekStart <= date && date <= end.toISOString().slice(0, 10);
  });
}

export function upcomingEvents(events: readonly VenueEvent[], date: string, timeZone: string) {
  const localDay = (timestamp: string) => {
    const parts = new Intl.DateTimeFormat("en", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(timestamp));
    return ["year", "month", "day"].map((type) => parts.find((part) => part.type === type)!.value).join("-");
  };
  return events.filter((event) => event.status === "published" && !event.cancelled && localDay(event.startsAt) >= date)
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
}
