import type { Localized } from "../../i18n/locales.ts";
import type { DemoImage, DietaryLabel } from "../types.ts";

export const demoContext = {
  isDemo: true,
  venueName: "Satama Social",
  timeZone: "Europe/Helsinki",
  referenceDate: "2026-09-14",
  contactEmail: "hello@example.com",
  notice: {
    en: "Fictional venue and demo content. Prices, dietary information and translations require owner review.",
    fi: "Kuvitteellinen paikka ja esimerkkisisältö. Omistajan tulee tarkistaa hinnat, ruokavaliotiedot ja käännökset.",
    sv: "Fiktiv mötesplats och exempelinnehåll. Ägaren behöver granska priser, kostinformation och översättningar.",
  },
} as const;

export const dietaryLabels = {
  vegan: { en: "Vegan", fi: "Vegaaninen", sv: "Vegansk" },
  vegetarian: { en: "Vegetarian", fi: "Kasvis", sv: "Vegetarisk" },
  "gluten-free": { en: "Gluten-free", fi: "Gluteeniton", sv: "Glutenfri" },
  "lactose-free": { en: "Lactose-free", fi: "Laktoositon", sv: "Laktosfri" },
} satisfies Record<DietaryLabel, Localized<string>>;

export const demoImages = {
  salsa: {
    kind: "placeholder",
    brief: "Future venue photo: an evening social dance floor.",
    alt: { en: "Placeholder for the salsa evening photo", fi: "Salsaillan kuvan paikkamerkki", sv: "Platshållare för en bild från salsakvällen" },
  },
  dj: {
    kind: "placeholder",
    brief: "Future venue photo: DJ decks and a warmly lit bar.",
    alt: { en: "Placeholder for the DJ night photo", fi: "DJ-illan kuvan paikkamerkki", sv: "Platshållare för en bild från DJ-kvällen" },
  },
  room: {
    kind: "placeholder",
    brief: "Future room photo: a meeting table with twelve seats and a display.",
    alt: { en: "Placeholder for the meeting-room photo", fi: "Kokoustilan kuvan paikkamerkki", sv: "Platshållare för en bild av mötesrummet" },
  },
  roomDetail: {
    kind: "placeholder",
    brief: "Future room photo: presentation display, whiteboard and coffee station.",
    alt: { en: "Placeholder for the room facilities photo", fi: "Kokoustilan varustekuvan paikkamerkki", sv: "Platshållare för en bild av rummets utrustning" },
  },
  mug: {
    kind: "placeholder",
    brief: "Future product photo: a cream ceramic café mug.",
    alt: { en: "Placeholder for the ceramic mug photo", fi: "Keraamisen mukin kuvan paikkamerkki", sv: "Platshållare för en bild av keramikmuggen" },
  },
  tote: {
    kind: "placeholder",
    brief: "Future product photo: a natural cotton tote with the venue name.",
    alt: { en: "Placeholder for the tote bag photo", fi: "Kangaskassin kuvan paikkamerkki", sv: "Platshållare för en bild av tygkassen" },
  },
  postcard: {
    kind: "placeholder",
    brief: "Future product photo: three illustrated harbour postcards.",
    alt: { en: "Placeholder for the postcard set photo", fi: "Postikorttisarjan kuvan paikkamerkki", sv: "Platshållare för en bild av vykortssetet" },
  },
} satisfies Record<string, DemoImage>;
