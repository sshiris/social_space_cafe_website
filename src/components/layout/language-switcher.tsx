"use client";

import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/locales";
import { switchLocalePath } from "@/i18n/routing";

const languageNames = { en: "English", fi: "Suomi", sv: "Svenska" };

export function LanguageSwitcher({ locale, label, compact = false }: { locale: Locale; label: string; compact?: boolean }) {
  const pathname = usePathname();
  const links = locales.map((language) => (
        <a key={language} href={switchLocalePath(pathname, language)}
          lang={language} hrefLang={language} aria-label={languageNames[language]}
          aria-current={language === locale ? "page" : undefined}
          onClick={(event) => {
            // Preserve query/hash too, without making the static shell depend on search params.
            const target = switchLocalePath(window.location.pathname + window.location.search + window.location.hash, language);
            event.currentTarget.href = target;
          }}>
          {language.toUpperCase()}
        </a>
      ));
  if (compact) return <details className="language-dropdown"><summary aria-label={label}>{languageNames[locale].toUpperCase()} <span aria-hidden="true">⌄</span></summary><nav className="language-dropdown-options" aria-label={label}>{links}</nav></details>;
  return <nav className="language-switcher" aria-label={label}>{links}</nav>;
}
