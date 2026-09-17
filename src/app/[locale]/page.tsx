import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";

/** Minimal shell preview; the actual home page belongs to Milestone 3. */
export default async function LocalePreview({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const text = messages[locale];
  return (
    <section className="container shell-preview">
      <div className="preview-copy">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{text.title}</h1>
        <p className="intro">{text.intro}</p>
        <p className="preview-note">{text.note}</p>
      </div>
      <div className="venue-motif" aria-hidden="true"><span>s.</span><i /><small>SATAMA SOCIAL · VAASA / VASA</small></div>
    </section>
  );
}
