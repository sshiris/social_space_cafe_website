import type { TimeInterval, VenueAreaHours, Weekday } from "../types.ts";

const daytime = (opens: string, closes: string): TimeInterval[] => [
  { opens, closes, closingDayOffset: 0 },
];
const weekdays = (opens: string, closes: string): Record<Weekday, TimeInterval[]> => ({
  1: daytime(opens, closes), 2: daytime(opens, closes), 3: daytime(opens, closes),
  4: daytime(opens, closes), 5: daytime(opens, closes), 6: [], 7: [],
});

export const openingHours = [
  {
    id: "cafe",
    text: {
      en: { name: "Café", description: "Coffee, pastries and a place to pause." },
      fi: { name: "Kahvila", description: "Kahvia, leivonnaisia ja hetki omaa aikaa." },
      sv: { name: "Kafé", description: "Kaffe, bakverk och en stunds avkoppling." },
    },
    regular: { ...weekdays("08:00", "18:00"), 6: daytime("10:00", "18:00"), 7: daytime("10:00", "16:00") },
    exceptions: [{ date: "2026-12-24", intervals: [], reason: { en: "Closed for Christmas Eve", fi: "Suljettu jouluaattona", sv: "Stängt på julafton" } }],
  },
  {
    id: "food-service",
    text: {
      en: { name: "Food service", description: "Weekday lunch; serving times may vary by dish." },
      fi: { name: "Ruokapalvelu", description: "Lounas arkisin. Tarjoiluajat voivat vaihdella annoksittain." },
      sv: { name: "Matservering", description: "Lunch på vardagar. Serveringstiderna kan variera mellan rätterna." },
    },
    regular: weekdays("11:00", "14:30"), exceptions: [],
  },
  {
    id: "bar",
    text: {
      en: { name: "Bar", description: "Evening drinks from Wednesday to Saturday." },
      fi: { name: "Baari", description: "Iltaisin juomia keskiviikosta lauantaihin." },
      sv: { name: "Bar", description: "Kvällsdrinkar från onsdag till lördag." },
    },
    regular: {
      1: [], 2: [], 3: daytime("17:00", "23:00"), 4: daytime("17:00", "23:00"),
      5: [{ opens: "17:00", closes: "02:00", closingDayOffset: 1 }],
      6: [{ opens: "16:00", closes: "02:00", closingDayOffset: 1 }], 7: [],
    }, exceptions: [],
  },
  {
    id: "souvenir-shop",
    text: {
      en: { name: "Souvenir shop", description: "Browse gifts beside the café counter." },
      fi: { name: "Matkamuistomyymälä", description: "Tutustu lahjoihin kahvilan tiskin vieressä." },
      sv: { name: "Souvenirbutik", description: "Upptäck presenter vid kafédisken." },
    },
    regular: { ...weekdays("10:00", "17:00"), 6: daytime("10:00", "17:00"), 7: daytime("10:00", "16:00") }, exceptions: [],
  },
  {
    id: "meeting-room",
    text: {
      en: { name: "Meeting room", description: "Usual room-use hours. All arrangements must be confirmed by email." },
      fi: { name: "Kokoustila", description: "Tilan tavanomaiset käyttöajat. Kaikki järjestelyt vahvistetaan sähköpostitse." },
      sv: { name: "Mötesrum", description: "Vanliga användningstider. Alla arrangemang bekräftas via e-post." },
    },
    regular: weekdays("09:00", "18:00"), exceptions: [],
  },
] satisfies readonly VenueAreaHours[];
