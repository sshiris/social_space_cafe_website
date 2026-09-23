import type { Localized } from "../../i18n/locales.ts";
import type { Drink } from "../types.ts";

/** Additional editorial demo copy for the one-page prototype, not confirmed facts. */
type VenueText = {
  title: string; introduction: string; coffeeTitle: string; coffeeDescription: string;
  location: string; visitDescription: string; address: string; contactNote: string;
  souvenirIntroduction: string;
};
export const venueText = {
  "en": {
    "title": "Good food. Good company.",
    "introduction": "Coffee in the morning, a relaxed lunch, an evening together. A welcoming meeting place in Vaasa, with room for everyday moments and special occasions.",
    "coffeeTitle": "Stay for another cup.",
    "coffeeDescription": "Settle in with a filter coffee and a cinnamon bun, or meet a friend for a leisurely weekday lunch. This sample café offer is here to help you picture the space.",
    "location": "Vaasa, Finland",
    "visitDescription": "We are exploring a new café and social space in Vaasa. The street address, directions, accessibility details and contact information will be added once confirmed by the owner.",
    "address": "Street address to be confirmed",
    "contactNote": "Example email only — enquiries are not received here.",
    "souvenirIntroduction": "A small keepsake of your visit. Browse the sample collection; purchases would take place at the venue."
  },
  "fi": {
    "title": "Hyvää ruokaa. Hyvää seuraa.",
    "introduction": "Aamukahvit, kiireetön lounas ja yhteinen ilta. Kotoisa kohtaamispaikka Vaasassa, jossa on tilaa arjen hetkille ja erityisille tilaisuuksille.",
    "coffeeTitle": "Jää vielä kahville.",
    "coffeeDescription": "Nauti suodatinkahvista ja korvapuustista tai tapaa ystävä kiireettömällä arkilounaalla. Tämä kahvilan esimerkkivalikoima auttaa hahmottamaan paikan tunnelmaa.",
    "location": "Vaasa, Suomi",
    "visitDescription": "Suunnittelemme uutta kahvilaa ja kohtaamispaikkaa Vaasaan. Katuosoite, saapumisohjeet, esteettömyystiedot ja yhteystiedot lisätään omistajan vahvistettua ne.",
    "address": "Katuosoite vahvistetaan myöhemmin",
    "contactNote": "Vain esimerkkiosoite — tähän osoitteeseen ei vastaanoteta tiedusteluja.",
    "souvenirIntroduction": "Pieni muisto vierailustasi. Tutustu esimerkkivalikoimaan. Ostokset tehtäisiin paikan päällä."
  },
  "sv": {
    "title": "God mat. Gott sällskap.",
    "introduction": "Morgonkaffe, en lugn lunch och en kväll tillsammans. En välkomnande mötesplats i Vasa med rum för vardagens stunder och speciella tillfällen.",
    "coffeeTitle": "Stanna på en kopp till.",
    "coffeeDescription": "Slå dig ner med bryggkaffe och en kanelbulle, eller träffa en vän över en lugn vardagslunch. Det här exempelutbudet ger en känsla av kaféet.",
    "location": "Vasa, Finland",
    "visitDescription": "Vi planerar ett nytt kafé och en social mötesplats i Vasa. Gatuadress, vägbeskrivning, tillgänglighetsinformation och kontaktuppgifter läggs till när ägaren har bekräftat dem.",
    "address": "Gatuadressen bekräftas senare",
    "contactNote": "Endast en exempeladress — förfrågningar tas inte emot här.",
    "souvenirIntroduction": "Ett litet minne av ditt besök. Utforska exempelutbudet; inköp skulle göras på plats."
  }
} satisfies Localized<VenueText>;

/** Reuses the existing display-only drink shape; no ordering model. */
export const coffeeDrinks = [
  {
    id: "filter-coffee", price: { amountCents: 350, currency: "EUR" }, visible: true,
    servingSize: { en: "cup", fi: "kuppi", sv: "kopp" },
    text: {
      en: { name: "Filter coffee", description: "Freshly brewed coffee for a quiet moment." },
      fi: { name: "Suodatinkahvi", description: "Vastakeitettyä kahvia rauhalliseen hetkeen." },
      sv: { name: "Bryggkaffe", description: "Nybryggt kaffe för en lugn stund." },
    },
  },
  {
    id: "oat-latte", price: { amountCents: 490, currency: "EUR" }, visible: true,
    servingSize: { en: "cup", fi: "kuppi", sv: "kopp" },
    text: {
      en: { name: "Oat latte", description: "Espresso with steamed oat drink." },
      fi: { name: "Kauralatte", description: "Espressoa ja höyrytettyä kaurajuomaa." },
      sv: { name: "Havrelatte", description: "Espresso med ångad havredryck." },
    },
  },
] satisfies readonly Drink[];
