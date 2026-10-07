import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";
import { demoContext, meetingRoom, venueText } from "@/content/demo";
import { SamplePhoto } from "@/components/home/sample-photo";

const destinations = ["takeaway", "booking", "market"] as const;
type Destination = (typeof destinations)[number];
function isDestination(value: string): value is Destination {
  return destinations.some((entry) => entry === value);
}
export function generateStaticParams() {
  return destinations.map((destination) => ({ destination }));
}
export async function generateMetadata({
  params,
}: PageProps<"/[locale]/[destination]">) {
  const { locale, destination } = await params;
  if (!isLocale(locale) || !isDestination(destination)) notFound();
  return {
    title: `${messages[locale].nav[destination]} · ${demoContext.venueName}`,
  };
}
export default async function DestinationPreview({
  params,
}: PageProps<"/[locale]/[destination]">) {
  const { locale, destination } = await params;
  if (!isLocale(locale) || !isDestination(destination)) notFound();
  const text = messages[locale];
  const note = {
    takeaway: text.destinations.takeawayNote,
    booking: text.destinations.bookingNote,
    market: text.destinations.marketNote,
  }[destination];
  return (
    <div className="destination-preview container">
      <div>
        <p className="eyebrow">{text.destinations.preview}</p>
        <h1>{text.nav[destination]}</h1>
        <p>{note}</p>
        {destination === "booking" && (
          <p>
            {text.home.capacity}: {meetingRoom.seatedCapacity}{" "}
            {text.home.people} · {text.home.sample}
          </p>
        )}
        {destination === "market" && (
          <p>{venueText[locale].souvenirIntroduction}</p>
        )}
        <p>
          <Link
            href={`/${locale}${destination === "takeaway" ? "/menu" : "#contact"}`}
          >
            {destination === "takeaway"
              ? text.story.viewMenu
              : text.nav.contact}{" "}
            →
          </Link>
        </p>
      </div>
      <SamplePhoto
        role={
          destination === "booking"
            ? "meetings"
            : destination === "market"
              ? "souvenirs"
              : "cafe"
        }
        locale={locale}
      />
    </div>
  );
}
