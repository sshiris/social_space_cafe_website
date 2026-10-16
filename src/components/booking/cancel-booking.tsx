"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages";

function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener);
  window.addEventListener("popstate", listener);
  return () => {
    window.removeEventListener("hashchange", listener);
    window.removeEventListener("popstate", listener);
  };
}
function readToken() {
  // Query tokens remain supported for previously issued links.
  return (
    new URLSearchParams(window.location.hash.slice(1)).get("token") ??
    new URLSearchParams(window.location.search).get("token")
  );
}

type Props = { locale: Locale; text: Messages["booking"]["cancellation"] };
export function CancelBooking({ locale, text }: Props) {
  const token = useSyncExternalStore(subscribe, readToken, () => undefined);
  if (token === undefined) return <p role="status">{text.loading}</p>;
  if (!token || !/^[a-f0-9]{64}$/.test(token))
    return (
      <div className="booking-notice" role="alert">
        <p>{text.errors.invalidToken}</p>
        <Link href={`/${locale}/booking`}>{text.back}</Link>
      </div>
    );
  return (
    <CancellationForm key={token} token={token} locale={locale} text={text} />
  );
}

function CancellationForm({ token, locale, text }: Props & { token: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (success) heading.current?.focus();
  }, [success]);
  async function cancelBooking() {
    if (inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data: { success?: boolean; code?: string } = await response.json();
      if (response.ok && data.success) setSuccess(true);
      else
        setError(
          data.code && Object.hasOwn(text.errors, data.code)
            ? text.errors[data.code as keyof typeof text.errors]
            : text.errors.unavailable,
        );
    } catch {
      setError(text.errors.network);
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }
  return (
    <section className="booking-cancel-card">
      {success ? (
        <div className="booking-notice">
          <h2 ref={heading} tabIndex={-1}>
            {text.successTitle}
          </h2>
          <p role="status">{text.success}</p>
        </div>
      ) : (
        <>
          <p className="booking-lead">{text.intro}</p>
          <p>{text.policy}</p>
          {error && (
            <p className="booking-notice" role="alert">
              {error}
            </p>
          )}
          <button
            className="button"
            type="button"
            disabled={submitting}
            onClick={cancelBooking}
          >
            {submitting ? text.submitting : text.confirm}
          </button>
        </>
      )}
      <Link className="text-link" href={`/${locale}/booking`}>
        {text.back}
      </Link>
    </section>
  );
}
