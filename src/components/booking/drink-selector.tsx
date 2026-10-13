"use client";

export type DrinkSelection = {
  drinkId: string;
  quantity: number;
};

type DrinkSelectorProps = {
  selectedDrinks: DrinkSelection[];
  onDrinksChange: (drinks: DrinkSelection[]) => void;
};

const drinkPackages = [
  { drinkId: "white_wine", name: "white wine" },
  { drinkId: "red_wine", name: "red wine" },
  { drinkId: "beer", name: "beer" },
  { drinkId: "cocktail", name: "cocktail" },
];

export function DrinkSelector({
  selectedDrinks,
  onDrinksChange,
}: DrinkSelectorProps) {
  function increaseQuantity(drinkId: string) {
    const existingDrink = selectedDrinks.find(
      (item) => item.drinkId === drinkId,
    );
    if (existingDrink) {
      const updatedDrinks = selectedDrinks.map((item) =>
        item.drinkId === drinkId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );

      onDrinksChange(updatedDrinks);
    } else {
      onDrinksChange([...selectedDrinks, { drinkId, quantity: 1 }]);
    }
  }
  function decreaseQuantity(drinkId: string) {
    const updatedDrinks = selectedDrinks
      .map((item) =>
        item.drinkId === drinkId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      )
      .filter((item) => item.quantity > 0);
    onDrinksChange(updatedDrinks);
  }
  return (
    <section>
      <h2>Additional Drinks</h2>
      <p>Select the drinks you would like to add to your booking:</p>
      {drinkPackages.map((drink) => {
        const quantity =
          selectedDrinks.find((item) => item.drinkId === drink.drinkId)
            ?.quantity ?? 0;
        return (
          <div key={drink.drinkId}>
            <h3>{drink.name}</h3>
            <button
              type="button"
              disabled={quantity === 0}
              onClick={() => decreaseQuantity(drink.drinkId)}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => increaseQuantity(drink.drinkId)}
            >
              +
            </button>
          </div>
        );
      })}
    </section>
  );
}
