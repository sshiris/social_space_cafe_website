import type { Locale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";
import { demoContext, venueText, openingHours } from "@/content/demo";
import { formatDate, hoursOnDate } from "@/content/presentation";
import { Hours } from "./hours";

export function Visit({ locale }: { locale: Locale }) {
  const text = messages[locale];
  const venue = venueText[locale];
  return <section id="contact" tabIndex={-1} className="compact-visit container" aria-labelledby="visit-title">
    <div><h2 id="visit-title">{text.story.visit}</h2><p>{venue.location}<br />{venue.address}</p><p>{demoContext.contactEmail}<br /><small>{venue.contactNote}</small></p></div>
    <div id="opening-hours" tabIndex={-1}><h3>{text.home.hours}</h3><p className="compact-demo-date">{text.home.clock}: {formatDate(demoContext.referenceDate, locale)}</p><dl>{openingHours.map(area => {const hours = hoursOnDate(area, demoContext.referenceDate);return <div key={area.id}><dt>{area.text[locale].name}</dt><dd><Hours intervals={hours.intervals} locale={locale} />{hours.reason && <small>{hours.reason[locale]}</small>}</dd></div>;})}</dl></div>
    <p className="compact-disclaimer">{text.home.demo} · {text.art.samplePhoto}</p>
  </section>;
}
