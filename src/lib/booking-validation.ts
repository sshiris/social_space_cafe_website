import { isLocale } from "../i18n/locales";
import { meetingRoomSlots } from "./booking-slots";
import { drinkPackages, snackPackages, MAX_EXTRAS_PER_CATEGORY } from "./booking-extras";

export function isBookingDate(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    value.startsWith("0000")
  )
    return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

export function isBookingEmail(value: string) {
  return value.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateBooking(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  if (data.locale !== undefined && (typeof data.locale !== "string" || !isLocale(data.locale))) return null;
  if (
    !isBookingDate(data.date) ||
    !Array.isArray(data.selectedSlots) ||
    !Array.isArray(data.selectedPackages) ||
    !Array.isArray(data.selectedDrinks) ||
    data.selectedSlots.length < 1 ||
    data.selectedSlots.length > meetingRoomSlots.length ||
    new Set(data.selectedSlots).size !== data.selectedSlots.length ||
    !data.selectedSlots.every((start) =>
      meetingRoomSlots.some((slot) => slot.startTime === start),
    )
  )
    return null;
  if (
    typeof data.name !== "string" ||
    !data.name.trim() ||
    data.name.trim().length > 120 ||
    typeof data.email !== "string" ||
    !isBookingEmail(data.email.trim()) ||
    typeof data.numberOfPeople !== "number" ||
    !Number.isInteger(data.numberOfPeople) ||
    data.numberOfPeople < 1 ||
    data.numberOfPeople > 2147483647
  )
    return null;
  if (
    data.phone !== undefined &&
    (typeof data.phone !== "string" || data.phone.trim().length > 50)
  )
    return null;
  if (
    data.notes !== undefined &&
    (typeof data.notes !== "string" || data.notes.trim().length > 5000)
  )
    return null;
  const strings = [data.name, data.email, data.phone, data.notes];
  if (
    strings.some((entry) => typeof entry === "string" && entry.includes("\0"))
  )
    return null;

  // Validate selected snack packages
  const validPackages = data.selectedPackages.every((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return false;
    }

    return (
      typeof item.packageId === "string" &&
      snackPackages.some((pkg) => pkg.id === item.packageId) &&
      typeof item.quantity === "number" &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= MAX_EXTRAS_PER_CATEGORY
    );
  });
  if (!validPackages) return null;

  const snackPackageIds = data.selectedPackages.map((item) => item.packageId);
  if (new Set(snackPackageIds).size !== snackPackageIds.length) return null;

  const totalSnackPackages = data.selectedPackages.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  if (totalSnackPackages > MAX_EXTRAS_PER_CATEGORY) return null;

  const selectedPackages = data.selectedPackages.map((item) => ({
    packageId: item.packageId as string,
    quantity: item.quantity as number,
  }));

  // Validate selected drink packages
  const validDrinks = data.selectedDrinks.every((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return false;
    }

    return (
      typeof item.drinkId === "string" &&
      drinkPackages.some((pkg) => pkg.drinkId === item.drinkId) &&
      typeof item.quantity === "number" &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= MAX_EXTRAS_PER_CATEGORY
    );
  });
  if (!validDrinks) return null;

  const drinkIds = data.selectedDrinks.map((item) => item.drinkId);
  if (new Set(drinkIds).size !== drinkIds.length) return null;

  const totalDrinkPackages = data.selectedDrinks.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  if (totalDrinkPackages > MAX_EXTRAS_PER_CATEGORY) return null;
  const selectedDrinks = data.selectedDrinks.map((item) => ({
    drinkId: item.drinkId as string,
    quantity: item.quantity as number,
  }));

  return {
    date: data.date,
    locale: typeof data.locale === "string" && isLocale(data.locale) ? data.locale : "en" as const,
    slots: meetingRoomSlots.filter(
      (slot) =>
        data.selectedSlots instanceof Array &&
        data.selectedSlots.includes(slot.startTime),
    ),
    customer: {
      name: data.name.trim(),
      email: data.email.trim(),
      numberOfPeople: data.numberOfPeople,
      phone: typeof data.phone === "string" ? data.phone.trim() || null : null,
      notes: typeof data.notes === "string" ? data.notes.trim() || null : null,
    },
    selectedPackages: selectedPackages,
    selectedDrinks: selectedDrinks,
  };
}

// Drizzle wraps postgres-js errors in a query error; inspect its cause too.
export function isBookingConflict(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const candidate = error as {
    code?: string;
    constraint_name?: string;
    cause?: unknown;
  };
  return (
    (candidate.code === "23505" &&
      ["booking_slot_unique", "booking_slot_active_unique"].includes(candidate.constraint_name ?? "")) ||
    (candidate.cause !== undefined &&
      candidate.cause !== error &&
      isBookingConflict(candidate.cause))
  );
}
