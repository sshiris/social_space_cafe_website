import { notFound } from "next/navigation";
import { CancelBooking } from "@/components/booking/cancel-booking";
import { isLocale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";
import { demoContext } from "@/content/demo/shared";

export async function generateMetadata({ params }: PageProps<"/[locale]/booking/cancel">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: `${messages[locale].booking.cancellation.title} · ${demoContext.venueName}`, robots: { index: false, follow: false }, referrer: "no-referrer" as const };
}

export default async function CancelBookingPage({ params }: PageProps<"/[locale]/booking/cancel">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const text = messages[locale].booking;
  return <div className="booking-page container">
    <p className="eyebrow">{text.eyebrow}</p>
    <h1>{text.cancellation.title}</h1>
    <CancelBooking locale={locale} text={text.cancellation} />
  </div>;
}
