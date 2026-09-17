import type { Souvenir } from "../types.ts";
import { demoImages } from "./shared.ts";

export const souvenirs = [
  {
    id: "ceramic-mug", price: { amountCents: 1800, currency: "EUR" }, images: [demoImages.mug], visible: true,
    text: {
      en: { name: "Satama ceramic mug", description: "A cream-coloured 300 ml mug for slow mornings and coffee breaks.", availability: "Available at the café counter." },
      fi: { name: "Sataman keraaminen muki", description: "Kermanvärinen 300 ml:n muki kiireettömiin aamuihin ja kahvitaukoihin.", availability: "Saatavilla kahvilan tiskiltä." },
      sv: { name: "Satamas keramikmugg", description: "En gräddvit mugg på 300 ml för lugna morgnar och kaffepauser.", availability: "Finns vid kafédisken." },
    },
  },
  {
    id: "cotton-tote", price: { amountCents: 1500, currency: "EUR" }, images: [demoImages.tote], visible: true,
    text: {
      en: { name: "Everyday cotton tote", description: "A natural-coloured cotton bag with long handles and a Satama print.", availability: "Available in the souvenir corner." },
      fi: { name: "Arjen puuvillakassi", description: "Luonnonvärinen puuvillakassi, jossa on pitkät kahvat ja Satama-painatus.", availability: "Saatavilla matkamuistonurkkauksesta." },
      sv: { name: "Tygkasse för vardagen", description: "En naturfärgad bomullskasse med långa handtag och Satama-tryck.", availability: "Finns i souvenirhörnan." },
    },
  },
  {
    id: "harbour-postcards", price: { amountCents: 600, currency: "EUR" }, images: [demoImages.postcard], visible: true,
    text: {
      en: { name: "Harbour postcard trio", description: "Three illustrated A6 postcards inspired by Finnish waterfronts.", availability: "Temporarily unavailable. Ask our team about the next delivery." },
      fi: { name: "Kolme satamapostikorttia", description: "Kolme kuvitettua A6-postikorttia Suomen rantojen tunnelmista.", availability: "Tilapäisesti loppu. Kysy henkilökunnalta seuraavasta toimituksesta." },
      sv: { name: "Tre hamnvykort", description: "Tre illustrerade A6-vykort inspirerade av finländska strandmiljöer.", availability: "Tillfälligt slut. Fråga personalen om nästa leverans." },
    },
  },
] satisfies readonly Souvenir[];
