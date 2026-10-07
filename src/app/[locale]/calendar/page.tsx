import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";
import { demoContext, events } from "@/content/demo";
import { calendarMonth, monthView } from "@/content/calendar";
import { CalendarView } from "@/components/calendar/calendar-view";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/calendar">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: `${messages[locale].nav.calendar} · ${demoContext.venueName}`,
  };
}
export default async function CalendarPage({
  params,
  searchParams,
}: PageProps<"/[locale]/calendar">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const month = calendarMonth(
    (await searchParams).month,
    demoContext.referenceDate,
  );
  return (
    <CalendarView
      locale={locale}
      view={monthView(events, month, demoContext.timeZone)}
    />
  );
}
