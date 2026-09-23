import { isLocale, type Locale } from "./locales.ts";

/** Stable section IDs are shared by all locales and preserved by the language switcher. */
export const publicRoutes = [
  { key: "home", path: "#home" },
  { key: "menu", path: "#food-coffee" },
  { key: "bar", path: "#bar" },
  { key: "events", path: "#events" },
  { key: "souvenirs", path: "#souvenirs" },
  { key: "meetingRoom", path: "#meeting-room" },
  { key: "contact", path: "#contact" },
] as const;

/** Replace only the locale segment, retaining nested paths, search and hash. */
export function switchLocalePath(path: string, locale: Locale): string {
  const match = path.match(/^\/([^/?#]+)(.*)$/);
  if (!match || !isLocale(match[1])) return `/${locale}`;
  return `/${locale}${match[2]}`;
}
