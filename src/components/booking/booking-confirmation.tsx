import type { PackageSelection } from "@/components/booking/snack-package-selector";
import type { DrinkSelection } from "@/components/booking/drink-selector";
import { drinkPackages, snackPackages } from "@/lib/booking-extras";

export type BookingConfirmationData = {
  date: string;
  slots: string[];
  customer: {
    name: string;
    email: string;
    numberOfPeople: string;
    phone: string;
    notes: string;
  };
  selectedPackages: PackageSelection[];
  selectedDrinks: DrinkSelection[];
  cancellationToken: string;
};

type Props = {
  confirmation: BookingConfirmationData;
  onNewBooking: () => void;
};

export function BookingConfirmation({ confirmation, onNewBooking }: Props) {
  return (
    <section className="booking-confirmation">
      <h2>Booking Confirmed!</h2>
      <p>Your meeting room reservation at Salonki is confirmed.</p>

      <h3>Meeting room</h3>
      <p>Date: {confirmation.date}</p>
      <p>Time: {confirmation.slots.join(", ")}</p>
      <p>Guests: {confirmation.customer.numberOfPeople}</p>
      <p>Reserved by: {confirmation.customer.name}</p>
      <h3>Food & Drinks</h3>

      {confirmation.selectedPackages.map((item) => {
        const pkg = snackPackages.find((pkg) => pkg.id === item.packageId);

        return (
          <p key={item.packageId}>
            {pkg?.name ?? item.packageId} × {item.quantity}
          </p>
        );
      })}

      {confirmation.selectedDrinks.map((item) => {
        const drink = drinkPackages.find(
          (drink) => drink.drinkId === item.drinkId,
        );

        return (
          <p key={item.drinkId}>
            {drink?.name ?? item.drinkId} × {item.quantity}
          </p>
        );
      })}

      <h3>Contact details</h3>
      <p>{confirmation.customer.email}</p>

      {confirmation.customer.phone && <p>{confirmation.customer.phone}</p>}

      {confirmation.customer.notes && (
        <p>Notes: {confirmation.customer.notes}</p>
      )}

      <p>Please save your reservation details.</p>
      <button type="button" onClick={onNewBooking}>
        Make another booking
      </button>
    </section>
  );
}
