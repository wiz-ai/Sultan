'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from './types';

export interface CartLine {
  productId: string;
  name: string;
  price: number;
  emoji: string;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  add: (p: Product, qty?: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (p, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.productId === p.id);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.productId === p.id ? { ...l, qty: l.qty + qty } : l
              ),
            };
          }
          return {
            lines: [
              ...s.lines,
              { productId: p.id, name: p.name, price: p.price, emoji: p.emoji, qty },
            ],
          };
        }),
      increment: (id) =>
        set((s) => ({
          lines: s.lines.map((l) =>
            l.productId === id ? { ...l, qty: l.qty + 1 } : l
          ),
        })),
      decrement: (id) =>
        set((s) => ({
          lines: s.lines
            .map((l) =>
              l.productId === id ? { ...l, qty: l.qty - 1 } : l
            )
            .filter((l) => l.qty > 0),
        })),
      remove: (id) =>
        set((s) => ({ lines: s.lines.filter((l) => l.productId !== id) })),
      clear: () => set({ lines: [] }),
      subtotal: () => get().lines.reduce((acc, l) => acc + l.price * l.qty, 0),
      itemCount: () => get().lines.reduce((acc, l) => acc + l.qty, 0),
    }),
    { name: 'sultan-cart' }
  )
);
