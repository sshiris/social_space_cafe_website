import type { Localized } from "../../i18n/locales.ts";
import type { DemoImage } from "../types.ts";

/** Proposed editorial copy for owner review, not confirmed operational claims. */
type StoryText = {
  heroTitle: string;
  heroLine: string;
  identity: string;
  eatTitle: string;
  eatBody: string;
  atmosphereTitle: string;
  atmosphereBody: string;
  gatherTitle: string;
  gatherBody: string;
  souvenirNote: string;
};
export const venueStory = {
  "en": {
    "heroTitle": "A place to meet,\ntaste & experience.",
    "heroLine": "Your everyday café and lounge in Vaasa. Coffee, lunch and drinks; a place for conversation, music and shared moments.",
    "identity": "From the first coffee to the last song, Salonki is a place to spend time together. Come for lunch, stay for a conversation, find yourself in the middle of something new.",
    "eatTitle": "From coffee\nto after hours.",
    "eatBody": "A slow coffee. A proper lunch. A drink that turns into an evening. Food and hospitality bring the different hours of Salonki together.",
    "atmosphereTitle": "Come as you are.\nStay a little longer.",
    "atmosphereBody": "A conversation across the table. Music that draws you in. A dance, a familiar face, a moment to yourself. There is more than one way to feel at home here.",
    "gatherTitle": "Make room\nfor your people.",
    "gatherBody": "Bring a small group together for ideas, conversation or a change of scene. Our meeting-room concept gives you space to make the occasion your own.",
    "souvenirNote": "And perhaps a little something to take home: a small souvenir selection is part of the Salonki idea."
  },
  "fi": {
    "heroTitle": "Paikka kohdata,\nmaistaa ja kokea.",
    "heroLine": "Arjen kahvila ja lounge Vaasassa. Kahvia, lounasta ja juomia; paikka keskusteluille, musiikille ja yhteisille hetkille.",
    "identity": "Ensimmäisestä kahvista viimeiseen kappaleeseen Salonki on paikka yhdessäololle. Tule lounaalle, jää juttelemaan ja löydä itsesi jonkin uuden ääreltä.",
    "eatTitle": "Kahvihetkestä\nillan tunnelmaan.",
    "eatBody": "Kiireetön kahvi. Kunnon lounas. Juoma, josta alkaa yhteinen ilta. Ruoka ja vieraanvaraisuus yhdistävät Salongin päivän eri hetket.",
    "atmosphereTitle": "Tule sellaisena kuin olet.\nViivy vielä hetki.",
    "atmosphereBody": "Keskustelu pöydän ääressä. Musiikki, joka vie mukanaan. Tanssi, tutut kasvot tai hetki omaa rauhaa. Täällä voi viihtyä monella tavalla.",
    "gatherTitle": "Tilaa\nomalle porukalle.",
    "gatherBody": "Kokoa pieni ryhmä yhteen jakamaan ajatuksia, keskustelemaan tai vaihtamaan maisemaa. Kokoustilamme idea on antaa tilaa teidän näköisellenne tapaamiselle.",
    "souvenirNote": "Ehkä myös pieni muisto mukaan: matkamuistovalikoima on osa Salongin ideaa."
  },
  "sv": {
    "heroTitle": "En plats att mötas,\nsmaka och uppleva.",
    "heroLine": "Ditt vardagskafé och din lounge i Vasa. Kaffe, lunch och drycker; en plats för samtal, musik och gemensamma stunder.",
    "identity": "Från första kaffet till sista låten är Salonki en plats för gemenskap. Kom för lunch, stanna för ett samtal och upptäck något nytt längs vägen.",
    "eatTitle": "Från kaffestund\ntill kvällsliv.",
    "eatBody": "En lugn kopp kaffe. En god lunch. En drink som blir till en hel kväll. Mat och gästfrihet binder samman dygnets olika stunder på Salonki.",
    "atmosphereTitle": "Kom som du är.\nStanna en stund till.",
    "atmosphereBody": "Ett samtal över bordet. Musik som lockar dig närmare. En dans, ett bekant ansikte eller en stund för dig själv. Här finns många sätt att känna sig hemma.",
    "gatherTitle": "Plats för\nditt sällskap.",
    "gatherBody": "Samla en liten grupp för idéer, samtal eller ett miljöombyte. Vår mötesrumsidé ger utrymme för en träff på era villkor.",
    "souvenirNote": "Kanske också ett litet minne att ta med hem: ett urval av souvenirer är en del av Salonki-idén."
  }
} satisfies Localized<StoryText>;

/** Photography briefs only. No venue photography is fabricated. */
export const storyImages = {
  hero: {
    kind: "placeholder",
    brief: "Owner-supplied wide venue atmosphere photograph, with space for editorial text.",
    alt: { en: "Space reserved for a Salonki venue photograph", fi: "Salongin tilakuvalle varattu paikka", sv: "Plats reserverad för ett foto av Salonki" },
  },
  hospitality: {
    kind: "placeholder",
    brief: "Owner-supplied photograph of the café table, food or evening bar.",
    alt: { en: "Space reserved for a food and drinks photograph", fi: "Ruoka- ja juomakuvalle varattu paikka", sv: "Plats reserverad för ett foto av mat och dryck" },
  },
} satisfies Record<string, DemoImage>;
