import type { Locale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";
import { demoContext, venueText, openingHours } from "@/content/demo";
import { formatDate, hoursOnDate } from "@/content/presentation";
import { Hours } from "./hours";

export function Visit({ locale }: { locale: Locale }) {
  const text = messages[locale];
  const ui = text.home;
  const venue = venueText[locale];
  const date = demoContext.referenceDate;
  return <section id="contact" tabIndex={-1} className="place-visit" aria-labelledby="contact-title">
    <div className="container">
      <h2 id="contact-title">{text.story.visit}</h2>
      <div className="contact-grid">
        <div><h3>{venue.location}</h3><p>{venue.visitDescription}</p><p className="address-placeholder">{venue.address}</p><h4>{ui.email}</h4><p className="email-example">{demoContext.contactEmail}</p><p className="muted">{venue.contactNote}</p>

          <p className="demo-disclaimer">{demoContext.notice[locale]}</p>
        </div>
        <div>
          <div id="opening-hours" tabIndex={-1} className="visit-hours">
            <h3>{ui.today}</h3>
            <p className="demo-date"><strong>{ui.clock}: <time dateTime={date}>{formatDate(date, locale)}</time></strong><br />{ui.clockNote}</p>
            <dl className="visit-today-hours">{openingHours.map((area) => {
              const hours = hoursOnDate(area, date);
              return <div key={area.id}><dt>{area.text[locale].name}</dt><dd><Hours intervals={hours.intervals} locale={locale} />{hours.reason && <small>{hours.reason[locale]}</small>}</dd></div>;
            })}</dl>
          </div>

        </div>
      </div>
      <a className="text-link back-top" href={`/${locale}#home`}>{ui.back} ↑</a>
    </div>
  </section>;
}
