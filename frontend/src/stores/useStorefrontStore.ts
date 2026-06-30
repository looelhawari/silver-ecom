import { create } from "zustand";

type StorefrontState = {
  cartOpen: boolean;
  cartCount: number;
  wishlistCount: number;
  setCartOpen: (open: boolean) => void;
  setCartCount: (count: number) => void;
  setWishlistCount: (count: number) => void;
};

export const useStorefrontStore = create<StorefrontState>((set) => ({
  cartOpen: false,
  cartCount: 0,
  wishlistCount: 0,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setCartCount: (cartCount) => set({ cartCount }),
  setWishlistCount: (wishlistCount) => set({ wishlistCount }),
}));
