"use client";
import { snackPackages } from "@/lib/booking-extras";

export type PackageSelection = {
  packageId: string;
  quantity: number;
};
type SnackPackageSelectorProps = {
  selectedPackages: PackageSelection[];
  onPackagesChange: (packages: PackageSelection[]) => void;
};

export function SnackPackageSelector({
  selectedPackages,
  onPackagesChange,
}: SnackPackageSelectorProps) {
  function increaseQuantity(packageId: string) {
    const existingPackage = selectedPackages.find(
      (item) => item.packageId === packageId,
    );
    if (existingPackage) {
      const updatedPackages = selectedPackages.map((item) =>
        item.packageId === packageId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );

      onPackagesChange(updatedPackages);
    } else {
      onPackagesChange([...selectedPackages, { packageId, quantity: 1 }]);
    }
  }
  function decreaseQuantity(packageId: string) {
    const updatedPackages = selectedPackages
      .map((item) =>
        item.packageId === packageId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      )
      .filter((item) => item.quantity > 0);
    onPackagesChange(updatedPackages);
  }
  return (
    <section>
      <h2>Snack Packages</h2>
      <p>Choose packages for your meeting.</p>
      {snackPackages.map((snackPackage) => {
        const quantity =
          selectedPackages.find((item) => item.packageId === snackPackage.id)
            ?.quantity ?? 0;

        return (
          <div key={snackPackage.id}>
            <h3>{snackPackage.name}</h3>
            <button
              type="button"
              onClick={() => decreaseQuantity(snackPackage.id)}
              disabled={quantity === 0}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => increaseQuantity(snackPackage.id)}
            >
              +
            </button>
          </div>
        );
      })}
    </section>
  );
}
