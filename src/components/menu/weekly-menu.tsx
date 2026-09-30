import Link from "next/link";
import type { Locale } from "@/i18n/locales";
import type { WeeklyMenu } from "@/content/types";
import { messages } from "@/i18n/messages";
import { formatDate, formatMenuWeekRange } from "@/content/presentation";
import { MenuItems, ServingTime } from "./menu-items";

export function WeeklyMenuView({ menu, locale, referenceDate }: {
  menu: WeeklyMenu | undefined;
  locale: Locale;
  referenceDate: string;
}) {
  const text = messages[locale];
  return <div className="container full-menu-page">
    <Link className="text-link" href={`/${locale}#food-coffee`}>← {text.menu.back}</Link>
    <header className="menu-page-heading">
      <p className="eyebrow">{text.home.sample}</p>
      <h1>{text.menu.title}</h1>
      {menu && <p className="menu-week-range">{text.menu.weekRange} · {formatMenuWeekRange(menu.weekStart, locale)}</p>}
      <aside className="menu-demo-note">
        <p>{text.menu.demoNote}</p>
        <p><strong>{text.home.clock}: <time dateTime={referenceDate}>{formatDate(referenceDate, locale)}</time></strong></p>
      </aside>
    </header>
    {menu && menu.days.length > 0 ? <>
      <p className="menu-introduction">{menu.introduction[locale]}</p>
      <div className="full-menu-days">
        {[...menu.days].sort((a, b) => a.date.localeCompare(b.date)).map((day) => (
          <section key={day.date} className="full-menu-day" aria-labelledby={`day-${day.date}`}>
            <header className="menu-day-heading">
              <h2 id={`day-${day.date}`}><time dateTime={day.date}>{formatDate(day.date, locale)}</time></h2>
              <p className="muted">{text.home.serving}: <ServingTime interval={day.servingTime} locale={locale} /></p>
            </header>
            <MenuItems items={day.items} locale={locale} />
          </section>
        ))}
      </div>
    </> : <section className="menu-empty" aria-labelledby="menu-empty-title">
      <h2 id="menu-empty-title">{text.menu.emptyTitle}</h2>
      <p>{text.menu.emptyDescription}</p>
    </section>}
    <Link className="text-link" href={`/${locale}#food-coffee`}>← {text.menu.back}</Link>
  </div>;
}
