"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";

import { ProductCard } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import type { Category, PaginatedMeta, ProductListItem } from "@/types/catalog";

type Filters = {
  q: string;
  category: string;
  silver_type: string;
  sort: string;
  page: number;
};

type ProductsResponse = { data: ProductListItem[]; meta: PaginatedMeta };
type SilverType = { id: number; name: string; slug: string };

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "best_sellers", label: "Best sellers" },
];

export function ShopBrowser({ initial }: { initial: Partial<Filters> }) {
  const [filters, setFilters] = useState<Filters>({
    q: initial.q ?? "",
    category: initial.category ?? "",
    silver_type: initial.silver_type ?? "",
    sort: initial.sort ?? "newest",
    page: 1,
  });
  const [searchTerm, setSearchTerm] = useState(filters.q);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiFetch<{ data: Category[] }>("/categories").then((r) => r.data),
  });
  const { data: silverTypes } = useQuery({
    queryKey: ["silver-types"],
    queryFn: () => apiFetch<{ data: SilverType[] }>("/silver-types").then((r) => r.data),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.q) params.set("q", filters.q);
      if (filters.category) params.set("category", filters.category);
      if (filters.silver_type) params.set("silver_type", filters.silver_type);
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
            placeholder="Search silver…"
            className="w-full rounded-lg border border-[var(--border)] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--primary)]"
          />
        </form>

        <FilterGroup label="Category">
          <FilterOption active={!filters.category} onClick={() => update({ category: "" })}>All</FilterOption>
          {categories?.map((c) => (
            <FilterOption key={c.slug} active={filters.category === c.slug} onClick={() => update({ category: c.slug })}>
              {c.name}
            </FilterOption>
          ))}
        </FilterGroup>

        <FilterGroup label="Silver type">
          <FilterOption active={!filters.silver_type} onClick={() => update({ silver_type: "" })}>All</FilterOption>
          {silverTypes?.map((s) => (
            <FilterOption key={s.slug} active={filters.silver_type === s.slug} onClick={() => update({ silver_type: s.slug })}>
              {s.name}
            </FilterOption>
          ))}
        </FilterGroup>
      </aside>

      {/* Results */}
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--muted-foreground)]">
            {meta ? `${meta.total} product${meta.total === 1 ? "" : "s"}` : "Loading…"}
          </p>
          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value })}
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {isError ? (
          <EmptyState title="Couldn't load products" copy="Please try again in a moment." />
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-[var(--muted)]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState title="No products found" copy="Try adjusting your search or filters." />
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
                  Previous
                </Button>
                <span className="text-sm text-[var(--muted-foreground)]">
                  Page {meta.current_page} of {meta.last_page}
                </span>
                <Button variant="outline" disabled={filters.page >= meta.last_page} onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}>
                  Next
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
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">{label}</p>
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
