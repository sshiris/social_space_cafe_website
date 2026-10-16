"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { PackageSelection } from "./snack-package-selector";
import type { DrinkSelection } from "./drink-selector";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages";
import { cancellationPath, formatBookingDate, formatCancellationDeadline } from "@/lib/booking-presentation";

export type BookingConfirmationData = {
  date: string;
  slots: string[];
  customer: { name: string; email: string; numberOfPeople: string; phone: string; notes: string };
  selectedPackages: PackageSelection[];
  selectedDrinks: DrinkSelection[];
  cancellationToken: string;
  emailQueued: boolean;
};

type Props = { confirmation: BookingConfirmationData; onNewBooking: () => void; locale: Locale; text: Messages["booking"] };
const subscribe = () => () => {};
const browserOrigin = () => window.location.origin;

export function BookingConfirmation({ confirmation, onNewBooking, locale, text }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [copyState, setCopyState] = useState("");
  const origin = useSyncExternalStore(subscribe, browserOrigin, () => "");
  const t = text.confirmation;
  const path = cancellationPath(locale, confirmation.cancellationToken);
  const link = `${origin}${path}`;
  useEffect(() => { heading.current?.focus(); }, []);
  async function copyLink() {
    try { await navigator.clipboard.writeText(link); setCopyState(t.copied); }
    catch { setCopyState(t.copyFailed); }
  }
  const extras = [...confirmation.selectedPackages.map((item) => ({ id: item.packageId, quantity: item.quantity })), ...confirmation.selectedDrinks.map((item) => ({ id: item.drinkId, quantity: item.quantity }))];
  return (
    <section className="booking-confirmation" aria-labelledby="booking-confirmed-title">
      <div className="booking-notice">
        <h2 id="booking-confirmed-title" ref={heading} tabIndex={-1}>{t.title}</h2>
        <p>{t.intro}</p>
        <p>{confirmation.emailQueued ? t.emailQueued : t.noEmail}</p>
      </div>
      <div className="booking-summary-grid">
        <section><h3>{t.room}</h3><dl className="booking-summary">
          <div><dt>{t.date}</dt><dd>{formatBookingDate(confirmation.date, locale)}</dd></div>
          <div><dt>{t.times}</dt><dd>{confirmation.slots.join(", ")}</dd></div>
          <div><dt>{t.guests}</dt><dd>{confirmation.customer.numberOfPeople}</dd></div>
          <div><dt>{t.reservedBy}</dt><dd>{confirmation.customer.name}</dd></div>
        </dl><p className="muted">{t.timezone}</p></section>
        <section><h3>{t.extras}</h3>{extras.length ? <ul className="booking-extra-summary">{extras.map((item) => <li key={item.id}>{text.extras.items[item.id as keyof typeof text.extras.items]} <span>× {item.quantity}</span></li>)}</ul> : <p>{t.none}</p>}</section>
      </div>
      <section><h3>{t.contact}</h3><p>{confirmation.customer.email}{confirmation.customer.phone && <><br />{confirmation.customer.phone}</>}</p>
        {confirmation.customer.notes && <p className="booking-notes"><strong>{t.notes}: </strong>{confirmation.customer.notes}</p>}
      </section>
      <section className="booking-cancellation-details"><h3>{t.deadline}</h3>
        <p>{formatCancellationDeadline(confirmation.date, confirmation.slots[0].slice(0, 5), locale)}</p>
        <p>{t.save}</p>
        <label className="booking-field">{t.link}<input readOnly value={link} onFocus={(event) => event.currentTarget.select()} /></label>
        <p className="booking-print-link">{link}</p>
        <div className="booking-actions"><button className="button" type="button" onClick={copyLink}>{t.copy}</button><button className="button booking-secondary" type="button" onClick={() => window.print()}>{t.print}</button></div>
        <p role="status">{copyState}</p>
        <Link className="text-link" prefetch={false} href={path}>{t.cancel}</Link>
      </section>
      <button className="button booking-secondary" type="button" onClick={onNewBooking}>{t.newBooking}</button>
    </section>
  );
}
