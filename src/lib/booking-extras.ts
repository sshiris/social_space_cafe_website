export const MAX_EXTRAS_PER_CATEGORY = 100;


export const snackPackages = [
  { id: "savory", name: "Savory" },
  { id: "sweet", name: "Sweet" },
  { id: "combo", name: "Combo" },
]as const;

export const drinkPackages = [
  { drinkId: "white_wine", name: "white wine" },
  { drinkId: "red_wine", name: "red wine" },
  { drinkId: "beer", name: "beer" },
  { drinkId: "cocktail", name: "cocktail" },
] as const;