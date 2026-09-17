import type { BarContent } from "../types.ts";

export const bar = {
  areaId: "bar",
  text: {
    en: { name: "Evenings at Satama", description: "Meet over a local beer, a glass of wine or an alcohol-free drink. Check our events for dance nights and DJs." },
    fi: { name: "Illat Satamassa", description: "Tavataan paikallisen oluen, viinilasillisen tai alkoholittoman juoman äärellä. Tutustu tanssi- ja DJ-iltoihimme tapahtumasivulla." },
    sv: { name: "Kvällar på Satama", description: "Träffas över en lokal öl, ett glas vin eller något alkoholfritt. Se våra evenemang för danskvällar och DJ-musik." },
  },
  categories: [
    {
      id: "beer-cider", name: { en: "Beer and cider", fi: "Oluet ja siiderit", sv: "Öl och cider" },
      drinks: [
        {
          id: "house-lager", price: { amountCents: 790, currency: "EUR" }, visible: true,
          servingSize: { en: "400 ml", fi: "40 cl", sv: "40 cl" },
          text: {
            en: { name: "House lager", description: "Crisp Finnish lager with a light malt finish." },
            fi: { name: "Talon lager", description: "Raikas suomalainen lager, jossa on kevyt maltainen jälkimaku." },
            sv: { name: "Husets lager", description: "Frisk finländsk lager med en lätt maltig avslutning." },
          },
        },
        {
          id: "apple-cider", price: { amountCents: 850, currency: "EUR" }, visible: true,
          servingSize: { en: "330 ml", fi: "33 cl", sv: "33 cl" },
          text: {
            en: { name: "Dry apple cider", description: "Fresh apple flavour with a dry finish." },
            fi: { name: "Kuiva omenasiideri", description: "Raikas omenan maku ja kuiva jälkimaku." },
            sv: { name: "Torr äppelcider", description: "Frisk äppelsmak med torr avslutning." },
          },
        },
      ],
    },
    {
      id: "wine", name: { en: "Wine", fi: "Viinit", sv: "Vin" },
      drinks: [
        {
          id: "house-white", price: { amountCents: 890, currency: "EUR" }, visible: true,
          servingSize: { en: "120 ml", fi: "12 cl", sv: "12 cl" },
          text: {
            en: { name: "House white wine", description: "A dry white wine with citrus notes. Ask about today's selection." },
            fi: { name: "Talon valkoviini", description: "Kuiva, sitruksinen valkoviini. Kysy päivän valikoimasta." },
            sv: { name: "Husets vita vin", description: "Ett torrt vitt vin med citrustoner. Fråga om dagens urval." },
          },
        },
        {
          id: "house-red", price: { amountCents: 890, currency: "EUR" }, visible: true,
          servingSize: { en: "120 ml", fi: "12 cl", sv: "12 cl" },
          text: {
            en: { name: "House red wine", description: "A medium-bodied red with soft berry notes." },
            fi: { name: "Talon punaviini", description: "Keskitäyteläinen punaviini, jossa on pehmeitä marjaisia vivahteita." },
            sv: { name: "Husets röda vin", description: "Ett medelfylligt rött vin med mjuka bärtoner." },
          },
        },
      ],
    },
    {
      id: "alcohol-free", name: { en: "Alcohol-free", fi: "Alkoholittomat", sv: "Alkoholfritt" },
      drinks: [
        {
          id: "lingonberry-spritz", price: { amountCents: 650, currency: "EUR" }, visible: true,
          servingSize: { en: "250 ml", fi: "25 cl", sv: "25 cl" },
          text: {
            en: { name: "Lingonberry spritz", description: "Lingonberry, lime and sparkling water over ice." },
            fi: { name: "Puolukkaspritz", description: "Puolukkaa, limeä ja kivennäisvettä jäillä." },
            sv: { name: "Lingonspritz", description: "Lingon, lime och kolsyrat vatten med is." },
          },
        },
        {
          id: "zero-lager", price: { amountCents: 590, currency: "EUR" }, visible: true,
          servingSize: { en: "330 ml", fi: "33 cl", sv: "33 cl" },
          text: {
            en: { name: "Alcohol-free lager", description: "A refreshing 0.0% lager." },
            fi: { name: "Alkoholiton lager", description: "Raikas 0,0-prosenttinen lager." },
            sv: { name: "Alkoholfri lager", description: "En uppfriskande lager med 0,0 % alkohol." },
          },
        },
      ],
    },
  ],
} satisfies BarContent;
