import { isLocale, type Locale } from "./locales.ts";

/** Published pages use routes; unbuilt detail pages retain usable homepage sections. */
export const publicRoutes = [
  { key: "home", kind: "page", placement: "primary", path: "" },
  { key: "menu", kind: "page", placement: "primary", path: "/menu" },
  { key: "events", kind: "section", placement: "primary", path: "#events" },
  { key: "meetingRoom", kind: "section", placement: "primary", path: "#meeting-room" },
  { key: "contact", kind: "section", placement: "primary", path: "#contact" },
  { key: "bar", kind: "section", placement: "secondary", path: "#bar" },
  { key: "souvenirs", kind: "section", placement: "secondary", path: "#souvenirs" },
] as const;

/** Replace only the locale segment, retaining nested paths, search and hash. */
export function switchLocalePath(path: string, locale: Locale): string {
  const match = path.match(/^\/([^/?#]+)(.*)$/);
  if (!match || !isLocale(match[1])) return `/${locale}`;
  return `/${locale}${match[2]}`;
}
