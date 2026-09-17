import type { VenueEvent } from "../types.ts";
import { demoImages } from "./shared.ts";

export const events = [
  {
    id: "salsa-september", slug: "salsa-social-september", status: "published", cancelled: false,
    startsAt: "2026-09-18T19:00:00+03:00", endsAt: "2026-09-18T23:00:00+03:00",
    price: { kind: "fixed", price: { amountCents: 1200, currency: "EUR" } }, minimumAge: 18,
    externalBookingUrl: "https://example.com/demo/salsa-social", image: demoImages.salsa,
    text: {
      en: { title: "Friday Salsa Social", description: "Start with a beginner-friendly salsa lesson at 19:00, followed by social dancing from 20:00. Come solo or with a partner. Admission includes the lesson. Demo booking link only.", location: "Satama Social · main floor" },
      fi: { title: "Perjantain salsailta", description: "Ilta alkaa aloittelijoille sopivalla salsatunnilla klo 19.00. Vapaa tanssi alkaa klo 20.00. Tule yksin tai parin kanssa. Tunti sisältyy pääsymaksuun. Varauslinkki on vain esimerkki.", location: "Satama Social · pääsali" },
      sv: { title: "Salsakväll på fredag", description: "Börja med en nybörjarvänlig salsalektion kl. 19.00 och fortsätt med socialdans från kl. 20.00. Kom själv eller med en partner. Lektionen ingår i inträdet. Bokningslänken är endast ett exempel.", location: "Satama Social · stora salen" },
    },
  },
  {
    id: "dj-harbour", slug: "harbour-sounds-dj-night", status: "published", cancelled: false,
    startsAt: "2026-09-19T20:00:00+03:00", endsAt: "2026-09-20T01:30:00+03:00",
    price: { kind: "free" }, minimumAge: 18, image: demoImages.dj,
    text: {
      en: { title: "Harbour Sounds: DJ Night", description: "An easy-going evening of soul, disco and warm house music with our guest DJ. Free entry; no advance booking. The bar closes at 02:00.", location: "Satama Social · bar" },
      fi: { title: "Harbour Sounds: DJ-ilta", description: "Rento ilta soulin, discon ja lämpimän housemusiikin parissa vierailevan DJ:n kanssa. Vapaa pääsy, ei ennakkovarausta. Baari sulkeutuu klo 02.00.", location: "Satama Social · baari" },
      sv: { title: "Harbour Sounds: DJ-kväll", description: "En avslappnad kväll med soul, disco och varm housemusik med vår gäst-DJ. Fritt inträde, ingen förhandsbokning. Baren stänger kl. 02.00.", location: "Satama Social · baren" },
    },
  },
  {
    id: "salsa-october", slug: "salsa-social-october", status: "draft", cancelled: false,
    startsAt: "2026-10-02T19:00:00+03:00", endsAt: "2026-10-02T23:00:00+03:00",
    price: { kind: "fixed", price: { amountCents: 1200, currency: "EUR" } }, minimumAge: 18, image: demoImages.salsa,
    text: {
      en: { title: "October Salsa Social", description: "A proposed autumn dance evening. Programme awaiting confirmation; this draft must not appear in public listings.", location: "Satama Social · main floor" },
      fi: { title: "Lokakuun salsailta", description: "Suunnitteilla oleva syksyn tanssi-ilta. Ohjelma odottaa vahvistusta. Tätä luonnosta ei näytetä julkisessa tapahtumalistassa.", location: "Satama Social · pääsali" },
      sv: { title: "Salsakväll i oktober", description: "En planerad danskväll i höst. Programmet väntar på bekräftelse. Utkastet ska inte visas i den offentliga evenemangslistan.", location: "Satama Social · stora salen" },
    },
  },
] satisfies readonly VenueEvent[];
