ALTER TABLE "bookings" ADD COLUMN "cancellation_token_hash" varchar(64);--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "cancelled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_cancellation_token_hash_unique" UNIQUE("cancellation_token_hash");