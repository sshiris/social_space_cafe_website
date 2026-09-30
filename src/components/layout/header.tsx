"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages";
import { LanguageSwitcher } from "./language-switcher";
import { SocialLinks } from "./social-links";
import Image from "next/image";

// Keep the client-rendered shell independent from the mutable route registry so its
// initial server and browser trees always contain the same navigation items.
const primaryNavigation = [
  ["menu", "/menu"],
  ["takeaway", "/takeaway"],
  ["events", "/calendar#month-programme"],
  ["calendar", "/calendar"],
  ["booking", "/booking"],
  ["market", "/market"],
] as const;

export function Header({ locale, text, venueName }: { locale: Locale; text: Messages; venueName: string }) {
  const pathname = usePathname();
  const isHome = pathname === `/${locale}`;
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  return (
    <header className={`site-header ${isHome ? "over-hero" : ""}`} onKeyDown={(event) => {
      if (event.key === "Escape" && open) { setOpen(false); button.current?.focus(); }
    }}>
      <div className="header-top">
        <nav id="public-navigation" className={`public-navigation ${open ? "is-open" : ""}`} aria-label={text.navigation}>
          <div className="mobile-utilities"><LanguageSwitcher locale={locale} label={text.languages} /><SocialLinks text={text} /></div>
          <ul className="nav-list">
            {primaryNavigation.map(([key, path]) => (
              <li key={key}>
                <a href={`/${locale}${path}`} onClick={() => setOpen(false)}>{text.nav[key]}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-hero-utilities">
          <div className="mobile-social-group"><SocialLinks text={text} iconOnly /></div>
          <div className="mobile-actions-group">
            <a className="mobile-events-cta" href={`/${locale}/calendar#month-programme`}>{text.nav.events}</a>
            <button ref={button} type="button" className="menu-toggle" aria-expanded={open}
              aria-controls="public-navigation" aria-label={open ? text.closeMenu : text.openMenu}
              onClick={() => setOpen(!open)}>
              <span aria-hidden="true">{open ? "×" : "☰"}</span>
            </button>
          </div>
        </div>
        <Link
          className="brand"
          href={`/${locale}`}
          onClick={() => setOpen(false)}
        >
          <Image
            className="brand-logo"
            src="/images/logo.png"
            alt={`${venueName} Wasa`}
            width={3710}
            height={3710}
            sizes="(max-width: 600px) 100px, 160px"
          />
        </Link>
        <div className="desktop-utilities"><LanguageSwitcher locale={locale} label={text.languages} compact /><SocialLinks text={text} /></div>
      </div>
    </header>
  );
}
