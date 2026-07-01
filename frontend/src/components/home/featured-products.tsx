"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ProductCard } from "@/components/storefront/product-card";
import type { ProductListItem } from "@/types/catalog";

type Group = { key: string; label: string; products: ProductListItem[] };

export function FeaturedProducts({ groups }: { groups: Group[] }) {
  const t = useTranslations("homepage.featuredProducts");
  const available = groups.filter((g) => g.products.length > 0);
  const [active, setActive] = useState(available[0]?.key ?? "");

  if (available.length === 0) return null;

  const current = available.find((g) => g.key === active) ?? available[0];

  return (
    <section className="bg-[var(--background)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-normal text-[var(--accent)]">
              {t("eyebrow")}
            </span>
            <h2 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">{t("title")}</h2>
          </div>
          <div className="flex gap-2">
            {available.map((g) => (
              <button
                key={g.key}
                onClick={() => setActive(g.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  current.key === g.key
                    ? "bg-[var(--foreground)] text-white"
                    : "border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)]"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {current.products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex h-11 items-center rounded-lg border border-[var(--border)] px-6 text-sm font-semibold transition-colors hover:border-[var(--foreground)]"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
