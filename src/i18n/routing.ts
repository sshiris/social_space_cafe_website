import { isLocale, type Locale } from "./locales.ts";

/** Published pages use routes; unbuilt detail pages retain usable homepage sections. */
export const publicRoutes = [
  { key: "menu", kind: "page", placement: "primary", path: "/menu" },
  { key: "takeaway", kind: "page", placement: "primary", path: "/takeaway" },
  { key: "events", kind: "page", placement: "primary", path: "/calendar#month-programme" },
  { key: "calendar", kind: "page", placement: "primary", path: "/calendar" },
  { key: "booking", kind: "page", placement: "primary", path: "/booking" },
  { key: "market", kind: "page", placement: "primary", path: "/market" },
  { key: "home", kind: "page", placement: "secondary", path: "" },
  { key: "contact", kind: "section", placement: "secondary", path: "#contact" },
] as const;

/** Replace only the locale segment, retaining nested paths, search and hash. */
export function switchLocalePath(path: string, locale: Locale): string {
  const match = path.match(/^\/([^/?#]+)(.*)$/);
  if (!match || !isLocale(match[1])) return `/${locale}`;
  return `/${locale}${match[2]}`;
}
