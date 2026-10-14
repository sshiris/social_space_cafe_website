"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

type CancellationResult = {
  success?: boolean;
  error?: string;
};

export function CancelBooking() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CancellationResult | null>(null);

  async function cancelBooking() {
    if (!token || submitting) return;

    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data: CancellationResult = await response.json();

      if (!response.ok) {
        setResult({
          error: data.error ?? "Unable to cancel booking.",
        });
        return;
      }

      setResult({ success: true });
    } catch {
      setResult({
        error: "A network error occurred. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return <p>Invalid cancellation link.</p>;
  }

  if (result?.success) {
    return (
      <section role="status">
        <h2>Booking cancelled</h2>
        <p>Your reservation has been cancelled successfully.</p>
      </section>
    );
  }

  return (
    <section>
      <p>Are you sure you want to cancel your meeting room booking?</p>

      <p>Cancellation is allowed until 2 hours before your booking starts.</p>

      {result?.error && <p role="alert">{result.error}</p>}

      <button type="button" disabled={submitting} onClick={cancelBooking}>
        {submitting ? "Cancelling..." : "Confirm cancellation"}
      </button>
    </section>
  );
}
