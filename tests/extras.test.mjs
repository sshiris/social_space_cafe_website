import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { load } from "./helpers.mjs";

const text = load("src/i18n/messages.ts").messages.en.booking.extras;
const { validateBooking } = load("src/lib/booking-validation.ts");
const base = { date: "2099-01-01", selectedSlots: ["09:00"], name: "Guest", email: "guest@example.com", numberOfPeople: 2, selectedPackages: [], selectedDrinks: [] };
test("extras enforce category totals, known IDs, integer quantities and no duplicates", () => {
  assert.ok(validateBooking({ ...base, selectedPackages: [{ packageId: "sweet", quantity: 100 }] }));
  for (const selectedPackages of [[{ packageId: "sweet", quantity: 101 }], [{ packageId: "sweet", quantity: 60 }, { packageId: "savory", quantity: 41 }], [{ packageId: "unknown", quantity: 1 }], [{ packageId: "sweet", quantity: 1.5 }], [{ packageId: "sweet", quantity: 1 }, { packageId: "sweet", quantity: 1 }]]) {
    assert.equal(validateBooking({ ...base, selectedPackages }), null);
  }
  assert.equal(validateBooking({ ...base, selectedDrinks: [{ drinkId: "beer", quantity: 60 }, { drinkId: "cocktail", quantity: 41 }] }), null);
});
for (const [file, component, selected, onChange, id] of [["snack-package-selector", "SnackPackageSelector", "selectedPackages", "onPackagesChange", "packageId"], ["drink-selector", "DrinkSelector", "selectedDrinks", "onDrinksChange", "drinkId"]]) {
  const Component = load(`src/components/booking/${file}.tsx`)[component];
  test(`${component} disables every button during submission and caps increments`, () => {
    const props = { text, [selected]: [{ [id]: id === "packageId" ? "sweet" : "beer", quantity: 100 }], [onChange]: () => {} };
    const pending = renderToStaticMarkup(createElement(Component, { ...props, disabled: true }));
    const buttons = pending.match(/<button\b[^>]*>/g);
    assert.ok(buttons.length > 0);
    assert.ok(buttons.every((button) => button.includes('disabled=""')));
    const limited = renderToStaticMarkup(createElement(Component, props));
    assert.ok([...limited.matchAll(/<button\b([^>]*)>\+<\/button>/g)].every((match) => match[1].includes('disabled=""')));
  });
}
