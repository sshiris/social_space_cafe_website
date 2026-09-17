import type { MeetingRoom } from "../types.ts";
import { demoContext, demoImages } from "./shared.ts";

export const meetingRoom = {
  id: "harbour-room", areaId: "meeting-room", seatedCapacity: 12,
  price: { amountCents: 4500, currency: "EUR" },
  priceBasis: { en: "per hour", fi: "tunnilta", sv: "per timme" },
  contactEmail: demoContext.contactEmail,
  images: [demoImages.room, demoImages.roomDetail],
  text: {
    en: { name: "The Harbour Room", description: "A calm room for team meetings, workshops and small gatherings. Seats up to twelve around one table. Coffee and light refreshments can be discussed when you enquire.", availability: "Usually available for agreed use Monday–Friday, 09:00–18:00. Contact us to discuss your preferred date; these hours do not indicate live availability.", enquiryLabel: "Enquire about the room" },
    fi: { name: "Satamakabinetti", description: "Rauhallinen tila tiimipalavereihin, työpajoihin ja pieniin tapaamisiin. Yhden pöydän ääreen mahtuu enintään kaksitoista henkilöä. Kahveista ja kevyestä tarjoilusta voidaan sopia tiedustelun yhteydessä.", availability: "Tilan käytöstä voidaan yleensä sopia maanantaista perjantaihin klo 09.00–18.00. Ota yhteyttä ja kerro toivomasi ajankohta. Ajat eivät kuvaa reaaliaikaista varaustilannetta.", enquiryLabel: "Tiedustele kokoustilaa" },
    sv: { name: "Hamnrummet", description: "Ett lugnt rum för teammöten, workshoppar och mindre sammankomster. Upp till tolv personer ryms runt ett bord. Kaffe och lättare förtäring kan diskuteras vid förfrågan.", availability: "Rummet kan vanligtvis användas enligt överenskommelse måndag–fredag kl. 09.00–18.00. Kontakta oss om önskat datum. Tiderna visar inte tillgänglighet i realtid.", enquiryLabel: "Fråga om mötesrummet" },
  },
  facilities: [
    { en: "Wi-Fi", fi: "Wi-Fi", sv: "Wi-Fi" },
    { en: "55-inch display with HDMI", fi: "55 tuuman näyttö ja HDMI-liitäntä", sv: "55-tumsskärm med HDMI" },
    { en: "Whiteboard and markers", fi: "Valkotaulu ja tussit", sv: "Whiteboard och pennor" },
    { en: "Power sockets near the table", fi: "Pistorasiat pöydän lähellä", sv: "Eluttag nära bordet" },
  ],
} satisfies MeetingRoom;
