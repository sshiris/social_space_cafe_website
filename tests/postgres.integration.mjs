import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { load } from "./helpers.mjs";

// Only an explicitly supplied disposable Unix socket is accepted. Never use DATABASE_URL.
const socket = process.env.BOOKING_TEST_SOCKET;
if (!socket || !/^\/tmp\/salonki-booking-pg\.[a-zA-Z0-9]+$/.test(socket)) {
  throw new Error("Set BOOKING_TEST_SOCKET to a fresh /tmp/salonki-booking-pg.* PostgreSQL cluster");
}
const options = { host: socket, port: 55439, username: process.env.USER, max: 5 };
const admin = postgres({ ...options, database: "postgres" });
const database = `booking_test_${randomBytes(6).toString("hex")}`;
await admin`CREATE DATABASE ${admin(database)}`;
await admin.end();
const sql = postgres({ ...options, database });
try {
  process.env.BOOKING_EMAIL_MODE = "queue";
  process.env.BOOKING_EMAIL_ENCRYPTION_KEY = "ab".repeat(32);
  process.env.BOOKING_PUBLIC_ORIGIN = "https://salonki.example";
  process.env.BOOKING_EMAIL_FROM = "Salonki <booking@example.invalid>";
  const db = drizzle(sql);
  await migrate(db, { migrationsFolder: "./drizzle" });
  const schema = load("src/db/schema.ts");
  const dependencies = { "@/db": { db }, "@/db/schema": schema };
  const booking = load("src/app/api/bookings/route.ts", dependencies);
  const cancel = load("src/app/api/bookings/cancel/route.ts", dependencies).POST;
  const payload = { date: "2099-07-15", selectedSlots: ["09:00", "14:00"], name: "Integration Guest", email: "integration@example.invalid", numberOfPeople: 2, selectedPackages: [{ packageId: "sweet", quantity: 2 }], selectedDrinks: [] };
  const book = () => booking.POST(new Request("http://localhost/api/bookings", { method: "POST", body: JSON.stringify(payload) }));
  const responses = await Promise.all([book(), book()]);
  assert.deepEqual(responses.map((r) => r.status).sort(), [201, 409]);
  const { cancellationToken } = await responses.find((r) => r.status === 201).json();
  assert.equal(Number((await sql`SELECT count(*) FROM bookings`)[0].count), 1, "Losing transaction must roll back parent booking");
  assert.equal(Number((await sql`SELECT count(*) FROM booking_extras`)[0].count), 1);
  assert.equal(Number((await sql`SELECT count(*) FROM booking_email_outbox`)[0].count), 1);
  const cancelled = await Promise.all([1, 2].map(() => cancel(new Request("http://localhost/api/bookings/cancel", { method: "POST", body: JSON.stringify({ token: cancellationToken }) }))));
  assert.deepEqual(cancelled.map((r) => r.status), [200, 200]);
  assert.equal(Number((await sql`SELECT count(*) FROM booking_slots WHERE released_at IS NOT NULL`)[0].count), 2);
  assert.equal(Number((await sql`SELECT count(*) FROM booking_extras`)[0].count), 1);
  const availability = await booking.GET(new Request(`http://localhost/api/bookings?date=${payload.date}`));
  assert.deepEqual(await availability.json(), { slots: [] });
  assert.equal((await book()).status, 201);
  assert.equal(Number((await sql`SELECT count(*) FROM booking_slots`)[0].count), 4);
  assert.equal(Number((await sql`SELECT count(*) FROM booking_slots WHERE released_at IS NULL`)[0].count), 2);
  assert.equal((await book()).status, 409);
  const jobs = await sql`SELECT * FROM booking_email_outbox`;
  assert.equal(jobs.length, 2);
  assert.ok(jobs.every((job) => !job.encrypted_payload.includes(cancellationToken)));
  const transport = globalThis.fetch;
  let sent = 0;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails");
    assert.match(options.headers["Idempotency-Key"], /^booking-confirmation\//);
    sent++;
    return Response.json({ id: "integration-message" });
  };
  try {
    const worker = load("src/lib/email/delivery.ts", dependencies);
    assert.equal((await worker.deliverBookingEmails()).disabled, true);
    assert.equal(sent, 0);
    process.env.BOOKING_EMAIL_MODE = "send";
    process.env.RESEND_API_KEY = "fake-integration-key";
    await Promise.all([worker.deliverBookingEmails(), worker.deliverBookingEmails()]);
    assert.equal(sent, 1, "Only the active booking should send, exactly once across workers");
    assert.equal(Number((await sql`SELECT count(*) FROM booking_email_outbox WHERE state = 'sent' AND encrypted_payload IS NULL`)[0].count), 1);
    assert.equal(Number((await sql`SELECT count(*) FROM booking_email_outbox WHERE state = 'suppressed'`)[0].count), 1);
    await worker.deliverBookingEmails();
    assert.equal(sent, 1);
    // Transient failure retains the encrypted snapshot and retries with the same key/body.
    process.env.BOOKING_EMAIL_MODE = "queue";
    payload.date = "2099-07-16";
    assert.equal((await book()).status, 201);
    process.env.BOOKING_EMAIL_MODE = "send";
    const requests = [];
    globalThis.fetch = async (_url, options) => {
      requests.push({ key: options.headers["Idempotency-Key"], body: options.body });
      return requests.length === 1 ? Response.json({}, { status: 503 }) : Response.json({ id: "retry-message" });
    };
    await worker.deliverBookingEmails();
    const [retryJob] = await sql`SELECT * FROM booking_email_outbox WHERE state = 'pending'`;
    assert.equal(retryJob.attempts, 1);
    assert.ok(retryJob.encrypted_payload);
    await sql`UPDATE booking_email_outbox SET available_at = now() - interval '1 second' WHERE id = ${retryJob.id}`;
    await worker.deliverBookingEmails();
    assert.equal(requests.length, 2);
    assert.deepEqual(requests[0], requests[1]);
    assert.equal((await sql`SELECT state FROM booking_email_outbox WHERE id = ${retryJob.id}`)[0].state, "sent");
    // An expired ambiguous attempt is held for operator review, never resent past deduplication.
    process.env.BOOKING_EMAIL_MODE = "queue";
    payload.date = "2099-07-17";
    assert.equal((await book()).status, 201);
    await sql`UPDATE booking_email_outbox SET state = 'processing', first_attempt_at = now() - interval '25 hours', locked_until = now() - interval '1 minute', attempts = 1 WHERE state = 'pending'`;
    process.env.BOOKING_EMAIL_MODE = "send";
    await worker.deliverBookingEmails();
    assert.equal(requests.length, 2);
    assert.equal(Number((await sql`SELECT count(*) FROM booking_email_outbox WHERE error_code = 'retry_window_expired'`)[0].count), 1);
  } finally { globalThis.fetch = transport; }
  console.log("Outbox integration passed: atomic queue, disabled delivery, concurrent claims, cancellation suppression, and accepted-message payload purge. No real emails sent.");
  console.log("PostgreSQL integration passed: migrations, concurrent bookings, transaction rollback, concurrent cancellation retries, history, availability, and rebooking.");
} finally {
  await sql.end();
}
