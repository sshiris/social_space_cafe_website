import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";

// Load the TypeScript route with a database double; no customer database is changed.
const require = createRequire(import.meta.url);
function load(path, dependencies = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const loaded = { exports: {} };
  new Function("require", "module", "exports", outputText)(
    (name) => name in dependencies ? dependencies[name] : require(name), loaded, loaded.exports,
  );
  return loaded.exports;
}
const slots = load("../src/lib/booking-slots.ts");
const validation = load("../src/lib/booking-validation.ts", { "./booking-slots": slots });
const schema = load("../src/db/schema.ts");
const valid = { date: "2028-02-29", selectedSlots: ["14:00", "09:00"], name: " Test Guest ", email: "guest@example.com", numberOfPeople: 3 };
const conflict = { cause: { code: "23505", constraint_name: "booking_slot_unique" } };
function route(db) {
  return load("../src/app/api/bookings/route.ts", { "@/db": { db }, "@/db/schema": schema, "@/lib/booking-validation": validation });
}
function request(body) {
  return new Request("http://localhost/api/bookings", { method: "POST", body: JSON.stringify(body) });
}

test("validates real dates, allowed unique slots, and customer fields", () => {
  const result = validation.validateBooking(valid);
  assert.equal(result.customer.name, "Test Guest");
  assert.deepEqual(result.slots.map((slot) => slot.startTime), ["09:00", "14:00"]);
  for (const change of [
    { date: "2027-02-29" }, { date: "2028-02-30" }, { date: "0000-01-01" }, { date: "2028-2-1" },
    { selectedSlots: [] }, { selectedSlots: ["09:00", "09:00"] }, { selectedSlots: ["16:00"] },
    { selectedSlots: ["09:30"] }, { selectedSlots: [{ startTime: "09:00" }] },
    { name: " " }, { name: "x".repeat(121) }, { email: "bad@" }, { email: "x".repeat(256) },
    { numberOfPeople: 0 }, { numberOfPeople: 1.5 }, { numberOfPeople: "3" }, { numberOfPeople: 2147483648 },
    { phone: 123 }, { phone: "x".repeat(51) }, { notes: "x".repeat(5001) }, { notes: "\0" },
  ]) assert.equal(validation.validateBooking({ ...valid, ...change }), null, JSON.stringify(change));
  for (const body of [null, [], "booking", 5]) assert.equal(validation.validateBooking(body), null);
});

test("availability normalizes PostgreSQL times", () => {
  const available = slots.getAvailableSlots([{ startTime: "09:00:00" }]);
  assert.equal(available.length, 7);
  assert.equal(available[0].available, false);
  assert.equal(available[6].available, true);
});

test("GET selects only times, is uncached, and rejects invalid dates", async () => {
  const api = route({ select(fields) {
    assert.deepEqual(Object.keys(fields), ["startTime", "endTime"]);
    return { from: () => ({ where: () => ({ orderBy: async () => [{ startTime: "09:00:00", endTime: "10:00:00" }] }) }) };
  } });
  const response = await api.GET(new Request("http://localhost/api/bookings?date=2028-02-29"));
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await response.json(), { slots: [{ startTime: "09:00:00", endTime: "10:00:00" }] });
  for (const query of ["", "?date=2028-02-30", "?date=invalid"]) {
    assert.equal((await api.GET(new Request(`http://localhost/api/bookings${query}`))).status, 400);
  }
});

test("POST writes one booking and non-consecutive slots within the same transaction", async () => {
  const inserts = [];
  let transactions = 0;
  const api = route({ async transaction(callback) {
    transactions++;
    return callback({ insert(table) { return { values(value) {
      inserts.push({ table, value });
      return { returning: async () => [{ id: 42 }] };
    } }; } });
  } });
  const response = await api.POST(request(valid));
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(transactions, 1);
  assert.equal(inserts.length, 2);
  assert.equal(inserts[0].table, schema.bookings);
  assert.equal(inserts[1].table, schema.bookingSlots);
  assert.deepEqual(inserts[1].value, [
    { bookingId: 42, date: valid.date, startTime: "09:00", endTime: "10:00" },
    { bookingId: 42, date: valid.date, startTime: "14:00", endTime: "15:00" },
  ]);
});

test("POST rejects invalid JSON and invalid input before writing", async () => {
  const api = route({ transaction() { assert.fail("Must not write invalid input"); } });
  assert.equal((await api.POST(request({ ...valid, selectedSlots: [] }))).status, 400);
  assert.equal((await api.POST(new Request("http://localhost/api/bookings", { method: "POST", body: "{" }))).status, 400);
});

test("slot conflicts escape the transaction for rollback and return a friendly 409", async () => {
  let escaped = false;
  const api = route({ async transaction(callback) {
    try {
      await callback({ insert(table) { return { values() {
        if (table === schema.bookingSlots) throw conflict;
        return { returning: async () => [{ id: 42 }] };
      } }; } });
    } catch (error) { escaped = true; throw error; }
  } });
  const response = await api.POST(request(valid));
  assert.equal(escaped, true);
  assert.equal(response.status, 409);
  assert.match((await response.json()).error, /just been booked/);
  assert.equal(validation.isBookingConflict({ code: "23505", constraint_name: "other_constraint" }), false);
});

test("database failures never disclose SQL or customer information", async () => {
  const failure = new Error("private SQL and customer data");
  const api = route({ transaction() { throw failure; }, select() { throw failure; } });
  for (const response of [await api.POST(request(valid)), await api.GET(new Request("http://localhost/api/bookings?date=2028-02-29"))]) {
    assert.equal(response.status, 503);
    assert.doesNotMatch(await response.text(), /private|SQL|customer data/);
  }
});
