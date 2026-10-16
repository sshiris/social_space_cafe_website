import { timingSafeEqual } from "node:crypto";
import { deliverBookingEmails } from "@/lib/email/delivery";

export const runtime = "nodejs";
export const maxDuration = 120;

// A scheduler may call this endpoint; no schedule is enabled by this change.
export async function POST(request: Request) {
  const secret = process.env.BOOKING_EMAIL_WORKER_SECRET ?? process.env.CRON_SECRET;
  const supplied = request.headers.get("authorization") ?? "";
  const expected = Buffer.from(`Bearer ${secret}`);
  const suppliedBytes = Buffer.from(supplied);
  if (!secret || secret.length < 32 || suppliedBytes.length !== expected.length ||
      !timingSafeEqual(suppliedBytes, expected)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return Response.json(await deliverBookingEmails(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Email worker unavailable" }, { status: 503 });
  }
}

// Vercel Cron invokes GET; it uses the same authentication and send-mode guard.
export const GET = POST;
