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
} from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  numberOfPeople: integer("number_of_people").notNull(),
  notes: text("notes"),
  status: varchar("status", { length: 30 }).notNull().default("confirmed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bookingSlots = pgTable("booking_slots", {
    id: serial("id").primaryKey(),
    bookingId: integer("booking_id").notNull().references(() => bookings.id),
    date: date("date").notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
},
(table) => [
    unique("booking_slot_unique").on(
        table.date,
        table.startTime,
    )
]);