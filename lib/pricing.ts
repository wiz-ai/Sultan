import type { DeliveryType } from './types';

// Pricing rules — the "same-day must be worth it" logic.
// Defaults keep same-day clearly premium but fair.
export const PRICING = {
  tax: 0.075, // 7.5% FL sales tax
  nextDay: {
    flat: 4.99,
    freeOver: 50, // free next-day delivery over $50 subtotal
  },
  sameDay: {
    flat: 12.99,
    priority: 5.99, // priority within 2hr window
    freeOver: 100, // free (non-priority) same-day over $100
    minOrder: 35,
    cutoffHour: 15, // orders placed before 3pm local
  },
} as const;

export function computeDeliveryFee(
  subtotal: number,
  type: DeliveryType,
  priority = false
): { fee: number; freeReason?: string; minNotMet?: number } {
  if (type === 'next-day') {
    if (subtotal >= PRICING.nextDay.freeOver) {
      return { fee: 0, freeReason: `Free next-day over $${PRICING.nextDay.freeOver}` };
    }
    return { fee: PRICING.nextDay.flat };
  }
  // same-day
  if (subtotal < PRICING.sameDay.minOrder) {
    return { fee: PRICING.sameDay.flat, minNotMet: PRICING.sameDay.minOrder };
  }
  let fee: number = PRICING.sameDay.flat;
  if (subtotal >= PRICING.sameDay.freeOver && !priority) {
    fee = 0;
  }
  if (priority) fee += PRICING.sameDay.priority;
  return { fee };
}

export function computeTotals(
  subtotal: number,
  type: DeliveryType,
  priority = false
) {
  const delivery = computeDeliveryFee(subtotal, type, priority);
  const tax = +(subtotal * PRICING.tax).toFixed(2);
  const total = +(subtotal + delivery.fee + tax).toFixed(2);
  return { subtotal: +subtotal.toFixed(2), deliveryFee: delivery.fee, tax, total, ...delivery };
}

export function deliveryWindows(): { id: string; label: string; type: DeliveryType }[] {
  const now = new Date();
  const hour = now.getHours();
  const windows: { id: string; label: string; type: DeliveryType }[] = [];

  // Same-day only if before cutoff
  if (hour < PRICING.sameDay.cutoffHour) {
    windows.push({ id: 'sd-1', label: `Today, ${fmt(hour + 2)}–${fmt(hour + 4)}`, type: 'same-day' });
    windows.push({ id: 'sd-2', label: `Today, ${fmt(hour + 4)}–${fmt(hour + 6)}`, type: 'same-day' });
  }
  windows.push({ id: 'nd-1', label: 'Tomorrow, 9am–12pm', type: 'next-day' });
  windows.push({ id: 'nd-2', label: 'Tomorrow, 12pm–3pm', type: 'next-day' });
  windows.push({ id: 'nd-3', label: 'Tomorrow, 3pm–6pm', type: 'next-day' });
  windows.push({ id: 'nd-4', label: 'Tomorrow, 6pm–9pm', type: 'next-day' });

  return windows;
}

function fmt(h: number) {
  const hh = ((h - 1) % 12) + 1;
  const ap = h < 12 || h >= 24 ? 'am' : 'pm';
  return `${hh}${ap}`;
}
