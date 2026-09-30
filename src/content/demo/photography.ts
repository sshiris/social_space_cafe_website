/** TEMPORARY licensed visual references. None depicts Salonki. Replace assets here. */
export const samplePhotography = {
  "hero": {
    "src": "/images/demo/hero.webp",
    "width": 1600,
    "height": 1060,
    "source": "Pexels",
    "creator": "Vinh Lâm",
    "sourceUrl": "https://www.pexels.com/photo/wood-restaurant-bar-house-12740932/",
    "licenseUrl": "https://www.pexels.com/license/",
    "description": "Warm vintage café interior with wooden furniture and quiet cream walls",
    "intendedSection": "hero",
    "alt": {
      "en": "Warm vintage café interior with wooden furniture and quiet cream walls",
      "fi": "Lämminhenkinen vintagekahvila puukalusteineen ja rauhallisine vaaleine seinineen",
      "sv": "Varmt vintagekafé med trämöbler och lugna ljusa väggar"
    }
  },
  "cafe": {
    "src": "/images/demo/cafe.webp",
    "width": 1200,
    "height": 800,
    "source": "Pexels",
    "creator": "Liza Summer",
    "sourceUrl": "https://www.pexels.com/photo/best-friends-speaking-at-table-with-cups-of-coffee-6382453/",
    "licenseUrl": "https://www.pexels.com/license/",
    "description": "Conversation over coffee at a wooden table",
    "intendedSection": "cafe",
    "alt": {
      "en": "Conversation over coffee at a wooden table",
      "fi": "Keskustelua kahvikuppien äärellä",
      "sv": "Samtal över kaffe vid ett träbord"
    }
  },
  "events": {
    "src": "/images/demo/events.webp",
    "width": 1200,
    "height": 800,
    "source": "Pexels",
    "creator": "Kampus Production",
    "sourceUrl": "https://www.pexels.com/photo/people-doing-pottery-6023597/",
    "licenseUrl": "https://www.pexels.com/license/",
    "description": "People making pottery together",
    "intendedSection": "events",
    "alt": {
      "en": "People making pottery together",
      "fi": "Ihmisiä tekemässä keramiikkaa yhdessä",
      "sv": "Människor som skapar keramik tillsammans"
    }
  },
  "world": {
    "src": "/images/demo/world.webp",
    "width": 1200,
    "height": 1800,
    "source": "Pexels",
    "creator": "Darlene Alderson",
    "sourceUrl": "https://www.pexels.com/photo/friends-discussing-at-the-table-4384993/",
    "licenseUrl": "https://www.pexels.com/license/",
    "description": "Friends sharing ideas in evening light",
    "intendedSection": "world",
    "alt": {
      "en": "Friends sharing ideas in evening light",
      "fi": "Ystäviä jakamassa ajatuksia iltavalaistuksessa",
      "sv": "Vänner som delar idéer i kvällsljus"
    }
  },
  "meetings": {
    "src": "/images/demo/meetings.webp",
    "width": 1200,
    "height": 800,
    "source": "Pexels",
    "creator": "Ketut Subiyanto",
    "sourceUrl": "https://www.pexels.com/photo/a-group-of-friends-sitting-near-the-table-while-having-conversation-5054659/",
    "licenseUrl": "https://www.pexels.com/license/",
    "description": "Friends gathered around a small table",
    "intendedSection": "meetings",
    "alt": {
      "en": "Friends gathered around a small table",
      "fi": "Ystäviä pienen pöydän ääressä",
      "sv": "Vänner samlade kring ett litet bord"
    }
  },
  "souvenirs": {
    "src": "/images/demo/souvenirs.webp",
    "width": 1000,
    "height": 1498,
    "source": "Pexels",
    "creator": "Pavel Danilyuk",
    "sourceUrl": "https://www.pexels.com/photo/white-ceramic-bowl-on-the-shelf-7674533/",
    "licenseUrl": "https://www.pexels.com/license/",
    "description": "Ceramic cups and vessels on a shelf",
    "intendedSection": "souvenirs",
    "alt": {
      "en": "Ceramic cups and vessels on a shelf",
      "fi": "Keraamisia kuppeja ja astioita hyllyllä",
      "sv": "Keramikkoppar och kärl på en hylla"
    }
  }
} as const;
export type PhotoRole = keyof typeof samplePhotography;
