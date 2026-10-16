CREATE TABLE "booking_email_outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" integer NOT NULL,
	"encrypted_payload" text,
	"state" varchar(20) DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"available_at" timestamp with time zone DEFAULT now() NOT NULL,
	"locked_until" timestamp with time zone,
	"first_attempt_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"provider_message_id" text,
	"error_code" varchar(80),
	CONSTRAINT "booking_email_outbox_booking_id_unique" UNIQUE("booking_id")
);
--> statement-breakpoint
ALTER TABLE "booking_email_outbox" ADD CONSTRAINT "booking_email_outbox_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "booking_email_outbox_pending" ON "booking_email_outbox" USING btree ("state","available_at");