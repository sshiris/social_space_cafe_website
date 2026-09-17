import { isLocale, type Locale } from "./locales.ts";

export const publicRoutes = [
  { key: "home", path: "", available: true },
  { key: "menu", path: "/menu", available: false },
  { key: "bar", path: "/bar", available: false },
  { key: "events", path: "/events", available: false },
  { key: "souvenirs", path: "/souvenirs", available: false },
  { key: "meetingRoom", path: "/meeting-room", available: false },
  { key: "contact", path: "/contact", available: false },
] as const;

/** Replace only the locale segment, retaining nested paths, search and hash. */
export function switchLocalePath(path: string, locale: Locale): string {
  const match = path.match(/^\/([^/?#]+)(.*)$/);
  if (!match || !isLocale(match[1])) return `/${locale}`;
  return `/${locale}${match[2]}`;
}
