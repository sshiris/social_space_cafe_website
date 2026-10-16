# Booking reliability rollout

## Phase 1: preserve cancelled slots

`0004_preserve_booking_history.sql` adds nullable `booking_slots.released_at`.
An unreleased slot is an active reservation. Cancellation locks the parent booking,
sets its status and cancellation timestamp, and marks every slot released in the
same transaction. Original dates, times, customer details, and extras remain.
Availability reads only unreleased slots. PostgreSQL enforces active `(date,
start_time)` uniqueness with `booking_slot_active_unique`, including concurrent
transactions. Repeating cancellation for an already-cancelled booking succeeds.

The migration backfills surviving slots belonging to cancelled bookings, creates
the new partial unique index, then removes the old all-rows constraint. Drizzle
applies these steps transactionally. No rows or columns are deleted. Previously
deleted slots cannot be recovered by this migration. Index construction and the
constraint change take locks; schedule a quiet maintenance window. Existing data
must satisfy the current unique constraint (the migration fails safely otherwise).

**Do not apply this to an application database or deploy without approval.**
Drain booking/cancellation traffic and old deployments before migrating, then
roll out the new application and verify availability. Old code deletes slots and
its GET endpoint includes released historical slots, so mixed versions are unsafe.
Do not roll back to the old unique constraint after rebooking: historical and new
slots can share a date/start time. Prefer a forward fix preserving history.

Migration command, after approval and secure target verification:

```sh
./node_modules/.bin/drizzle-kit migrate --config=drizzle.config.ts
```

The exported `DATABASE_URL` takes precedence over `.env.local`. Without an
exported value, the existing config loads the local Docker URL. Do not overwrite
`.env.local` with production credentials. Never print or commit connection strings.

Cancellation uses the first slot in Europe/Helsinki and closes exactly two hours
before it, retaining the existing exclusive boundary. This works across DST.
No new past-date, weekday, or capacity policy is introduced.

## Verification

`npm test` exercises API validation, transaction use, cancellation history,
retries, DST deadline boundaries, availability, and extras controls with doubles.
`npm run typecheck`, `npm run lint`, and `npm run build` are the standard checks.

`npm run test:integration` requires `BOOKING_TEST_SOCKET` pointing to an isolated
PostgreSQL cluster in `/tmp/salonki-booking-pg.*`, port 55439, with Unix-socket
connections and the current OS user. It NEVER reads `DATABASE_URL`. It creates a
new randomly named database, applies migrations there, and exercises real API
handlers, simultaneous bookings, rollback, concurrent cancellation, preserved
history, and rebooking. It does not delete any existing database or schema.

## Phase verification record

- Phase 1: 17 automated tests, typecheck, lint, build, and isolated PostgreSQL
  concurrency/history tests passed.
- Phase 2: 23 automated tests, typecheck, lint, build, and isolated PostgreSQL
  outbox tests passed. Resend requests were mocked.
- Phase 3/final: 27 automated tests, typecheck, lint, build, and PostgreSQL
  integration tests passed. Retry checks confirm identical provider keys/payloads
  and no resend after the bounded idempotency window.
- Chrome browser smoke tests passed for non-consecutive selection, unavailable
  slots, disabled extras while submitting, conflict recovery, confirmation focus,
  old query/new fragment cancellation links, all locales, and mobile overflow.
  Desktop and mobile screenshots were visually inspected. All browser booking
  API requests were intercepted; no actual bookings or emails were created.

For repeatable browser checks, build and start the site on `127.0.0.1:3107`, then
start an isolated headless Chrome profile with remote debugging on `127.0.0.1:9227`.
Run `npm run test:browser` using Node 22.18+ (native fetch and WebSocket). The test
writes screenshots under `/tmp`. Do not expose the debugging port publicly.

Only fresh disposable PostgreSQL test databases were migrated. Docker development
and Neon were untouched. No deployment, production cron, or real email sending
was enabled. Application rollout still requires the migration review above;
email activation additionally requires `booking-email.md` setup and approval.
