import type { FeatureFlags } from "@/types/commerce";

/** Mirrors the backend `config/features.php` public flags. */
export const featureFlags: FeatureFlags = {
  wishlist: true,
  customOrders: true,
  guestCheckout: true,
  orderTracking: true,
  liveChat: false,
};
