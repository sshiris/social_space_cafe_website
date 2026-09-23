"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages";
import { publicRoutes } from "@/i18n/routing";
import { LanguageSwitcher } from "./language-switcher";

export function Header({ locale, text, venueName }: { locale: Locale; text: Messages; venueName: string }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === "Escape" && open) { setOpen(false); button.current?.focus(); }
    }}>
      <div className="container header-top">
        <Link className="brand" href={`/${locale}`} onClick={() => setOpen(false)} aria-label={venueName}>
          <span className="brand-mark" aria-hidden="true">s.</span>
          <span className="brand-name">{venueName}</span>
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
              <a href={`/${locale}${route.path}`} onClick={(event) => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                const target = document.getElementById(route.path.slice(1));
                if (target) {
                  event.preventDefault();
                  // Collapse the mobile menu before calculating the target's scroll position.
                  flushSync(() => setOpen(false));
                  window.history.pushState(null, "", `/${locale}${window.location.search}${route.path}`);
                  target.focus({ preventScroll: true });
                  target.scrollIntoView({ block: "start" });
                } else setOpen(false);
              }}>{text.nav[route.key]}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
