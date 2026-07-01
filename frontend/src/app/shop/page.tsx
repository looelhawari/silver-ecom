import type { Metadata } from "next";
import { Suspense } from "react";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { ShopBrowser } from "@/components/storefront/shop-browser";

export const metadata: Metadata = {
  title: "Shop silver jewelry",
  description: "Browse Egyptian, Italian, Turkish and local silver jewelry — filter by category, silver type and price.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  return (
    <StorefrontShell>
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-semibold">Shop silver</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Handcrafted 925 sterling silver, priced transparently.
          </p>
        </div>
      </div>
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10">Loading…</div>}>
        <ShopBrowser
          initial={{
            q: first(sp.q),
            category: first(sp.category),
            silver_type: first(sp.silver_type),
            sort: first(sp.sort),
          }}
        />
      </Suspense>
    </StorefrontShell>
  );
}
