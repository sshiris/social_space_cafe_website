import type { Locale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";
import { demoContext, venueText, openingHours, venueStory } from "@/content/demo";
import { formatDate, hoursOnDate } from "@/content/presentation";
import type { TimeInterval, VenueAreaHours } from "@/content/types";

function Interval({ interval, locale }: { interval: TimeInterval; locale: Locale }) {
  return <>{interval.opens}–{interval.closes}{interval.closingDayOffset === 1 && <small> ({messages[locale].home.nextDay})</small>}</>;
}

function Hours({ intervals, locale }: { intervals: readonly TimeInterval[]; locale: Locale }) {
  if (!intervals.length) return <>{messages[locale].home.closed}</>;
  return <>{intervals.map((interval, index) => <span key={`${interval.opens}-${interval.closes}`}>{index > 0 && ", "}<Interval interval={interval} locale={locale} /></span>)}</>;
}

function AreaSchedule({ area, locale }: { area: VenueAreaHours; locale: Locale }) {
  return <details className="schedule">
    <summary>{area.text[locale].name}</summary>
    <p className="muted">{area.text[locale].description}</p>
    <dl className="hours-list">
      {Object.entries(area.regular).map(([day, intervals]) => {
        const date = new Date(Date.UTC(2026, 8, 13 + Number(day)));
        const weekday = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(date);
        return <div key={day}><dt>{weekday}</dt><dd><Hours intervals={intervals} locale={locale} /></dd></div>;
      })}
    </dl>
    {area.exceptions.length > 0 && <><h4>{messages[locale].home.exceptions}</h4>{area.exceptions.map((exception) => <p key={exception.date}>{formatDate(exception.date, locale)}: <Hours intervals={exception.intervals} locale={locale} /> — {exception.reason[locale]}</p>)}</>}
  </details>;
}

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
          <aside id="souvenirs" tabIndex={-1} className="souvenir-aside"><h4>{text.nav.souvenirs}</h4><p>{venueStory[locale].souvenirNote}</p></aside>
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
          <h3>{ui.regularHours}</h3>
          {openingHours.map((area) => <AreaSchedule key={area.id} area={area} locale={locale} />)}
        </div>
      </div>
      <a className="text-link back-top" href={`/${locale}#home`}>{ui.back} ↑</a>
    </div>
  </section>;
}
