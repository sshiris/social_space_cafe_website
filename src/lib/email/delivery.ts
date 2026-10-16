import { and, asc, eq, lte, or } from "drizzle-orm";
import { db } from "@/db";
import { bookingEmailOutbox, bookings } from "@/db/schema";
import { decryptPayload, type EmailPayload } from "./confirmation";

const RETRY_WINDOW_MS = 20 * 60 * 60 * 1000; // Safely within Resend's 24-hour idempotency retention.
const MAX_ATTEMPTS = 8;

export async function sendViaResend(payload: EmailPayload, key: string, apiKey: string, transport: typeof fetch = fetch) {
  try {
    const response = await transport("https://api.resend.com/emails", {
      method: "POST", signal: AbortSignal.timeout(15_000),
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": key },
      body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => ({}));
    if (response.ok && typeof body.id === "string") return { id: body.id };
    const retry = response.status === 429 || response.status >= 500 || (response.status === 409 && body.name === "concurrent_idempotent_requests") || response.ok;
    return { error: `resend_${response.status}`, retry };
  } catch {
    return { error: "network_or_timeout", retry: true };
  }
}

export function retryAllowed(attempts: number, firstAttemptAt: Date, now: Date) {
  return attempts < MAX_ATTEMPTS && now.getTime() - firstAttemptAt.getTime() < RETRY_WINDOW_MS;
}

export async function deliverBookingEmails(limit = 5) {
  // This guard precedes DB access and every possible network call.
  if (process.env.BOOKING_EMAIL_MODE !== "send") return { disabled: true, processed: 0 };
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Email delivery is not configured");
  let processed = 0;
  for (let i = 0; i < limit; i++) {
    const now = new Date();
    const job = await db.transaction(async (tx) => {
      const [candidate] = await tx.select().from(bookingEmailOutbox).where(or(
        and(eq(bookingEmailOutbox.state, "pending"), lte(bookingEmailOutbox.availableAt, now)),
        and(eq(bookingEmailOutbox.state, "processing"), lte(bookingEmailOutbox.lockedUntil, now)),
      )).orderBy(asc(bookingEmailOutbox.availableAt)).limit(1).for("update", { skipLocked: true });
      if (!candidate) return null;
      const [claimed] = await tx.update(bookingEmailOutbox).set({
        state: "processing", attempts: candidate.attempts + 1,
        firstAttemptAt: candidate.firstAttemptAt ?? now,
        lockedUntil: new Date(now.getTime() + 60_000),
      }).where(eq(bookingEmailOutbox.id, candidate.id)).returning();
      return claimed;
    });
    if (!job) break;
    processed++;
    // Claim is committed before sending; the booking/outbox transaction committed earlier.
    const ownLease = and(eq(bookingEmailOutbox.id, job.id), eq(bookingEmailOutbox.state, "processing"), eq(bookingEmailOutbox.attempts, job.attempts));
    const finish = async (values: Partial<typeof bookingEmailOutbox.$inferInsert>) => {
      await db.update(bookingEmailOutbox).set({ lockedUntil: null, ...values }).where(ownLease);
    };
    if (!job.firstAttemptAt || !retryAllowed(job.attempts - 1, job.firstAttemptAt, new Date())) {
      await finish({ state: "failed", errorCode: "retry_window_expired" });
      continue;
    }
    const [booking] = await db.select({ status: bookings.status }).from(bookings).where(eq(bookings.id, job.bookingId));
    if (!booking || booking.status !== "confirmed") {
      await finish({ state: "suppressed", encryptedPayload: null, errorCode: "booking_not_active" });
      continue;
    }
    let payload: EmailPayload;
    try {
      if (!job.encryptedPayload) throw new Error("Missing payload");
      payload = decryptPayload(job.encryptedPayload);
    } catch {
      await finish({ state: "failed", errorCode: "invalid_payload_or_key" });
      continue;
    }
    const result = await sendViaResend(payload, `booking-confirmation/${job.id}`, apiKey);
    if (result.id) {
      await finish({ state: "sent", sentAt: new Date(), providerMessageId: result.id, encryptedPayload: null, errorCode: null });
    } else {
      const retry = result.retry && retryAllowed(job.attempts, job.firstAttemptAt, new Date());
      await finish({ state: retry ? "pending" : "failed", errorCode: result.error,
        availableAt: new Date(Date.now() + Math.min(3600, 60 * 2 ** (job.attempts - 1)) * 1000) });
    }
  }
  return { disabled: false, processed };
}
