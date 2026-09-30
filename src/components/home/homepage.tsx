import Link from "next/link";
import type { Locale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";
import { demoContext, venueText, venueStory, storyImages, events, meetingRoom } from "@/content/demo";
import { formatDate, formatPrice, upcomingEvents } from "@/content/presentation";
import { PhotoSpace } from "./photo-space";
import { Visit } from "./visit";

export function Homepage({ locale }: { locale: Locale }) {
  const text = messages[locale];
  const ui = text.story;
  const story = venueStory[locale];
  const programme = upcomingEvents(events, demoContext.referenceDate, demoContext.timeZone).slice(0, 3);
  const eventDate = (timestamp: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, {
    ...options, timeZone: demoContext.timeZone,
  }).format(new Date(timestamp));

  return <div className="place-home">
    <aside className="prototype-banner"><div className="container"><strong>{text.home.demo}</strong><span>{text.home.branding}</span></div></aside>
    <section id="home" tabIndex={-1} className="place-hero" aria-labelledby="home-title">
      <div className="hero-art"><PhotoSpace image={storyImages.hero} locale={locale} tone="dark" /></div>
      <div className="container hero-editorial">
        <p className="hero-name">{demoContext.venueName}</p>
        <h1 id="home-title">{story.heroTitle}</h1>
        <p className="hero-line">{story.heroLine}</p>
        <a className="story-link" href={`/${locale}#events`}>{ui.events} <span aria-hidden="true">↓</span></a>
      </div>
    </section>

    <section className="place-identity container" aria-label={ui.intro}>
      <p className="identity-location">{venueText[locale].location}</p>
      <p>{story.identity}</p>
    </section>

    <section id="events" tabIndex={-1} className="place-events container" aria-labelledby="events-title">
      <div className="editorial-heading"><h2 id="events-title">{ui.events}</h2><a className="story-link" href={`/${locale}#event-programme`}>{ui.programme} <span aria-hidden="true">↓</span></a></div>
      <p className="programme-note">{text.home.sample} · {formatDate(demoContext.referenceDate, locale)}</p>
      <div id="event-programme" tabIndex={-1} className="editorial-programme">
        {programme.length ? programme.map((event) => <article key={event.id} className="programme-entry">
          <div className="programme-date"><span>{eventDate(event.startsAt, { day: "2-digit" })}</span><time dateTime={event.startsAt}>{eventDate(event.startsAt, { month: "short", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })}</time></div>
          <div><h3>{event.text[locale].title}</h3><p>{event.price.kind === "free" ? text.home.free : event.price.kind === "fixed" ? formatPrice(event.price.price, locale) : event.price.label[locale]}{event.minimumAge && <> · {text.home.age} {event.minimumAge}+</>}</p></div>
        </article>) : <p>{text.home.noEvents}</p>}
      </div>
      <a className="story-link" href={`/${locale}#contact`}>{ui.eventEnquiry} <span aria-hidden="true">→</span></a>
    </section>

    <section id="food-coffee" tabIndex={-1} className="place-hospitality" aria-labelledby="hospitality-title">
      <div className="hospitality-art"><PhotoSpace image={storyImages.hospitality} locale={locale} /></div>
      <div id="bar" tabIndex={-1} className="hospitality-copy">
        <p className="eyebrow">{ui.eat}</p><h2 id="hospitality-title">{story.eatTitle}</h2><p>{story.eatBody}</p>
        <Link className="story-link full-menu-link" href={`/${locale}/menu`}>{ui.viewMenu} <span aria-hidden="true">→</span></Link>
      </div>
    </section>

    <section className="place-atmosphere" aria-labelledby="atmosphere-title">
      <div className="container"><p className="eyebrow">{ui.atmosphere}</p><h2 id="atmosphere-title">{story.atmosphereTitle}</h2><p className="atmosphere-copy">{story.atmosphereBody}</p></div>
    </section>

    <section id="meeting-room" tabIndex={-1} className="place-gather container" aria-labelledby="gather-title">
      <div className="gather-copy"><p className="eyebrow">{ui.gather}</p><h2 id="gather-title">{story.gatherTitle}</h2><p>{story.gatherBody}</p><p className="gather-capacity">{text.home.capacity}: {meetingRoom.seatedCapacity} {text.home.people} · {text.home.sample}</p><a className="story-link" href={`/${locale}#contact`}>{meetingRoom.text[locale].enquiryLabel} <span aria-hidden="true">→</span></a></div>
      <PhotoSpace image={meetingRoom.images[0]} locale={locale} tone="light" />
    </section>
    <Visit locale={locale} />
  </div>;
}
