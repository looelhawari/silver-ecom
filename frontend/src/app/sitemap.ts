import type { MetadataRoute } from "next";

import { apiFetch } from "@/lib/api";
import type { Category, ProductListItem } from "@/types/catalog";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_PATHS = [
  "", "/shop", "/custom-order", "/track-order", "/track-custom",
  "/about", "/contact", "/faq", "/privacy-policy", "/terms",
  "/returns-policy", "/silver-care", "/login", "/register",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.6,
  }));

  try {
    const [products, categories] = await Promise.all([
      apiFetch<{ data: ProductListItem[] }>("/products?per_page=48", { cache: "no-store" }),
      apiFetch<{ data: Category[] }>("/categories", { cache: "no-store" }),
    ]);

    for (const c of categories.data) {
      entries.push({ url: `${SITE}/category/${c.slug}`, changeFrequency: "weekly", priority: 0.7 });
    }
    for (const p of products.data) {
      entries.push({ url: `${SITE}/products/${p.slug}`, changeFrequency: "weekly", priority: 0.8 });
    }
  } catch {
    // API unavailable at build — ship static routes only.
  }

  return entries;
}
