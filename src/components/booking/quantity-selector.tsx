"use client";

import { useId } from "react";
import { MAX_EXTRAS_PER_CATEGORY } from "@/lib/booking-extras";
import type { Messages } from "@/i18n/messages";

type Selection = { id: string; quantity: number };
type Props = {
  title: string;
  items: { id: string; name: string }[];
  selected: Selection[];
  onChange: (selected: Selection[]) => void;
  disabled?: boolean;
  text: Messages["booking"]["extras"];
};

export function QuantitySelector({ title, items, selected, onChange, disabled = false, text }: Props) {
  const descriptionId = useId();
  const total = selected.reduce((sum, item) => sum + item.quantity, 0);
  function change(id: string, delta: number) {
    if (disabled || (delta > 0 && total >= MAX_EXTRAS_PER_CATEGORY)) return;
    const existing = selected.find((item) => item.id === id);
    if (!existing && delta < 0) return;
    onChange(existing
      ? selected.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0)
      : [...selected, { id, quantity: 1 }]);
  }
  return (
    <fieldset className="booking-extras" disabled={disabled} aria-describedby={descriptionId}>
      <legend>{title}</legend>
      <p id={descriptionId} className="muted">{text.optional} <span className="booking-extra-total">{text.total}: {total}/{MAX_EXTRAS_PER_CATEGORY}</span></p>
      <div className="booking-extra-list">
        {items.map((item) => {
          const quantity = selected.find((choice) => choice.id === item.id)?.quantity ?? 0;
          return <div className="booking-extra-row" key={item.id}>
            <span>{item.name}</span>
            <div className="booking-stepper">
              <button type="button" disabled={disabled || quantity === 0} aria-label={`${text.decrease}: ${item.name}`} onClick={() => change(item.id, -1)}>−</button>
              <output aria-live="polite" aria-label={`${text.quantity}: ${item.name}`}>{quantity}</output>
              <button type="button" disabled={disabled || total >= MAX_EXTRAS_PER_CATEGORY} aria-label={`${text.increase}: ${item.name}`} onClick={() => change(item.id, 1)}>+</button>
            </div>
          </div>;
        })}
      </div>
    </fieldset>
  );
}
