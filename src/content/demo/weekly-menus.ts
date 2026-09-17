import type { WeeklyMenu } from "../types.ts";

export const weeklyMenus = [{
  id: "menu-2026-09-14", weekStart: "2026-09-14", status: "published",
  introduction: {
    en: "Lunch includes a side salad, bread and filter coffee. Ask our team about allergens before ordering.",
    fi: "Lounaaseen kuuluu salaatti, leipä ja suodatinkahvi. Kysy henkilökunnalta allergeeneista ennen tilaamista.",
    sv: "I lunchen ingår sallad, bröd och bryggkaffe. Fråga personalen om allergener innan du beställer.",
  },
  days: [
    {
      date: "2026-09-14", servingTime: { opens: "11:00", closes: "14:30", closingDayOffset: 0 },
      items: [
        {
          id: "mon-salmon-soup", price: { amountCents: 1450, currency: "EUR" }, dietaryLabels: ["gluten-free", "lactose-free"],
          text: {
            en: { name: "Creamy salmon soup", description: "Salmon, potatoes and leek in a lactose-free cream broth with dill. Bread served separately." },
            fi: { name: "Kermainen lohikeitto", description: "Lohta, perunaa ja purjoa laktoosittomassa kermaliemessä, viimeistelty tillillä. Leipä tarjoillaan erikseen." },
            sv: { name: "Krämig laxsoppa", description: "Lax, potatis och purjolök i laktosfri gräddbuljong med dill. Bröd serveras separat." },
          },
        },
        {
          id: "mon-lentil-stew", price: { amountCents: 1290, currency: "EUR" }, dietaryLabels: ["vegan", "gluten-free"],
          text: {
            en: { name: "Red lentil and tomato stew", description: "Gently spiced lentils with roasted carrots, rice and parsley." },
            fi: { name: "Punainen linssi-tomaattipata", description: "Miedosti maustettuja linssejä, paahdettua porkkanaa, riisiä ja persiljaa." },
            sv: { name: "Gryta med röda linser och tomat", description: "Milt kryddade linser med rostade morötter, ris och persilja." },
          },
        },
      ],
    },
    {
      date: "2026-09-15", servingTime: { opens: "11:00", closes: "14:30", closingDayOffset: 0 },
      items: [
        {
          id: "tue-chicken", price: { amountCents: 1490, currency: "EUR" }, dietaryLabels: ["gluten-free", "lactose-free"],
          text: {
            en: { name: "Lemon and herb chicken", description: "Roasted chicken with potatoes, green beans and lemon dressing." },
            fi: { name: "Sitruuna-yrttikana", description: "Paahdettua kanaa, perunaa, vihreitä papuja ja sitruunakastiketta." },
            sv: { name: "Citron- och örtkyckling", description: "Ugnsstekt kyckling med potatis, gröna bönor och citrondressing." },
          },
        },
        {
          id: "tue-beetroot", price: { amountCents: 1350, currency: "EUR" }, dietaryLabels: ["vegan"],
          text: {
            en: { name: "Roasted beetroot bowl", description: "Beetroot, pearl barley, white beans and pumpkin seeds with tahini dressing." },
            fi: { name: "Paahdettu punajuurikulho", description: "Punajuurta, ohraa, valkoisia papuja ja kurpitsansiemeniä tahinikastikkeella." },
            sv: { name: "Skål med rostade rödbetor", description: "Rödbetor, pärlkorn, vita bönor och pumpafrön med tahinidressing." },
          },
        },
      ],
    },
    {
      date: "2026-09-16", servingTime: { opens: "11:00", closes: "14:30", closingDayOffset: 0 },
      items: [
        {
          id: "wed-meatballs", price: { amountCents: 1450, currency: "EUR" }, dietaryLabels: ["lactose-free"],
          text: {
            en: { name: "Meatballs and mashed potatoes", description: "Beef and pork meatballs with lactose-free mash, brown sauce and lingonberries." },
            fi: { name: "Lihapullat ja perunamuusi", description: "Naudan- ja sianlihapyöryköitä, laktoositonta muusia, ruskeaa kastiketta ja puolukkaa." },
            sv: { name: "Köttbullar med potatismos", description: "Köttbullar av nöt och gris med laktosfritt mos, brunsås och lingon." },
          },
        },
        {
          id: "wed-mushroom", price: { amountCents: 1390, currency: "EUR" }, dietaryLabels: ["vegetarian", "gluten-free"],
          text: {
            en: { name: "Mushroom risotto", description: "Creamy arborio rice with mushrooms, thyme and vegetarian hard cheese." },
            fi: { name: "Sienirisotto", description: "Kermaista arborioriisiä, sieniä, timjamia ja kasvisruokavalioon sopivaa kovaa juustoa." },
            sv: { name: "Svamprisotto", description: "Krämigt arborioris med svamp, timjan och vegetarisk hårdost." },
          },
        },
      ],
    },
    {
      date: "2026-09-17", servingTime: { opens: "11:00", closes: "14:30", closingDayOffset: 0 },
      items: [
        {
          id: "thu-fish", price: { amountCents: 1590, currency: "EUR" }, dietaryLabels: ["gluten-free", "lactose-free"],
          text: {
            en: { name: "Baked whitefish", description: "Whitefish with boiled potatoes, roasted vegetables and lactose-free dill sauce." },
            fi: { name: "Uunisiika", description: "Siikaa, keitettyjä perunoita, paahdettuja kasviksia ja laktoositonta tillikastiketta." },
            sv: { name: "Ugnsbakad sik", description: "Sik med kokt potatis, rostade grönsaker och laktosfri dillsås." },
          },
        },
        {
          id: "thu-pea-soup", price: { amountCents: 1190, currency: "EUR" }, dietaryLabels: ["vegan", "gluten-free"],
          text: {
            en: { name: "Finnish pea soup", description: "Slow-cooked yellow peas with carrots, onion and marjoram. Bread served separately." },
            fi: { name: "Hernekeitto", description: "Pitkään haudutettuja keltaisia herneitä, porkkanaa, sipulia ja meiramia. Leipä tarjoillaan erikseen." },
            sv: { name: "Finsk ärtsoppa", description: "Långkokta gula ärter med morot, lök och mejram. Bröd serveras separat." },
          },
        },
      ],
    },
    {
      date: "2026-09-18", servingTime: { opens: "11:00", closes: "14:30", closingDayOffset: 0 },
      items: [
        {
          id: "fri-beef", price: { amountCents: 1590, currency: "EUR" }, dietaryLabels: ["gluten-free", "lactose-free"],
          servingTime: { opens: "11:30", closes: "14:30", closingDayOffset: 0 },
          text: {
            en: { name: "Slow-braised beef", description: "Beef with root vegetables, roasted potatoes and a rich pan sauce." },
            fi: { name: "Pitkään haudutettu nauta", description: "Naudanlihaa, juureksia, paahdettuja perunoita ja täyteläistä paistinkastiketta." },
            sv: { name: "Långkokt nötkött", description: "Nötkött med rotfrukter, rostad potatis och mustig steksky." },
          },
        },
        {
          id: "fri-cauliflower", price: { amountCents: 1350, currency: "EUR" }, dietaryLabels: ["vegan", "gluten-free"],
          text: {
            en: { name: "Roasted cauliflower and chickpeas", description: "Spiced cauliflower with chickpeas, rice and lemon-tahini sauce." },
            fi: { name: "Paahdettu kukkakaali ja kikherneet", description: "Maustettua kukkakaalia, kikherneitä, riisiä ja sitruuna-tahinikastiketta." },
            sv: { name: "Rostad blomkål och kikärter", description: "Kryddad blomkål med kikärter, ris och citron-tahinisås." },
          },
        },
      ],
    },
  ],
}] satisfies readonly WeeklyMenu[];
