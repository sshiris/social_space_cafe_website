import type { Messages } from "@/i18n/messages";
export function Footer({ text, venueName }: { text: Messages; venueName: string }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div><p className="footer-brand">{venueName}</p><p>{text.footer}</p></div>
        <div className="footer-location"><p>{text.location}</p><span>{text.preview}</span></div>
      </div>
    </footer>
  );
}
