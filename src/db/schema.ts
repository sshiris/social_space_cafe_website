import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  timestamp,
  date,
  time,
  unique,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  numberOfPeople: integer("number_of_people").notNull(),
  notes: text("notes"),
  status: varchar("status", { length: 30 }).notNull().default("confirmed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  cancellationTokenHash: varchar("cancellation_token_hash", { length: 64 }).unique(),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
});

export const bookingSlots = pgTable(
  "booking_slots",
  {
    id: serial("id").primaryKey(),
    bookingId: integer("booking_id")
      .notNull()
      .references(() => bookings.id),
    date: date("date").notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
  },
  (table) => [unique("booking_slot_unique").on(table.date, table.startTime)],
);

export const bookingExtras = pgTable("booking_extras", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id")
    .notNull()
    .references(() => bookings.id),
  itemType: varchar("item_type", { length: 50 }).notNull(),
  itemId: varchar("item_id", { length: 50 }).notNull(),
  quantity: integer("quantity").notNull(),
},

(table) => [
    unique("booking_extra_unique").on(
        table.bookingId,
        table.itemType,
        table.itemId,
    ),
    check(
        "booking_extra_type_check",
        sql`${table.itemType} IN ('food', 'drink')`
    ),
    check(
        "booking_extra_quantity_check",
        sql`${table.quantity} BETWEEN 1 AND 100`,
    )
]);

