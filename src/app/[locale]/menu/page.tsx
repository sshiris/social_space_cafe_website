import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { messages } from "@/i18n/messages";
import { demoContext, weeklyMenus } from "@/content/demo";
import { publishedMenuForDate } from "@/content/presentation";
import { WeeklyMenuView } from "@/components/menu/weekly-menu";

export async function generateMetadata({ params }: PageProps<"/[locale]/menu">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: `${messages[locale].menu.title} · ${demoContext.venueName}` };
}

export default async function MenuPage({ params }: PageProps<"/[locale]/menu">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const menu = publishedMenuForDate(weeklyMenus, demoContext.referenceDate);
  return <WeeklyMenuView menu={menu} locale={locale} referenceDate={demoContext.referenceDate} />;
}
