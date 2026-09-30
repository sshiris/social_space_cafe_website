import Link from "next/link";
import type { Locale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";
import { demoContext, venueText, venueStory, events, meetingRoom, openingHours } from "@/content/demo";
import { formatDate, formatPrice, upcomingEvents, hoursOnDate } from "@/content/presentation";
import { SamplePhoto } from "./sample-photo";
import { InkTrail } from "./ink-trail";
import { Hours } from "./hours";
import { Visit } from "./visit";

export function Homepage({ locale }: { locale: Locale }) {
  const text = messages[locale];
  const story = venueStory[locale];
  const programme = upcomingEvents(events, demoContext.referenceDate, demoContext.timeZone).slice(0, 3);
  const eventDate = (timestamp: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { ...options, timeZone: demoContext.timeZone }).format(new Date(timestamp));
  return <div className="place-home art-home">
    <InkTrail />
    <aside className="prototype-banner"><div className="container"><strong>{text.home.demo}</strong><span>{text.home.branding}</span></div></aside>
    <div className="hero-stage"><section id="home" tabIndex={-1} className="art-hero container" aria-labelledby="home-title" data-ink-surface>
      <div id="food-coffee" tabIndex={-1} className="hero-editorial">
        <p className="eyebrow">{venueText[locale].location}</p><p className="hero-name">{demoContext.venueName}</p>
        <h1 id="home-title">{story.heroTitle}</h1><p className="hero-line">{story.heroLine}</p>
        <Link className="story-link full-menu-link" href={`/${locale}/menu`}>{text.story.viewMenu} <span aria-hidden="true">→</span></Link>
        <div className="hero-hours" aria-label={text.home.hours}>
          <p>{text.home.clock}: <time dateTime={demoContext.referenceDate}>{formatDate(demoContext.referenceDate, locale)}</time></p>
          <dl>{openingHours.filter(area => ["cafe", "food-service", "bar"].includes(area.id)).map(area => {
            const hours = hoursOnDate(area, demoContext.referenceDate);
            return <div key={area.id}><dt>{area.text[locale].name}</dt><dd><Hours intervals={hours.intervals} locale={locale} />{hours.reason && <small>{hours.reason[locale]}</small>}</dd></div>;
          })}</dl>
          <a href={`/${locale}#opening-hours`}>{text.home.hours} ↓</a>
        </div>
      </div>
      <SamplePhoto role="hero" locale={locale} priority className="hero-print" />
      <span className="ink-loop" aria-hidden="true" />
    </section></div>
    <section className="place-identity container" aria-label={text.story.intro}><p>{story.identity}</p></section>
    <section id="events" tabIndex={-1} className="art-events" aria-labelledby="events-title">
      <div className="container"><div className="events-heading"><p className="eyebrow">{text.nav.events}</p><h2 id="events-title">{text.story.events}</h2></div>
        <div className="events-composition"><SamplePhoto role="events" locale={locale} /><div className="event-sheet"><p className="programme-note">{text.home.sample} · {formatDate(demoContext.referenceDate, locale)}</p><div id="event-programme" tabIndex={-1}>
          {programme.length ? programme.map(event => <article key={event.id} className="programme-entry"><div className="programme-date"><span>{eventDate(event.startsAt, { day: "2-digit" })}</span><time dateTime={event.startsAt}>{eventDate(event.startsAt, { month: "short", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })}</time></div><div><h3>{event.text[locale].title}</h3><p>{event.price.kind === "free" ? text.home.free : event.price.kind === "fixed" ? formatPrice(event.price.price, locale) : event.price.label[locale]}</p></div></article>) : <p>{text.home.noEvents}</p>}
        </div><div className="story-actions"><Link className="story-link" href={`/${locale}/calendar#month-programme`}>{text.art.allEvents} →</Link><Link className="story-link" href={`/${locale}/calendar`}>{text.nav.calendar} →</Link></div></div></div>
      </div>
    </section>
    <div className="world-stage"><section className="art-world container" aria-labelledby="world-title" data-ink-surface><div className="world-copy"><p className="eyebrow">{text.art.dayToNight}</p><h2 id="world-title">{story.atmosphereTitle}</h2><p>{story.atmosphereBody}</p></div><SamplePhoto role="world" locale={locale} /><span className="ink-loop" aria-hidden="true" /></section>
    </div>
    <section id="meeting-room" tabIndex={-1} className="art-gather container" aria-labelledby="gather-title"><SamplePhoto role="meetings" locale={locale} /><div className="editorial-copy"><p className="eyebrow">{text.nav.meetingRoom}</p><h2 id="gather-title">{story.gatherTitle}</h2><p>{story.gatherBody}</p><p className="gather-capacity">{text.home.capacity}: {meetingRoom.seatedCapacity} {text.home.people} · {text.home.sample}</p><a className="story-link" href={`/${locale}#contact`}>{meetingRoom.text[locale].enquiryLabel} →</a></div></section>
    <section id="souvenirs" tabIndex={-1} className="art-souvenirs container" aria-labelledby="souvenirs-title"><div><p className="eyebrow">{text.nav.souvenirs}</p><h2 id="souvenirs-title">{text.art.souvenirTitle}</h2><p>{story.souvenirNote}</p><a className="story-link" href={`/${locale}#contact`}>{text.home.shop} →</a></div><SamplePhoto role="souvenirs" locale={locale} /></section>
    <Visit locale={locale} />
  </div>;
}
