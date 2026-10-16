import assert from "node:assert/strict";
import test from "node:test";
import { PgDialect } from "drizzle-orm/pg-core";
import { load } from "./helpers.mjs";

const schema = load("src/db/schema.ts");
const { cancellationDeadline } = load("src/lib/booking-deadline.ts");
const token = "a".repeat(64);
const request = (value = token) => new Request("http://localhost/api/bookings/cancel", { method: "POST", body: JSON.stringify({ token: value }) });

function harness({ status = "confirmed", found = true, failRelease = false, slots = [{ date: "2099-07-15", startTime: "09:00:00", endTime: "10:00:00", releasedAt: null }, { date: "2099-07-15", startTime: "14:00:00", endTime: "15:00:00", releasedAt: null }] } = {}) {
  let state = { booking: { id: 1, status }, slots };
  let locked = false;
  const dialect = new PgDialect();
  const db = {
    select(fields) {
      assert.deepEqual(Object.keys(fields), ["startTime", "endTime"]);
      return { from: () => ({ where(condition) {
        assert.match(dialect.sqlToQuery(condition).sql, /"released_at" is null/i);
        return { orderBy: async () => state.slots.filter((slot) => slot.releasedAt === null).map(({ startTime, endTime }) => ({ startTime, endTime })) };
      } }) };
    },
    async transaction(callback) {
      const before = structuredClone(state);
      try {
        return await callback({
          select() { return { from(table) { return { where() {
            return table === schema.bookings ? { for: async (mode) => { assert.equal(mode, "update"); locked = true; return found ? [state.booking] : []; } }
              : { orderBy: async () => [...state.slots].sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)) };
          } }; } }; },
          update(table) { return { set(values) { return { where: async () => {
            assert.equal(locked, true);
            if (table === schema.bookings) Object.assign(state.booking, values);
            else { if (failRelease) throw new Error("release failed"); state.slots.forEach((slot) => Object.assign(slot, values)); }
          } }; } }; },
          delete() { assert.fail("Cancellation must preserve slot history"); },
        });
      } catch (error) { state = before; throw error; }
    },
  };
  const dependencies = { "@/db": { db }, "@/db/schema": schema };
  return { cancel: load("src/app/api/bookings/cancel/route.ts", dependencies).POST, get: load("src/app/api/bookings/route.ts", dependencies).GET, state: () => state };
}

test("cancellation preserves every historical slot and releases availability; retries succeed", async () => {
  const h = harness();
  const availability = () => h.get(new Request("http://localhost/api/bookings?date=2099-07-15"));
  assert.equal((await (await availability()).json()).slots.length, 2);
  assert.equal((await h.cancel(request())).status, 200);
  assert.equal(h.state().booking.status, "cancelled");
  assert.equal(h.state().slots.length, 2);
  assert.ok(h.state().slots.every((slot) => slot.releasedAt instanceof Date));
  assert.deepEqual((await (await availability()).json()).slots, []);
  const originalCancelledAt = h.state().booking.cancelledAt;
  const repeat = await h.cancel(request());
  assert.equal(repeat.status, 200);
  assert.equal((await repeat.json()).code, "alreadyCancelled");
  assert.equal(h.state().booking.cancelledAt, originalCancelledAt);
});

test("invalid/unknown tokens and unsupported states cannot cancel", async () => {
  for (const value of [null, "", "a".repeat(63), "g".repeat(64), 123]) {
    assert.equal((await harness().cancel(request(value))).status, 400);
  }
  assert.equal((await harness({ found: false }).cancel(request())).status, 404);
  assert.equal((await harness({ status: "pending" }).cancel(request())).status, 409);
  assert.equal((await harness({ slots: [] }).cancel(request())).status, 409);
});

test("release failure rolls back booking status and history", async () => {
  const h = harness({ failRelease: true });
  assert.equal((await h.cancel(request())).status, 503);
  assert.equal(h.state().booking.status, "confirmed");
  assert.ok(h.state().slots.every((slot) => slot.releasedAt === null));
});

for (const [date, deadline] of [["2026-01-15", "2026-01-15T05:00:00Z"], ["2026-07-15", "2026-07-15T04:00:00Z"], ["2026-03-29", "2026-03-29T04:00:00Z"], ["2026-10-25", "2026-10-25T05:00:00Z"]]) {
  test(`Helsinki cancellation deadline, including exact boundary: ${date}`, async (context) => {
    assert.equal(cancellationDeadline(date, "09:00:00"), Date.parse(deadline));
    for (const offset of [-1, 0, 1]) {
      context.mock.timers.enable({ apis: ["Date"], now: Date.parse(deadline) + offset });
      const h = harness({ slots: [{ date, startTime: "14:00:00", releasedAt: null }, { date, startTime: "09:00:00", releasedAt: null }] });
      assert.equal((await h.cancel(request())).status, offset < 0 ? 200 : 409);
      context.mock.timers.reset();
    }
  });
}
