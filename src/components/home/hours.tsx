import type { Locale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";
import type { TimeInterval } from "@/content/types";

function Interval({ interval, locale }: { interval: TimeInterval; locale: Locale }) {
  return <>{interval.opens}–{interval.closes}{interval.closingDayOffset === 1 && <small> ({messages[locale].home.nextDay})</small>}</>;
}

export function Hours({ intervals, locale }: { intervals: readonly TimeInterval[]; locale: Locale }) {
  if (!intervals.length) return <>{messages[locale].home.closed}</>;
  return <>{intervals.map((interval, index) => <span key={`${interval.opens}-${interval.closes}`}>{index > 0 && ", "}<Interval interval={interval} locale={locale} /></span>)}</>;
}

