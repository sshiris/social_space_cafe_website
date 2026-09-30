import Link from "next/link";
import type { Locale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";
import { demoContext } from "@/content/demo";
import type { monthView } from "@/content/calendar";

export function CalendarView({ locale, view }: { locale: Locale; view: ReturnType<typeof monthView> }) {
  const text = messages[locale];
  const title = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(view.first);
  const eventTime = (date: string) => new Intl.DateTimeFormat(locale, { timeZone: demoContext.timeZone, day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(date));
  return <div className="calendar-page container"><p className="eyebrow">{text.home.sample}</p><h1>{text.nav.calendar}</h1><p>{demoContext.notice[locale]}</p><p>{text.art.calendarNote}</p>
    <nav className="calendar-month-nav" aria-label={text.nav.calendar}><Link href={`/${locale}/calendar?month=${view.previous}`} aria-label={text.art.previous}>← <span>{text.art.previous}</span></Link><h2>{title}</h2><Link href={`/${locale}/calendar?month=${view.next}`} aria-label={text.art.next}><span>{text.art.next}</span> →</Link></nav>
    <table className="calendar-grid"><caption className="sr-only">{title}</caption><thead><tr>{Array.from({ length: 7 }, (_, i) => <th key={i} scope="col">{new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 8, 14 + i)))}</th>)}</tr></thead><tbody>{Array.from({ length: view.cells.length / 7 }, (_, row) => <tr key={row}>{view.cells.slice(row * 7, row * 7 + 7).map((cell, col) => <td key={col}>{cell && (cell.events.length ? <a href={`#event-${cell.events[0].id}`} aria-label={`${cell.day}: ${cell.events.map(event => event.text[locale].title).join(", ")}`}>{cell.day}<span aria-hidden="true">●</span></a> : <span>{cell.day}</span>)}</td>)}</tr>)}</tbody></table>
    <section id="month-programme" tabIndex={-1} className="calendar-agenda"><h2>{text.art.agenda}</h2>{view.programme.length ? view.programme.map(event => <article key={event.id} id={`event-${event.id}`} tabIndex={-1}><h3>{event.text[locale].title}</h3><p><time dateTime={event.startsAt}>{eventTime(event.startsAt)}</time> – <time dateTime={event.endsAt}>{eventTime(event.endsAt)}</time></p><p>{event.text[locale].description}</p></article>) : <p>{text.art.emptyMonth}</p>}</section>
  </div>;
}
