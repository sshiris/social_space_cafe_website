ALTER TABLE "booking_slots" ADD COLUMN "released_at" timestamp with time zone;
--> statement-breakpoint
UPDATE "booking_slots" AS slots
SET "released_at" = COALESCE(bookings."cancelled_at", CURRENT_TIMESTAMP)
FROM "bookings" AS bookings
WHERE slots."booking_id" = bookings."id" AND bookings."status" = 'cancelled';
--> statement-breakpoint
CREATE UNIQUE INDEX "booking_slot_active_unique" ON "booking_slots" USING btree ("date","start_time") WHERE "booking_slots"."released_at" IS NULL;
--> statement-breakpoint
ALTER TABLE "booking_slots" DROP CONSTRAINT "booking_slot_unique";
