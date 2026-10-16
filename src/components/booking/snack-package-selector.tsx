"use client";
import { snackPackages } from "@/lib/booking-extras";
import { QuantitySelector } from "./quantity-selector";
import type { Messages } from "@/i18n/messages";

export type PackageSelection = { packageId: string; quantity: number };
type Props = {
  selectedPackages: PackageSelection[];
  onPackagesChange: (packages: PackageSelection[]) => void;
  disabled?: boolean;
  text: Messages["booking"]["extras"];
};
export function SnackPackageSelector({ selectedPackages, onPackagesChange, disabled, text }: Props) {
  return <QuantitySelector title={text.food} text={text} disabled={disabled}
    items={snackPackages.map((item) => ({ id: item.id, name: text.items[item.id] }))}
    selected={selectedPackages.map((item) => ({ id: item.packageId, quantity: item.quantity }))}
    onChange={(items) => onPackagesChange(items.map((item) => ({ packageId: item.id, quantity: item.quantity })))} />;
}
