# Booking confirmation email (Resend)

No provider SDK or new dependency is needed. The default is **disabled**. This
change does not enable a cron schedule, send mail, or alter Vercel configuration.
Obtain approval before setting send mode or invoking a real delivery test.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `BOOKING_EMAIL_MODE` | `disabled` (default): no queue or sends. `queue`: create encrypted jobs but never send. `send`: queue and allow the worker to send. |
| `BOOKING_EMAIL_ENCRYPTION_KEY` | 64 hexadecimal characters (32 random bytes) for AES-256-GCM. Required for queue/send. Store as a server-only secret. Keep the same key while jobs remain; rotating it without re-encryption makes pending jobs unreadable. |
| `BOOKING_PUBLIC_ORIGIN` | Canonical HTTPS origin, e.g. `https://salonki.example`, with no credentials, path, query, or fragment. Never derived from request headers. |
| `BOOKING_EMAIL_FROM` | Verified Resend sender, e.g. `Salonki <bookings@your-domain.example>`. Required for queue/send. |
| `RESEND_API_KEY` | Resend sending API key; required only for actual send mode. |
| `BOOKING_EMAIL_WORKER_SECRET` | At least 32 random characters, used as `Authorization: Bearer …` on worker requests. |
| `CRON_SECRET` | Vercel Cron alternative to the worker secret. If both are configured, use the same value (the worker-specific variable takes precedence). Vercel supplies this as the bearer header automatically. |
| `DATABASE_URL` | Existing PostgreSQL connection. Local Docker development remains unchanged. |

Never prefix these with `NEXT_PUBLIC_`. Do not commit secrets, print bearer URLs,
or log outbox payloads. Use your secret manager to generate/store the keys.
Disable Resend click tracking on the sending domain so cancellation links are not
rewritten through a tracking service.

## Queue and delivery

Migration `0005_booking_email_outbox.sql` creates one additional table and index;
it does not modify existing booking records. Apply only after the target database
and rollout are approved (see `booking-rollout.md`).

The booking transaction inserts the booking, its slots, extras, and an encrypted
snapshot of the localized email. A rollback also removes the queued job. The
booking response indicates `emailQueued`; it never claims delivery. Disabled mode
still supports on-screen confirmation and saving a private cancellation link.

A scheduler should call `/api/internal/booking-emails` with the worker bearer
secret, approximately once a minute, **after approval**. No scheduler is installed
by this change. Choose a hosting plan/scheduler that supports the required
frequency and 120-second function duration. A call processes up to five messages.
The endpoint accepts POST for an external scheduler and GET for Vercel Cron.
There is no unauthenticated endpoint that triggers sending. For native Vercel
Cron, configure `CRON_SECRET` and add the following to `vercel.json` only after
approval, on a plan supporting this frequency:

```json
{"crons": [{"path": "/api/internal/booking-emails", "schedule": "* * * * *"}]}
```

[Vercel's cron authentication documentation](https://vercel.com/docs/cron-jobs/manage-cron-jobs)
explains the automatic bearer header. The schedule is deliberately not active
in this repository.

Workers claim jobs using `FOR UPDATE SKIP LOCKED`, commit a 60-second lease, then
make a Resend request with a 15-second timeout. A crashed worker's lease can be
reclaimed. Attempts use the same saved payload and `booking-confirmation/<job UUID>`
idempotency key. Retryable failures include timeouts, 429, 5xx, and concurrent
idempotent requests. Permanent errors go to `failed`. Retries use exponential
backoff, stop after eight attempts, and stop 20 hours after the first claim.

Resend retains idempotency keys for 24 hours. The shorter retry window avoids
blindly sending again after a possibly successful ambiguous request. This is
bounded, at-least-once processing with provider deduplication, not an unlimited
exactly-once delivery guarantee. If a DB write fails after provider acceptance,
the next attempt uses the same key. See:
[Resend idempotency keys](https://resend.com/changelog/idempotency-keys) and
[retry semantics](https://resend.com/blog/engineering-idempotency-keys).

`sent` means **accepted by Resend**, not delivered to the inbox. Bounces and spam
placement must be monitored through Resend. Successful jobs retain the provider
message ID but erase the encrypted payload. Already-cancelled bookings are
suppressed and their payloads erased. Cancellation racing an in-flight provider
request cannot retract an email already accepted; its link safely reports an
already-cancelled reservation.

## Operations and recovery

Monitor counts and oldest age of `pending`, `processing`, and `failed` jobs. Alerts
and the external scheduler must be configured by the operator; no admin panel is
introduced. Inspect `error_code`, attempts, timestamps, and provider message ID,
not raw payloads. Errors are sanitized and do not contain customer information.

For failed/expired jobs, check Resend's records using the job's idempotency key
before deciding whether to retry manually. Do not reset an uncertain job after
the provider's deduplication window without confirming it was not accepted.
Preserve the original payload and key for retries within that window. Correct
configuration/decryption errors before an approved retry. Apply a retention
policy to abandoned encrypted jobs, since they contain personal information.

Use `queue` mode to verify queuing without sending. Switching from `queue` to
`send` will process the existing queue, so review it and obtain approval first.
Bookings created while mode was `disabled` are not backfilled: their raw tokens
were deliberately not persisted. Do not promise an email for those bookings.

## Testing

`npm test` uses fake transports only. The PostgreSQL integration suite also
replaces fetch with a fake provider; it never contacts Resend. It checks atomic
queue insertion/rollback, concurrent worker claims, cancellation suppression,
and removal of payloads after provider acceptance.
