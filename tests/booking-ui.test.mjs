import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "./helpers.mjs";

const { messages } = load("src/i18n/messages.ts");
const { BookingConfirmation } = load("src/components/booking/booking-confirmation.tsx");
const { cancellationPath, formatBookingDate } = load("src/lib/booking-presentation.ts");
const confirmation = { date: "2099-07-15", slots: ["09:00–10:00", "14:00–15:00"], customer: { name: "<script>Test</script>", email: "test@example.invalid", numberOfPeople: "2", phone: "", notes: "" }, selectedPackages: [{ packageId: "sweet", quantity: 2 }], selectedDrinks: [], cancellationToken: "a".repeat(64), emailQueued: false };
function keys(value, prefix = "") { return Object.entries(value).flatMap(([key, entry]) => typeof entry === "object" ? keys(entry, `${prefix}${key}.`) : [`${prefix}${key}`]).sort(); }
test("booking translations cover identical keys in all three languages", () => {
  for (const locale of ["fi", "sv"]) assert.deepEqual(keys(messages[locale].booking), keys(messages.en.booking));
});
for (const locale of ["en", "fi", "sv"]) {
  test(`${locale} confirmation uses localized content and private link, with escaped customer data`, () => {
    const text = messages[locale].booking;
    const markup = renderToStaticMarkup(createElement(BookingConfirmation, { confirmation, text, locale, onNewBooking() {} }));
    assert.ok(markup.includes(text.confirmation.title));
    assert.ok(markup.includes(text.extras.items.sweet));
    assert.ok(markup.includes(cancellationPath(locale, confirmation.cancellationToken)));
    assert.ok(markup.includes(formatBookingDate(confirmation.date, locale)));
    assert.ok(markup.includes('tabindex="-1"'));
    assert.ok(markup.includes('role="status"'));
    assert.doesNotMatch(markup, /<script>Test/);
    assert.doesNotMatch(markup, /<main/);
    assert.ok(markup.includes(text.confirmation.noEmail));
  });
}
