"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  productId: number;
  slug: string;
  name: string;
  price: number;
  image?: string | null;
  variantId?: number | null;
  variantLabel?: string | null;
  quantity: number;
};

type CartState = {
  items: CartLine[];
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  remove: (productId: number, variantId?: number | null) => void;
  setQuantity: (productId: number, variantId: number | null | undefined, quantity: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

const sameLine = (a: CartLine, productId: number, variantId?: number | null) =>
  a.productId === productId && (a.variantId ?? null) === (variantId ?? null);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (line, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => sameLine(i, line.productId, line.variantId));
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, line.productId, line.variantId)
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...line, quantity }] };
        }),
      remove: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, productId, variantId)),
        })),
      setQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => (sameLine(i, productId, variantId) ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "fidda-cart" },
  ),
);
