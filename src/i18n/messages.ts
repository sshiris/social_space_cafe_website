import en from "./messages/en.json";
import fi from "./messages/fi.json";
import sv from "./messages/sv.json";
import type { Locale } from "./locales";
export type Messages = typeof en;
export const messages: Record<Locale, Messages> = { en, fi, sv };
