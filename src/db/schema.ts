import {
  pgTable,
  serial,
  uuid,
  index,
  varchar,
  integer,
  text,
  timestamp,
  date,
  time,
  unique,
  uniqueIndex,
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
    releasedAt: timestamp("released_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("booking_slot_active_unique").on(table.date, table.startTime)
      .where(sql`${table.releasedAt} IS NULL`),
  ],
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


// The encrypted payload includes a bearer cancellation link. Purge it after acceptance.
export const bookingEmailOutbox = pgTable("booking_email_outbox", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id).unique(),
  encryptedPayload: text("encrypted_payload"),
  state: varchar("state", { length: 20 }).notNull().default("pending"),
  attempts: integer("attempts").notNull().default(0),
  availableAt: timestamp("available_at", { withTimezone: true }).notNull().defaultNow(),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  firstAttemptAt: timestamp("first_attempt_at", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  providerMessageId: text("provider_message_id"),
  errorCode: varchar("error_code", { length: 80 }),
}, (table) => [index("booking_email_outbox_pending").on(table.state, table.availableAt)]);
