import { Suspense } from "react";
import { CancelBooking } from "@/components/booking/cancel-booking";

export default function CancelBookingPage() {
  return (
    <main>
      <h1>Cancel your booking</h1>

      <Suspense fallback={<p>Loading cancellation page...</p>}>
        <CancelBooking />
      </Suspense>
    </main>
  );
}
