import type { NavigationItem } from "@/types/commerce";

export const primaryNavigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Custom Order", href: "/custom-order" },
  { label: "Track Order", href: "/track-order" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Storefront jewelry categories shown on the home page (mirrors seeded categories). */
export const retailCategories: NavigationItem[] = [
  { label: "Rings", href: "/category/rings" },
  { label: "Bracelets", href: "/category/bracelets" },
  { label: "Necklaces", href: "/category/necklaces" },
  { label: "Chains", href: "/category/chains" },
  { label: "Anklets", href: "/category/anklets" },
  { label: "Earrings", href: "/category/earrings" },
  { label: "Pendants", href: "/category/pendants" },
  { label: "Sets", href: "/category/sets" },
];
