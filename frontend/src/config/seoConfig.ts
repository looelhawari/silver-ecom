import { storeConfig } from "@/config/storeConfig";
import type { SeoConfig } from "@/types/commerce";

export const seoConfig: SeoConfig = {
  title: `${storeConfig.name} — Fine & Custom Silver Jewelry`,
  description:
    "Shop Egyptian, Italian, Turkish and local silver jewelry, or request a custom-made piece. Secure checkout, custom design, and fast delivery across Egypt.",
  keywords: [
    "silver jewelry",
    "egyptian silver",
    "italian silver",
    "turkish silver",
    "custom silver",
    "rings",
    "bracelets",
    "necklaces",
  ],
  robots: "index,follow",
  openGraphImage: storeConfig.hero.imagePath,
};
