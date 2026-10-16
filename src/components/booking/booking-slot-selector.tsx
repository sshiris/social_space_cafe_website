"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { PackageSelection } from "@/components/booking/snack-package-selector";
import { SnackPackageSelector } from "@/components/booking/snack-package-selector";
import {
  DrinkSelector,
  type DrinkSelection,
} from "@/components/booking/drink-selector";
import { getAvailableSlots } from "@/lib/booking-slots";
import { isBookingDate, isBookingEmail } from "@/lib/booking-validation";
import type { Locale } from "@/i18n/locales";
import { MAX_EXTRAS_PER_CATEGORY } from "@/lib/booking-extras";
import type { Messages } from "@/i18n/messages";
import {
  BookingConfirmation,
  type BookingConfirmationData,
} from "@/components/booking/booking-confirmation";

type Availability = { date: string; slots: { startTime: string }[] };

export function BookingSlotSelector({ text, locale }: { text: Messages["booking"]; locale: Locale }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    numberOfPeople: "",
    phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] =
    useState<BookingConfirmationData | null>(null);
  const dateInput = useRef<HTMLInputElement>(null);
  const returnToForm = useRef(false);
  const requestId = useRef(0);
  const submittingRef = useRef(false);
  const [selectedPackages, setSelectedPackages] = useState<PackageSelection[]>(
    [],
  );
  const [selectedDrinks, setSelectedDrinks] = useState<DrinkSelection[]>([]);

  useEffect(
    () => () => {
      requestId.current += 1;
    },
    [],
  );

  useEffect(() => {
    if (!confirmation && returnToForm.current) {
      dateInput.current?.focus();
      returnToForm.current = false;
    }
  }, [confirmation]);

  async function loadAvailability(date: string) {
    const id = ++requestId.current;
    setAvailability(null);
    setAvailabilityError(false);
    setLoading(true);
    try {
      const response = await fetch(
        `/api/bookings?date=${encodeURIComponent(date)}`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error("Availability failed");
      const data: Availability = await response.json();
      if (id !== requestId.current) return;
      setAvailability({ date, slots: data.slots });
      setSelectedSlots((selected) =>
        selected.filter(
          (start) =>
            !data.slots.some((slot) => slot.startTime.slice(0, 5) === start),
        ),
      );
    } catch {
      if (id === requestId.current) setAvailabilityError(true);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }

  const ready =
    availability?.date === selectedDate && !loading && !availabilityError;
  const slots = getAvailableSlots(availability?.slots ?? []);
  const people = Number(customer.numberOfPeople);
  const canSubmit =
    ready &&
    selectedSlots.length > 0 &&
    customer.name.trim().length > 0 &&
    isBookingEmail(customer.email.trim()) &&
    Number.isInteger(people) &&
    people > 0 &&
    people <= 2147483647 &&
    selectedPackages.reduce((sum, item) => sum + item.quantity, 0) <= MAX_EXTRAS_PER_CATEGORY &&
    selectedDrinks.reduce((sum, item) => sum + item.quantity, 0) <= MAX_EXTRAS_PER_CATEGORY &&
    !submitting;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError("");
    setConfirmation(null);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          locale,
          selectedSlots,
          ...customer,
          numberOfPeople: people,
          selectedPackages,
          selectedDrinks,
        }),
      });
      if (response.status === 409) {
        setError(text.conflict);
        await loadAvailability(selectedDate);
      } else if (!response.ok) {
        setError(text.submitError);
      } else {
        const result: {success: boolean; cancellationToken: string; emailQueued: boolean} = await response.json();
        setConfirmation({
          date: selectedDate,
          slots: slots
            .filter((slot) => selectedSlots.includes(slot.startTime))
            .map((slot) => `${slot.startTime}–${slot.endTime}`),
          customer: { ...customer },
          selectedPackages: [...selectedPackages],
          selectedDrinks: [...selectedDrinks],
          cancellationToken: result.cancellationToken,
          emailQueued: result.emailQueued,
        });
        setSelectedSlots([]);
        setCustomer({
          name: "",
          email: "",
          numberOfPeople: "",
          phone: "",
          notes: "",
        });
        setSelectedPackages([]);
        setSelectedDrinks([]);
        await loadAvailability(selectedDate);
      }
    } catch {
      setError(text.networkError);
      await loadAvailability(selectedDate);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return confirmation ? (
    <BookingConfirmation confirmation={confirmation} locale={locale} text={text}
    onNewBooking={() => {
      returnToForm.current = true;
      setSelectedDate("");
      setError("");
      setConfirmation(null);
    }}/>
  ) : (
    <form className="booking-form" onSubmit={submit}>
      <p className="booking-lead">{text.intro}</p>
      <label className="booking-field">
        {text.date} *
        <input
          ref={dateInput}
          type="date"
          required
          value={selectedDate}
          disabled={submitting}
          onChange={(event) => {
            const date = event.target.value;
            setSelectedDate(date);
            setSelectedSlots([]);
            setError("");
            setConfirmation(null);
            if (isBookingDate(date)) void loadAvailability(date);
            else {
              requestId.current += 1;
              setAvailability(null);
              setAvailabilityError(false);
              setLoading(false);
            }
          }}
        />
      </label>
      {selectedDate && (
        <fieldset className="booking-times" disabled={!ready || submitting}>
          <legend>{text.times}</legend>
          <div className="booking-slots">
            {slots.map((slot) => {
              const selected = selectedSlots.includes(slot.startTime);
              return (
                <button
                  key={slot.startTime}
                  type="button"
                  className="booking-slot"
                  disabled={!slot.available}
                  aria-pressed={selected}
                  data-state={
                    !ready
                      ? "loading"
                      : !slot.available
                        ? "unavailable"
                        : selected
                          ? "selected"
                          : "available"
                  }
                  onClick={() =>
                    setSelectedSlots((previous) =>
                      previous.includes(slot.startTime)
                        ? previous.filter((start) => start !== slot.startTime)
                        : [...previous, slot.startTime],
                    )
                  }
                >
                  <span>
                    {slot.startTime}–{slot.endTime}
                  </span>
                  <small>
                    {!ready
                      ? "—"
                      : !slot.available
                        ? text.unavailable
                        : selected
                          ? text.selected
                          : text.available}
                  </small>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
      {loading && <p role="status">{text.loading}</p>}
      {ready && slots.every((slot) => !slot.available) && (
        <p role="status">{text.full}</p>
      )}
      {availabilityError && (
        <div role="alert">
          <p>{text.availabilityError}</p>
          <button
            type="button"
            className="button"
            disabled={submitting}
            onClick={() => void loadAvailability(selectedDate)}
          >
            {text.retry}
          </button>
        </div>
      )}
      <fieldset className="booking-details" disabled={submitting}>
        <legend>{text.details}</legend>
        <p className="muted">{text.required}</p>
        <div className="booking-fields">
          <label className="booking-field">
            {text.name} *
            <input
              name="name"
              autoComplete="name"
              required
              maxLength={120}
              value={customer.name}
              onChange={(event) =>
                setCustomer({ ...customer, name: event.target.value })
              }
            />
          </label>
          <label className="booking-field">
            {text.email} *
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={255}
              value={customer.email}
              onChange={(event) =>
                setCustomer({ ...customer, email: event.target.value })
              }
            />
          </label>
          <label className="booking-field">
            {text.people} *
            <input
              name="numberOfPeople"
              type="number"
              min={1}
              max={2147483647}
              step={1}
              required
              value={customer.numberOfPeople}
              onChange={(event) =>
                setCustomer({ ...customer, numberOfPeople: event.target.value })
              }
            />
          </label>
          <label className="booking-field">
            {text.phone}
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={50}
              value={customer.phone}
              onChange={(event) =>
                setCustomer({ ...customer, phone: event.target.value })
              }
            />
          </label>
        </div>
        <label className="booking-field">
          {text.notes}
          <textarea
            name="notes"
            rows={4}
            maxLength={5000}
            value={customer.notes}
            onChange={(event) =>
              setCustomer({ ...customer, notes: event.target.value })
            }
          />
        </label>
      </fieldset>
      {error && <p className="booking-notice" role="alert">{error}</p>}
      <SnackPackageSelector
        text={text.extras}
        disabled={submitting}
        selectedPackages={selectedPackages}
        onPackagesChange={setSelectedPackages}
      />
      <DrinkSelector
        text={text.extras}
        disabled={submitting}
        selectedDrinks={selectedDrinks}
        onDrinksChange={setSelectedDrinks}
      />
      <button className="button" type="submit" disabled={!canSubmit}>
        {submitting ? text.submitting : text.submit}
      </button>
    </form>
  );
}
