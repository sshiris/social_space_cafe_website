import assert from "node:assert/strict";
import test from "node:test";
import { load } from "./helpers.mjs";

const email = load("src/lib/email/confirmation.ts");
const delivery = load("src/lib/email/delivery.ts", { "@/db": { db: { transaction() { assert.fail("Disabled worker must not touch the database"); } } } });
const booking = { locale: "fi", date: "2099-07-15", slots: [{ startTime: "09:00", endTime: "10:00" }], customer: { name: "Test", email: "test@example.invalid", numberOfPeople: 2 }, selectedPackages: [], selectedDrinks: [] };
const original = { ...process.env };
test.afterEach(() => {
  for (const key of ["BOOKING_EMAIL_MODE", "BOOKING_EMAIL_ENCRYPTION_KEY", "BOOKING_PUBLIC_ORIGIN", "BOOKING_EMAIL_FROM", "RESEND_API_KEY"]) {
    if (original[key] === undefined) delete process.env[key]; else process.env[key] = original[key];
  }
});
function configure() {
  process.env.BOOKING_EMAIL_MODE = "queue";
  process.env.BOOKING_EMAIL_ENCRYPTION_KEY = "ab".repeat(32);
  process.env.BOOKING_PUBLIC_ORIGIN = "https://salonki.example";
  process.env.BOOKING_EMAIL_FROM = "Salonki <bookings@example.invalid>";
}
test("disabled email never queues, touches DB, or sends", async () => {
  process.env.BOOKING_EMAIL_MODE = "disabled";
  assert.equal(email.prepareConfirmation(booking, "a".repeat(64)), null);
  assert.deepEqual(await delivery.deliverBookingEmails(), { disabled: true, processed: 0 });
});
test("outbox payload is authenticated encryption with localized private cancellation link", () => {
  configure();
  const token = "a".repeat(64);
  const encrypted = email.prepareConfirmation(booking, token);
  assert.ok(!encrypted.includes(token));
  assert.ok(!encrypted.includes(booking.customer.email));
  const payload = email.decryptPayload(encrypted);
  assert.match(payload.subject, /vahvistettu/);
  assert.ok(payload.text.includes(`/fi/booking/cancel#token=${token}`));
  assert.match(payload.text, /Europe\/Helsinki/);
  const changed = encrypted.split("."); changed[2] = Buffer.alloc(16).toString("base64");
  assert.throws(() => email.decryptPayload(changed.join(".")));
});
test("unsafe email configuration fails before queuing", () => {
  configure();
  process.env.BOOKING_PUBLIC_ORIGIN = "http://untrusted.example";
  assert.throws(() => email.prepareConfirmation(booking, "a".repeat(64)));
});
test("Resend uses stable idempotency and immutable body, without real requests", async () => {
  const payload = { from: "a@example.invalid", to: ["b@example.invalid"], subject: "Test", text: "Test" };
  const transport = async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails");
    assert.equal(options.headers["Idempotency-Key"], "booking-confirmation/test");
    assert.deepEqual(JSON.parse(options.body), payload);
    return Response.json({ id: "fake-message-id" });
  };
  assert.deepEqual(await delivery.sendViaResend(payload, "booking-confirmation/test", "fake", transport), { id: "fake-message-id" });
  for (const [status, retry] of [[429, true], [500, true], [422, false], [401, false]]) {
    assert.equal((await delivery.sendViaResend(payload, "test", "fake", async () => Response.json({}, { status }))).retry, retry);
  }
  assert.equal((await delivery.sendViaResend(payload, "test", "fake", async () => { throw new Error("timeout"); })).retry, true);
});
test("retries stop before the provider idempotency key expires and after max attempts", () => {
  const start = new Date("2026-01-01T00:00:00Z");
  assert.equal(delivery.retryAllowed(1, start, new Date(start.getTime() + 19 * 3600000)), true);
  assert.equal(delivery.retryAllowed(1, start, new Date(start.getTime() + 20 * 3600000)), false);
  assert.equal(delivery.retryAllowed(8, start, start), false);
});
test("worker endpoint requires a strong bearer secret", async () => {
  const api = load("src/app/api/internal/booking-emails/route.ts", { "@/lib/email/delivery": { deliverBookingEmails() { assert.fail("Unauthorized worker execution"); } } });
  assert.equal((await api.POST(new Request("http://localhost/api/internal/booking-emails", { method: "POST" }))).status, 401);
  assert.equal((await api.GET(new Request("http://localhost/api/internal/booking-emails"))).status, 401);
});
