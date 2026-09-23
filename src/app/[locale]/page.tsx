import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { Homepage } from "@/components/home/homepage";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Homepage locale={locale} />;
}
