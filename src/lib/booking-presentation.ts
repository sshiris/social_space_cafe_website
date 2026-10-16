import type { Locale } from "@/i18n/locales";
import { BOOKING_TIME_ZONE, cancellationDeadline } from "./booking-deadline";

const formats = { en: "en-GB", fi: "fi-FI", sv: "sv-FI" };
export function formatBookingDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(formats[locale], { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
export function formatCancellationDeadline(date: string, start: string, locale: Locale) {
  return new Intl.DateTimeFormat(formats[locale], { dateStyle: "long", timeStyle: "short", timeZone: BOOKING_TIME_ZONE }).format(cancellationDeadline(date, start));
}
export function cancellationPath(locale: Locale, token: string) {
  return `/${locale}/booking/cancel#token=${encodeURIComponent(token)}`;
}
