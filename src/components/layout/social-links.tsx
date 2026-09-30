import type { Messages } from "@/i18n/messages";
import { socialLinks } from "@/content/demo/social";

export function SocialLinks({ text, iconOnly = false }: { text: Messages; iconOnly?: boolean }) {
  return <nav className="social-links" aria-label={text.social.label}>
    {socialLinks.map((social) => social.href
      ? <a key={social.key} href={social.href} rel="noreferrer" aria-label={text.social[social.key]}>{iconOnly ? <SocialIcon kind={social.key} /> : text.social[social.key]}</a>
      : <span key={social.key} aria-disabled="true" aria-label={text.social[social.key]}>{iconOnly ? <SocialIcon kind={social.key} /> : text.social[social.key]}</span>)}
  </nav>;
}

function SocialIcon({ kind }: { kind: "instagram" | "facebook" }) {
  if (kind === "facebook") {
    return <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M14 8h3V4h-3c-3.1 0-5 1.9-5 5v3H6v4h3v4h4v-4h3.2l.8-4H13V9c0-.7.3-1 1-1Z" /></svg>;
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.3" cy="6.8" r="1" className="social-icon-dot" /></svg>;
}
