import type { Locale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";
import { dietaryLabels } from "@/content/demo";
import { formatPrice } from "@/content/presentation";
import type { MenuItem, TimeInterval } from "@/content/types";

export function ServingTime({ interval, locale }: { interval: TimeInterval; locale: Locale }) {
  return <>{interval.opens}–{interval.closes}{interval.closingDayOffset === 1 && <> ({messages[locale].home.nextDay})</>}</>;
}

/** Shared by the compact homepage preview and the expanded weekly menu. */
export function MenuItems({ items, locale, headingLevel = 3 }: {
  items: readonly MenuItem[];
  locale: Locale;
  headingLevel?: 3 | 4;
}) {
  const Heading = headingLevel === 3 ? "h3" : "h4";
  return <div className="menu-items">
    {items.map((item) => (
      <article key={item.id} className="menu-item">
        <div className="item-heading">
          <Heading>{item.text[locale].name}</Heading>
          <strong>{formatPrice(item.price, locale)}</strong>
        </div>
        {item.text[locale].description && <p>{item.text[locale].description}</p>}
        {item.dietaryLabels.length > 0 && (
          <ul className="dietary-labels">
            {item.dietaryLabels.map((label) => <li key={label}>{dietaryLabels[label][locale]}</li>)}
          </ul>
        )}
        {item.servingTime && <p className="muted">{messages[locale].home.serving}: <ServingTime interval={item.servingTime} locale={locale} /></p>}
      </article>
    ))}
  </div>;
}
