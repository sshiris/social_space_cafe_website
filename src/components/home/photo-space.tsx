import type { Locale } from "@/i18n/locales";
import type { DemoImage } from "@/content/types";
import { messages } from "@/i18n/messages";

/** An explicitly abstract photo slot. Replace its interior with approved photography later. */
export function PhotoSpace({ image, locale, tone = "warm" }: {
  image: DemoImage;
  locale: Locale;
  tone?: "warm" | "dark" | "light";
}) {
  return <figure className={`photo-space photo-space-${tone}`}>
    <div className="photo-composition" role="img" aria-label={image.alt[locale]}>
      <span className="photo-arch" aria-hidden="true" />
      <span className="photo-disc" aria-hidden="true" />
    </div>
    <figcaption>{messages[locale].story.photo}</figcaption>
  </figure>;
}
