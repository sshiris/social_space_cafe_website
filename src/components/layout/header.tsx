"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages";
import { publicRoutes } from "@/i18n/routing";
import { LanguageSwitcher } from "./language-switcher";

export function Header({ locale, text }: { locale: Locale; text: Messages }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === "Escape" && open) { setOpen(false); button.current?.focus(); }
    }}>
      <div className="container header-top">
        <Link className="brand" href={`/${locale}`} onClick={() => setOpen(false)} aria-label="Satama Social">
          <span className="brand-mark" aria-hidden="true">s.</span>
          <span>satama<span className="brand-subtitle">SOCIAL</span></span>
        </Link>
        <span className="header-tagline">{text.tagline}</span>
        <LanguageSwitcher locale={locale} label={text.languages} />
        <button ref={button} type="button" className="menu-toggle" aria-expanded={open}
          aria-controls="public-navigation" aria-label={open ? text.closeMenu : text.openMenu}
          onClick={() => setOpen(!open)}>
          <span aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
      </div>
      <nav id="public-navigation" className={`public-navigation ${open ? "is-open" : ""}`} aria-label={text.navigation}>
        <ul className="container nav-list">
          {publicRoutes.map((route) => (
            <li key={route.key}>
              {route.available ? (
                <Link href={`/${locale}${route.path}`} aria-current={pathname === `/${locale}${route.path}` ? "page" : undefined}
                  onClick={() => setOpen(false)}>{text.nav[route.key]}</Link>
              ) : (
                <span className="nav-unavailable" aria-disabled="true" title={text.soon}>
                  {text.nav[route.key]}<span className="sr-only"> — {text.soon}</span>
                </span>
              )}
            </li>
          ))}
        </ul>
        <p className="container nav-note">{text.status}</p>
      </nav>
    </header>
  );
}
