"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { ProductCard } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { apiFetch } from "@/lib/api";
import { localizedField } from "@/lib/locale";
import type { Category, PaginatedMeta, ProductListItem } from "@/types/catalog";

type Filters = {
  q: string;
  category: string;
  silver_type: string;
  price_min: string;
  price_max: string;
  weight_min: string;
  weight_max: string;
  sort: string;
  page: number;
};

type ProductsResponse = { data: ProductListItem[]; meta: PaginatedMeta };
type SilverType = { id: number; name: string; name_en?: string | null; name_ar?: string | null; slug: string };

const SORTS = [
  "newest",
  "price_asc",
  "price_desc",
  "best_sellers",
];

const rangeInput =
  "w-full rounded-md border border-[var(--border)] bg-white px-2 py-1.5 text-sm outline-none focus:border-[var(--primary)]";

export function ShopBrowser({ initial }: { initial: Partial<Filters> }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("shop");
  const common = useTranslations("common");
  const [filters, setFilters] = useState<Filters>({
    q: initial.q ?? "",
    category: initial.category ?? "",
    silver_type: initial.silver_type ?? "",
    price_min: "",
    price_max: "",
    weight_min: "",
    weight_max: "",
    sort: initial.sort ?? "newest",
    page: 1,
  });
  const [searchTerm, setSearchTerm] = useState(filters.q);
  const [range, setRange] = useState({ price_min: "", price_max: "", weight_min: "", weight_max: "" });

  const { data: categories } = useQuery({
    queryKey: ["categories", locale],
    queryFn: () => apiFetch<{ data: Category[] }>("/categories").then((r) => r.data),
  });
  const { data: silverTypes } = useQuery({
    queryKey: ["silver-types", locale],
    queryFn: () => apiFetch<{ data: SilverType[] }>("/silver-types").then((r) => r.data),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", filters, locale],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.q) params.set("q", filters.q);
      if (filters.category) params.set("category", filters.category);
      if (filters.silver_type) params.set("silver_type", filters.silver_type);
      if (filters.price_min) params.set("price_min", filters.price_min);
      if (filters.price_max) params.set("price_max", filters.price_max);
      if (filters.weight_min) params.set("weight_min", filters.weight_min);
      if (filters.weight_max) params.set("weight_max", filters.weight_max);
      params.set("sort", filters.sort);
      params.set("page", String(filters.page));
      return apiFetch<ProductsResponse>(`/products?${params.toString()}`);
    },
    placeholderData: keepPreviousData,
  });

  const update = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, page: 1, ...patch }));

  const meta = data?.meta;
  const products = data?.data ?? [];

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      {/* Filters */}
      <aside className="space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: searchTerm });
          }}
          className="relative"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-lg border border-[var(--border)] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--primary)]"
          />
        </form>

        <FilterGroup label={t("category")}>
          <FilterOption active={!filters.category} onClick={() => update({ category: "" })}>{t("all")}</FilterOption>
          {categories?.map((c) => (
            <FilterOption key={c.slug} active={filters.category === c.slug} onClick={() => update({ category: c.slug })}>
              {localizedField(c, "name", locale)}
            </FilterOption>
          ))}
        </FilterGroup>

        <FilterGroup label={t("silverType")}>
          <FilterOption active={!filters.silver_type} onClick={() => update({ silver_type: "" })}>{t("all")}</FilterOption>
          {silverTypes?.map((s) => (
            <FilterOption key={s.slug} active={filters.silver_type === s.slug} onClick={() => update({ silver_type: s.slug })}>
              {localizedField(s, "name", locale)}
            </FilterOption>
          ))}
        </FilterGroup>

        <FilterGroup label={t("price")}>
          <div className="flex items-center gap-2">
            <input type="number" min="0" placeholder={t("min")} value={range.price_min}
              onChange={(e) => setRange((r) => ({ ...r, price_min: e.target.value }))} className={rangeInput} />
            <input type="number" min="0" placeholder={t("max")} value={range.price_max}
              onChange={(e) => setRange((r) => ({ ...r, price_max: e.target.value }))} className={rangeInput} />
          </div>
        </FilterGroup>

        <FilterGroup label={t("weight")}>
          <div className="flex items-center gap-2">
            <input type="number" min="0" step="0.1" placeholder={t("min")} value={range.weight_min}
              onChange={(e) => setRange((r) => ({ ...r, weight_min: e.target.value }))} className={rangeInput} />
            <input type="number" min="0" step="0.1" placeholder={t("max")} value={range.weight_max}
              onChange={(e) => setRange((r) => ({ ...r, weight_max: e.target.value }))} className={rangeInput} />
          </div>
        </FilterGroup>

        <Button variant="outline" size="sm" onClick={() => update({ ...range })}>{t("applyFilters")}</Button>
      </aside>

      {/* Results */}
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--muted-foreground)]">
            {meta ? t("productsCount", { count: meta.total }) : t("loading")}
          </p>
          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value })}
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
          >
            {SORTS.map((sort) => (
              <option key={sort} value={sort}>{t(`sort.${sort}`)}</option>
            ))}
          </select>
        </div>

        {isError ? (
          <EmptyState title={t("couldNotLoad")} copy={common("pleaseTryAgain")} />
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-[var(--muted)]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState title={t("noProducts")} copy={t("adjustFilters")} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {meta && meta.last_page > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button variant="outline" disabled={filters.page <= 1} onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}>
                  {t("previous")}
                </Button>
                <span className="text-sm text-[var(--muted-foreground)]">
                  {t("pageOf", { current: meta.current_page, total: meta.last_page })}
                </span>
                <Button variant="outline" disabled={filters.page >= meta.last_page} onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}>
                  {t("next")}
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-normal text-[var(--muted-foreground)]">{label}</p>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function FilterOption({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
        active ? "bg-[var(--foreground)] text-white" : "hover:bg-[var(--muted)]"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-12 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{copy}</p>
    </div>
  );
}
