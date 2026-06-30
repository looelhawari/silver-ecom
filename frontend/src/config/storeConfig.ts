import type { StoreConfig } from "@/types/commerce";

/**
 * Brand defaults for the storefront. These mirror the backend's
 * `config/white_label.php` values and can be overridden there per environment.
 * Replace "Fidda Silver" and the contact details with the real business data.
 */
export const storeConfig: StoreConfig = {
  name: "Fidda Silver",
  slogan: "Egyptian, Italian & Turkish silver — and bespoke pieces made for you.",
  businessType: "jewelry",
  currency: "EGP",
  locale: "en",
  direction: "ltr",
  logoPath: "/brand/logo.svg",
  faviconPath: "/favicon.ico",
  contact: {
    phone: "+20 100 000 0000",
    whatsapp: "+20 100 000 0000",
    email: "care@fidda-silver.test",
    address: "Cairo, Egypt",
    workingHours: "Sat–Thu 11:00–21:00",
  },
  hero: {
    eyebrow: "Handcrafted silver",
    headline: "Silver jewelry, made to be kept.",
    copy: "Egyptian, Italian, Turkish and local silver — rings, bracelets, necklaces and chains. Or send us a reference and we will craft a custom piece just for you.",
    imagePath: "/images/storefront-hero.png",
  },
};
