import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { cancellationDeadline, BOOKING_TIME_ZONE } from "../booking-deadline";
import { messages } from "../../i18n/messages";
import type { validateBooking } from "../booking-validation";

export type EmailPayload = {
  from: string;
  to: string[];
  subject: string;
  text: string;
};
type Booking = NonNullable<ReturnType<typeof validateBooking>>;

const copy = {
  en: {
    subject: "Your Salonki booking is confirmed",
    greeting: "Thank you for your booking",
    date: "Date",
    times: "Times",
    people: "Guests",
    extras: "Food & drinks",
    cancel: "Cancel your booking",
    deadline: "Cancellation closes at",
    save: "Keep this private link. Anyone with it can cancel your booking before the deadline.",
  },
  fi: {
    subject: "Salonki-varauksesi on vahvistettu",
    greeting: "Kiitos varauksestasi",
    date: "Päivämäärä",
    times: "Ajat",
    people: "Henkilömäärä",
    extras: "Ruoka ja juomat",
    cancel: "Peru varauksesi",
    deadline: "Peruutusaika päättyy",
    save: "Säilytä tämä linkki yksityisenä. Linkin haltija voi perua varauksen ennen määräaikaa.",
  },
  sv: {
    subject: "Din bokning på Salonki är bekräftad",
    greeting: "Tack för din bokning",
    date: "Datum",
    times: "Tider",
    people: "Antal personer",
    extras: "Mat och dryck",
    cancel: "Avboka din bokning",
    deadline: "Avbokningstiden löper ut",
    save: "Spara länken privat. Den som har länken kan avboka din bokning före tidsgränsen.",
  },
};

function encryptionKey() {
  const key = process.env.BOOKING_EMAIL_ENCRYPTION_KEY ?? "";
  if (!/^[a-fA-F0-9]{64}$/.test(key))
    throw new Error("Invalid booking email encryption configuration");
  return Buffer.from(key, "hex");
}

export function encryptPayload(payload: EmailPayload) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  return [
    "v1",
    iv.toString("base64"),
    cipher.getAuthTag().toString("base64"),
    encrypted.toString("base64"),
  ].join(".");
}

export function decryptPayload(value: string): EmailPayload {
  const [version, iv, tag, encrypted] = value.split(".");
  if (version !== "v1" || !iv || !tag || !encrypted)
    throw new Error("Invalid email envelope");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  return JSON.parse(
    Buffer.concat([
      decipher.update(Buffer.from(encrypted, "base64")),
      decipher.final(),
    ]).toString("utf8"),
  );
}

export function prepareConfirmation(
  booking: Booking,
  token: string,
): string | null {
  const mode = process.env.BOOKING_EMAIL_MODE ?? "disabled";
  if (mode === "disabled") return null;
  if (mode !== "queue" && mode !== "send")
    throw new Error("Invalid email mode");
  const origin = new URL(process.env.BOOKING_PUBLIC_ORIGIN ?? "");
  if (
    origin.protocol !== "https:" ||
    origin.username ||
    origin.password ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash
  )
    throw new Error("Invalid booking public origin");
  const from = process.env.BOOKING_EMAIL_FROM;
  if (!from || /[\r\n]/.test(from))
    throw new Error("Invalid booking email sender");
  const text = copy[booking.locale];
  const itemNames = messages[booking.locale].booking.extras.items;
  const locale = { en: "en-GB", fi: "fi-FI", sv: "sv-FI" }[booking.locale];
  const deadline = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: BOOKING_TIME_ZONE,
  }).format(cancellationDeadline(booking.date, booking.slots[0].startTime));
  // Fragment keeps the bearer token out of the initial HTTP URL and access logs.
  const link = new URL(`/${booking.locale}/booking/cancel`, origin);
  link.hash = `token=${token}`;
  const items = [
    ...booking.selectedPackages.map((item) => ({
      id: item.packageId,
      quantity: item.quantity,
    })),
    ...booking.selectedDrinks.map((item) => ({
      id: item.drinkId,
      quantity: item.quantity,
    })),
  ];
  return encryptPayload({
    from,
    to: [booking.customer.email],
    subject: text.subject,
    text: [
      `${text.greeting}, ${booking.customer.name}.`,
      "",
      `${text.date}: ${booking.date}`,
      `${text.times}: ${booking.slots.map((slot) => `${slot.startTime}–${slot.endTime}`).join(", ")} (${BOOKING_TIME_ZONE})`,
      `${text.people}: ${booking.customer.numberOfPeople}`,
      ...(items.length
        ? [
            text.extras,
            ...items.map(
              (item) =>
                `${itemNames[item.id as keyof typeof itemNames]} × ${item.quantity}`,
            ),
          ]
        : []),
      "",
      `${text.deadline}: ${deadline} (${BOOKING_TIME_ZONE})`,
      `${text.cancel}: ${link}`,
      text.save,
    ].join("\n"),
  });
}
