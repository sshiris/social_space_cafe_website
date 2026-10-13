CREATE TABLE "booking_extras" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"item_type" varchar(50) NOT NULL,
	"item_id" varchar(50) NOT NULL,
	"quantity" integer NOT NULL,
	CONSTRAINT "booking_extra_unique" UNIQUE("booking_id","item_type","item_id"),
	CONSTRAINT "booking_extra_type_check" CHECK ("booking_extras"."item_type" IN ('food', 'drink')),
	CONSTRAINT "booking_extra_quantity_check" CHECK ("booking_extras"."quantity" BETWEEN 1 AND 100)
);
--> statement-breakpoint
ALTER TABLE "booking_extras" ADD CONSTRAINT "booking_extras_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;