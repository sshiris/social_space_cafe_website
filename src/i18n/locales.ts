export const locales = ["en", "fi", "sv"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** All prototype content must supply every supported language. */
export type Localized<T> = Readonly<Record<Locale, T>>;

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}
