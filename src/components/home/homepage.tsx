import type { ReactNode } from "react";
import type { Locale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";
import { demoContext, venueText, openingHours, weeklyMenus, bar, events, souvenirs, meetingRoom, dietaryLabels, coffeeDrinks } from "@/content/demo";
import { formatDate, formatPrice, hoursOnDate, publishedMenuForDate, upcomingEvents } from "@/content/presentation";
import type { DemoImage, TimeInterval, VenueAreaHours } from "@/content/types";

function Section({ id, title, eyebrow, children, className = "" }: { id: string; title: string; eyebrow?: string; children: ReactNode; className?: string }) {
  return <section id={id} tabIndex={-1} aria-labelledby={`${id}-title`} className={`home-section ${className}`}>
    <div className="container">
      <div className="section-heading">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2 id={`${id}-title`}>{title}</h2></div>
      {children}
    </div>
  </section>;
}

function Interval({ interval, locale }: { interval: TimeInterval; locale: Locale }) {
  return <>{interval.opens}–{interval.closes}{interval.closingDayOffset === 1 && <small> ({messages[locale].home.nextDay})</small>}</>;
}

function Hours({ intervals, locale }: { intervals: readonly TimeInterval[]; locale: Locale }) {
  if (!intervals.length) return <>{messages[locale].home.closed}</>;
  return <>{intervals.map((interval, index) => <span key={`${interval.opens}-${interval.closes}`}>{index > 0 && ", "}<Interval interval={interval} locale={locale} /></span>)}</>;
}

function ImagePlaceholder({ image, locale, variant = "" }: { image: DemoImage; locale: Locale; variant?: string }) {
  return <div className={`image-placeholder ${variant}`} role="img" aria-label={image.alt[locale]}>
    <span className="placeholder-shape" aria-hidden="true" />
    <span>{messages[locale].home.image}</span>
  </div>;
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

export function Homepage({ locale }: { locale: Locale }) {
  const text = messages[locale];
  const ui = text.home;
  const venue = venueText[locale];
  const date = demoContext.referenceDate;
  const menu = publishedMenuForDate(weeklyMenus, date);
  const publishedEvents = upcomingEvents(events, date, demoContext.timeZone);
  const room = meetingRoom.text[locale];
  const barHours = openingHours.find((area) => area.id === bar.areaId)!;
  const roomHours = openingHours.find((area) => area.id === meetingRoom.areaId)!;
  const eventDate = (timestamp: string) => new Intl.DateTimeFormat(locale, { timeZone: demoContext.timeZone, weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(timestamp));

  return <>
    <aside className="prototype-banner"><div className="container"><strong>{ui.demo}</strong><span>{ui.branding}</span></div></aside>
    <section id="home" className="container shell-preview" tabIndex={-1} aria-labelledby="home-title">
      <div className="preview-copy">
        <p className="eyebrow">{venue.location} · {text.eyebrow}</p>
        <h1 id="home-title">{venue.title}</h1>
        <p className="intro">{venue.introduction}</p>
        <div className="hero-actions"><a className="button" href={`/${locale}#food-coffee`}>{ui.explore} <span aria-hidden="true">↘</span></a><a className="text-link" href={`/${locale}#contact`}>{ui.visit} <span aria-hidden="true">↗</span></a></div>
      </div>
      <div className="venue-motif" aria-hidden="true"><span className="hero-circle" /><i /><small>{demoContext.venueName} · {ui.sample}</small></div>
    </section>

    <Section id="opening-hours" title={ui.today} className="opening-section">
      <p className="demo-date"><strong>{ui.clock}: <time dateTime={date}>{formatDate(date, locale)}</time></strong><br />{ui.clockNote}</p>
      <dl className="today-grid">
        {openingHours.map((area) => {
          const hours = hoursOnDate(area, date);
          return <div key={area.id}><dt>{area.text[locale].name}</dt><dd><Hours intervals={hours.intervals} locale={locale} /></dd>{hours.reason && <dd className="muted">{hours.reason[locale]}</dd>}</div>;
        })}
      </dl>
      <a className="text-link" href={`/${locale}#contact`}>{ui.regularHours} <span aria-hidden="true">↓</span></a>
    </Section>

    <Section id="food-coffee" title={ui.food} eyebrow="01">
      <div className="food-layout">
        <aside className="coffee-panel"><p className="eyebrow">{text.nav.home} / {ui.sample}</p><h3>{venue.coffeeTitle}</h3><p>{venue.coffeeDescription}</p>
          <ul className="price-list">{coffeeDrinks.filter((drink) => drink.visible).map((drink) => <li key={drink.id}><span>{drink.text[locale].name}<small>{drink.servingSize[locale]}</small></span><strong>{formatPrice(drink.price, locale)}</strong></li>)}</ul>
        </aside>
        <div className="weekly-menu"><h3>{ui.week}</h3>
          {menu ? <><p className="muted menu-range">{formatDate(menu.weekStart, locale)}</p><p>{menu.introduction[locale]}</p>
            {menu.days.map((day) => <details key={day.date} className="menu-day" open={day.date === date}>
              <summary><span>{formatDate(day.date, locale)}</span><span className="serving-time">{day.servingTime.opens}–{day.servingTime.closes}</span></summary>
              <div className="menu-items">{day.items.map((item) => <article key={item.id} className="menu-item"><div className="item-heading"><h4>{item.text[locale].name}</h4><strong>{formatPrice(item.price, locale)}</strong></div><p>{item.text[locale].description}</p><ul className="dietary-labels">{item.dietaryLabels.map((label) => <li key={label}>{dietaryLabels[label][locale]}</li>)}</ul>{item.servingTime && <p className="muted">{ui.serving}: <Interval interval={item.servingTime} locale={locale} /></p>}</article>)}</div>
            </details>)}
          </> : <p>{ui.noMenu}</p>}
        </div>
      </div>
    </Section>

    <Section id="bar" title={bar.text[locale].name} eyebrow={`02 / ${text.nav.bar}`} className="bar-section">
      <div className="section-lead"><p>{bar.text[locale].description}</p><a className="text-link" href={`/${locale}#events`}>{ui.upcoming} ↘</a></div>
      <div className="drink-grid">{bar.categories.map((category) => <div key={category.id} className="drink-category"><h3>{category.name[locale]}</h3><ul className="price-list">{category.drinks.filter((drink) => drink.visible).map((drink) => <li key={drink.id}><div><h4>{drink.text[locale].name}</h4><small>{drink.servingSize[locale]}</small><p>{drink.text[locale].description}</p></div><strong>{formatPrice(drink.price, locale)}</strong></li>)}</ul></div>)}</div>
      <AreaSchedule area={barHours} locale={locale} />
    </Section>

    <Section id="events" title={ui.upcoming} eyebrow="03">
      <p className="muted">{ui.sample} · {ui.clock}: {formatDate(date, locale)}</p>
      <div className="event-grid">{publishedEvents.length ? publishedEvents.map((event) => <article key={event.id} className="event-card">
        <ImagePlaceholder image={event.image} locale={locale} variant={event.id === "dj-harbour" ? "night" : "dance"} />
        <div className="card-body"><p className="eyebrow"><time dateTime={event.startsAt}>{eventDate(event.startsAt)}</time></p><h3>{event.text[locale].title}</h3><p className="muted"><time dateTime={event.startsAt}>{eventDate(event.startsAt)}</time> – <time dateTime={event.endsAt}>{eventDate(event.endsAt)}</time></p><p>{event.text[locale].description}</p><p className="muted">{event.text[locale].location}</p><div className="event-meta"><strong>{event.price.kind === "free" ? ui.free : event.price.kind === "fixed" ? formatPrice(event.price.price, locale) : event.price.label[locale]}</strong>{event.minimumAge && <span>{ui.age}: {event.minimumAge}+</span>}</div>{event.externalBookingUrl && <p className="muted example-link">{ui.exampleLink}</p>}</div>
      </article>) : <p>{ui.noEvents}</p>}</div>
    </Section>

    <Section id="souvenirs" title={text.nav.souvenirs} eyebrow={`04 / ${ui.shop}`} className="souvenir-section">
      <p className="section-description">{venue.souvenirIntroduction}</p>
      <div className="product-grid">{souvenirs.filter((product) => product.visible).map((product) => <article key={product.id} className="product-card"><ImagePlaceholder image={product.images[0]} locale={locale} /><div className="item-heading"><h3>{product.text[locale].name}</h3><strong>{formatPrice(product.price, locale)}</strong></div><p>{product.text[locale].description}</p><p className="muted availability">{product.text[locale].availability}</p></article>)}</div>
    </Section>

    <Section id="meeting-room" title={text.nav.meetingRoom} eyebrow="05">
      <div className="room-grid"><ImagePlaceholder image={meetingRoom.images[0]} locale={locale} variant="room" /><div><h3>{room.name}</h3><p>{room.description}</p><dl className="room-facts"><div><dt>{ui.capacity}</dt><dd>{meetingRoom.seatedCapacity} {ui.people}</dd></div><div><dt>{ui.sample}</dt><dd>{formatPrice(meetingRoom.price, locale)} <small>{meetingRoom.priceBasis[locale]}</small></dd></div></dl><ul className="facilities">{meetingRoom.facilities.map((facility) => <li key={facility.en}>{facility[locale]}</li>)}</ul><p className="muted">{room.availability}</p><a className="button" href={`/${locale}#contact`}>{room.enquiryLabel} ↗</a></div></div>
      <AreaSchedule area={roomHours} locale={locale} />
    </Section>

    <Section id="contact" title={ui.contact} eyebrow="06" className="contact-section">
      <div className="contact-grid"><div><h3>{venue.location}</h3><p>{venue.visitDescription}</p><p className="address-placeholder">{venue.address}</p><h4>{ui.email}</h4><p className="email-example">{demoContext.contactEmail}</p><p className="muted">{venue.contactNote}</p><p className="demo-disclaimer">{demoContext.notice[locale]}</p></div><div><h3>{ui.regularHours}</h3>{openingHours.map((area) => <AreaSchedule key={area.id} area={area} locale={locale} />)}</div></div>
      <a className="text-link back-top" href={`/${locale}#home`}>{ui.back} ↑</a>
    </Section>
  </>;
}
