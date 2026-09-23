import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale } from "@/i18n/locales";
import { demoContext, venueText } from "@/content/demo";
import { messages } from "@/i18n/messages";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "../globals.css";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: `${demoContext.venueName} · ${venueText[locale].location}`, description: venueText[locale].introduction };
}

export default async function PublicLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const text = messages[locale];
  return (
    <html lang={locale}>
      <body>
        <a className="skip-link" href="#main-content">{text.skip}</a>
        <Header key={locale} locale={locale} text={text} venueName={demoContext.venueName} />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer text={text} venueName={demoContext.venueName} />
      </body>
    </html>
  );
}
