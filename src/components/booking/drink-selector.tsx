"use client";
import { drinkPackages } from "@/lib/booking-extras";
import { QuantitySelector } from "./quantity-selector";
import type { Messages } from "@/i18n/messages";

export type DrinkSelection = { drinkId: string; quantity: number };
type Props = {
  selectedDrinks: DrinkSelection[];
  onDrinksChange: (drinks: DrinkSelection[]) => void;
  disabled?: boolean;
  text: Messages["booking"]["extras"];
};
export function DrinkSelector({
  selectedDrinks,
  onDrinksChange,
  disabled,
  text,
}: Props) {
  return (
    <QuantitySelector
      title={text.drinks}
      text={text}
      disabled={disabled}
      items={drinkPackages.map((item) => ({
        id: item.drinkId,
        name: text.items[item.drinkId],
      }))}
      selected={selectedDrinks.map((item) => ({
        id: item.drinkId,
        quantity: item.quantity,
      }))}
      onChange={(items) =>
        onDrinksChange(
          items.map((item) => ({ drinkId: item.id, quantity: item.quantity })),
        )
      }
    />
  );
}
