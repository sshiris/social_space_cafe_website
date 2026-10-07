import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";
import { BookingSlotSelector } from "@/components/booking/booking-slot-selector";
import { demoContext } from "@/content/demo/shared";


export async function generateMetadata({
  params,
}: PageProps<"/[locale]/booking">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: `${messages[locale].nav.booking} · ${demoContext.venueName}`,
  };
}

export default async function BookingPage({
  params,
}: PageProps<"/[locale]/booking">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div className="booking-page container">
      <h1>{messages[locale].nav.booking}</h1>
      <BookingSlotSelector text={messages[locale].booking} />
    </div>
  );
}