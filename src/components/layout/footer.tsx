import type { Locale } from "@/i18n/locales";
import { publicRoutes } from "@/i18n/routing";
import type { Messages } from "@/i18n/messages";
export function Footer({ text, venueName, locale }: { text: Messages; venueName: string; locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div><p className="footer-brand">{venueName}</p><p>{text.footer}</p></div>
        <nav className="footer-links" aria-label={text.navigation}>{publicRoutes.filter((route) => route.placement === "secondary").map((route) => <a key={route.key} href={`/${locale}${route.path}`}>{text.nav[route.key]}</a>)}</nav>
        <div className="footer-location"><p>{text.location}</p><span>{text.preview}</span></div>
      </div>
    </footer>
  );
}
