import type { Localized } from "../i18n/locales.ts";

/** Local calendar date (YYYY-MM-DD); fixtures are checked by content:check. */
export type LocalDate = string;
/** Local wall-clock time (HH:mm), interpreted in Europe/Helsinki. */
export type LocalTime = string;
export type PublicationStatus = "draft" | "published";
export type Money = Readonly<{ amountCents: number; currency: "EUR" }>;
export type TimeInterval = Readonly<{
  opens: LocalTime;
  closes: LocalTime;
  /** 1 means the closing time is on the following day. */
  closingDayOffset: 0 | 1;
}>;
export type Description = Readonly<{ name: string; description: string }>;
export type DemoImage = Readonly<{
  kind: "placeholder";
  /** A brief for future photography, not a URL to a nonexistent asset. */
  brief: string;
  alt: Localized<string>;
}>;

// 1. Opening hours. ISO weekdays: Monday = 1, Sunday = 7.
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type VenueAreaId = "cafe" | "food-service" | "bar" | "souvenir-shop" | "meeting-room";
export type OpeningException = Readonly<{
  date: LocalDate;
  /** Empty intervals explicitly mean closed; otherwise replace regular hours. */
  intervals: readonly TimeInterval[];
  reason: Localized<string>;
}>;
export type VenueAreaHours = Readonly<{
  id: VenueAreaId;
  text: Localized<Description>;
  /** Every weekday is explicit. Empty intervals mean closed. */
  regular: Readonly<Record<Weekday, readonly TimeInterval[]>>;
  exceptions: readonly OpeningException[];
}>;

// 2. Weekly menu.
export type DietaryLabel = "vegan" | "vegetarian" | "gluten-free" | "lactose-free";
export type MenuItem = Readonly<{
  id: string;
  text: Localized<Description>;
  price: Money;
  dietaryLabels: readonly DietaryLabel[];
  /** Optional override of the day's serving interval. */
  servingTime?: TimeInterval;
}>;
export type MenuDay = Readonly<{
  date: LocalDate;
  servingTime: TimeInterval;
  items: readonly MenuItem[];
}>;
export type WeeklyMenu = Readonly<{
  id: string;
  weekStart: LocalDate;
  status: PublicationStatus;
  introduction: Localized<string>;
  days: readonly MenuDay[];
}>;

// 3. Bar and drinks. Array order is the display order in demo fixtures.
export type Drink = Readonly<{
  id: string;
  text: Localized<Description>;
  servingSize: Localized<string>;
  price: Money;
  visible: boolean;
}>;
export type DrinkCategory = Readonly<{
  id: string;
  name: Localized<string>;
  drinks: readonly Drink[];
}>;
export type BarContent = Readonly<{
  areaId: "bar";
  text: Localized<Description>;
  categories: readonly DrinkCategory[];
}>;

// 4. Informational events only.
export type EventPrice =
  | Readonly<{ kind: "free" }>
  | Readonly<{ kind: "fixed"; price: Money }>
  | Readonly<{ kind: "external"; label: Localized<string> }>;
export type VenueEvent = Readonly<{
  id: string;
  slug: string;
  text: Localized<{ title: string; description: string; location: string }>;
  image: DemoImage;
  /** ISO 8601 timestamps must include an explicit UTC offset. */
  startsAt: string;
  endsAt: string;
  price: EventPrice;
  externalBookingUrl?: string;
  minimumAge?: number;
  status: PublicationStatus;
  cancelled: boolean;
}>;

// 5. Catalogue, not inventory or commerce.
export type Souvenir = Readonly<{
  id: string;
  text: Localized<Description & { availability: string }>;
  price: Money;
  images: readonly DemoImage[];
  visible: boolean;
}>;

// 6. Room information, not bookable availability.
export type MeetingRoom = Readonly<{
  id: string;
  areaId: "meeting-room";
  text: Localized<Description & { availability: string; enquiryLabel: string }>;
  seatedCapacity: number;
  facilities: readonly Localized<string>[];
  images: readonly DemoImage[];
  price: Money;
  priceBasis: Localized<string>;
  contactEmail: string;
}>;
