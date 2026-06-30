import { Gem, PencilRuler, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { HomeHero } from "@/components/storefront/home-hero";
import { Button } from "@/components/ui/button";
import { retailCategories, storeConfig } from "@/config";

const trustBadges = [
  {
    title: "Secure order",
    copy: "Prices and totals are confirmed server-side. Pay safely, your way.",
    icon: ShieldCheck,
  },
  {
    title: "Quality silver",
    copy: "Egyptian, Italian, Turkish and local silver — clearly labelled by type and weight.",
    icon: Gem,
  },
  {
    title: "Fast delivery",
    copy: "Carefully packed and shipped across Egypt with tracking on every order.",
    icon: Truck,
  },
  {
    title: "Custom design",
    copy: "Send a reference image and we will craft a bespoke piece made just for you.",
    icon: PencilRuler,
  },
];

export default function Home() {
  return (
    <StorefrontShell>
      <HomeHero />

      {/* Featured categories */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto grid w-full max-w-7xl gap-3 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {retailCategories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--primary)]"
            >
              {category.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-[var(--background)]">
        <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {trustBadges.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-[var(--border)] bg-white p-6"
            >
              <item.icon className="h-6 w-6 text-[var(--accent)]" />
              <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                {item.copy}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Custom silver order CTA */}
      <section className="bg-[var(--surface)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
              Made for you
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Have something specific in mind?
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--muted-foreground)]">
              Upload a reference photo, tell us the silver type, weight and size,
              and our workshop will send you a quote. Approve it and we craft your
              custom {storeConfig.name} piece.
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
