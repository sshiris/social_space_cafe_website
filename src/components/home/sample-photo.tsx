import Image from "next/image";
import { samplePhotography, type PhotoRole } from "@/content/demo/photography";
import type { Locale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";

export function SamplePhoto({ role, locale, className = "", priority = false }: { role: PhotoRole; locale: Locale; className?: string; priority?: boolean }) {
  const photo = samplePhotography[role];
  return <figure className={`sample-photo ${className}`}>
    <Image src={photo.src} width={photo.width} height={photo.height} alt={`${messages[locale].art.samplePhoto}: ${photo.alt[locale]}`} sizes="(max-width: 700px) 92vw, 55vw" preload={priority} />
    <figcaption>{messages[locale].art.samplePhoto} · <a href={photo.sourceUrl}>{photo.creator} / {photo.source}</a></figcaption>
  </figure>;
}
