import { Gem, Mail, MessageCircle, PencilRuler, Phone, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { HomeHero } from "@/components/storefront/home-hero";
import { ProductCard } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import { storeConfig } from "@/config";
import { apiFetch } from "@/lib/api";
import type { Category, ProductListItem } from "@/types/catalog";

type HomeData = {
  featured_categories: Category[];
  featured_products: ProductListItem[];
  new_arrivals: ProductListItem[];
  best_sellers: ProductListItem[];
};

const trustBadges = [
  { title: "Secure order", copy: "Prices and totals confirmed server-side. Pay safely, your way.", icon: ShieldCheck },
  { title: "Quality silver", copy: "Egyptian, Italian, Turkish and local silver — labelled by type and weight.", icon: Gem },
  { title: "Fast delivery", copy: "Carefully packed and shipped across Egypt with tracking.", icon: Truck },
  { title: "Custom design", copy: "Send a reference image and we craft a bespoke piece for you.", icon: PencilRuler },
];

async function getHome(): Promise<HomeData> {
  try {
    const res = await apiFetch<{ data: HomeData }>("/home", { cache: "no-store" });
    return res.data;
  } catch {
    return { featured_categories: [], featured_products: [], new_arrivals: [], best_sellers: [] };
  }
}

function ProductRow({ title, href, products }: { title: string; href: string; products: ProductListItem[] }) {
  if (products.length === 0) return null;
  return (
    <section className="bg-[var(--background)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">{title}</h2>
          <Link href={href} className="text-sm font-medium text-[var(--primary)] hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const data = await getHome();
  const categories = data.featured_categories.length
    ? data.featured_categories
    : [];

  return (
    <StorefrontShell>
      <HomeHero />

      {categories.length > 0 && (
        <section className="border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto grid w-full max-w-7xl gap-3 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--primary)]"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <ProductRow title="Featured pieces" href="/shop?featured=1" products={data.featured_products} />
      <ProductRow title="Best sellers" href="/shop?best_sellers=1" products={data.best_sellers} />
      <ProductRow title="New arrivals" href="/shop?sort=newest" products={data.new_arrivals} />

      {/* Trust badges */}
      <section className="bg-[var(--surface)]">
        <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {trustBadges.map((item) => (
            <article key={item.title} className="rounded-xl border border-[var(--border)] bg-white p-6">
              <item.icon className="h-6 w-6 text-[var(--accent)]" />
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Support & social */}
      <section className="bg-[var(--background)]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl">We&apos;re here to help</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Questions about a piece, sizing, or a custom order? Reach us any day during working hours.
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-[var(--accent)]" />
                <a
                  href={`https://wa.me/${storeConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--primary)]"
                >
                  WhatsApp {storeConfig.contact.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-[var(--accent)]" /> {storeConfig.contact.phone}</li>
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-[var(--accent)]" /> {storeConfig.contact.email}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-white p-6">
            <h3 className="font-semibold">Follow {storeConfig.name}</h3>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">See new arrivals and custom pieces on social.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {["Instagram", "Facebook", "TikTok"].map((name) => (
                <a
                  key={name}
                  href="#"
                  className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--primary)]"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Custom silver CTA */}
      <section className="bg-[var(--foreground)] text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">Made for you</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">Have something specific in mind?</h2>
            <p className="mt-4 text-base leading-7 text-white/75">
              Upload a reference photo, tell us the silver type, weight and size, and our workshop sends
              you a quote. Approve it and we craft your custom {storeConfig.name} piece.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/custom-order">Start a custom order</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/shop">Browse silver</Link>
            </Button>
          </div>
        </div>
      </section>
    </StorefrontShell>
  );
}
