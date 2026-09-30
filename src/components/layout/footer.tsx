import type { Locale } from "@/i18n/locales";
import Image from "next/image";
import { locales } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages";
import { demoContext, openingHours } from "@/content/demo";
import { formatDate, hoursOnDate } from "@/content/presentation";
import { Hours } from "@/components/home/hours";
export function Footer({ text, venueName, locale }: { text: Messages; venueName: string; locale: Locale }) {
  const visibleHours = openingHours.filter((area) => ["cafe", "food-service", "bar"].includes(area.id));
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-hours"><p className="footer-label">{text.home.hours}</p><p className="footer-date">{text.home.clock}: {formatDate(demoContext.referenceDate, locale)}</p><dl>{visibleHours.map((area) => <div key={area.id}><dt>{area.text[locale].name}</dt><dd><Hours intervals={hoursOnDate(area, demoContext.referenceDate).intervals} locale={locale} /></dd></div>)}</dl></div>
        <div className="footer-center"><Image className="footer-logo" src="/images/logo.png" alt={venueName} width={3710} height={3710} sizes="90px" /><p>{text.footer}</p></div>
        <div className="footer-location"><p>{text.location}</p><p>{demoContext.contactEmail}</p><nav className="footer-languages" aria-label={text.languages}>{locales.map((language) => <a key={language} href={`/${language}`} lang={language} aria-current={language === locale ? "page" : undefined}>{language.toUpperCase()}</a>)}</nav></div>
      </div>
    </footer>
  );
}
