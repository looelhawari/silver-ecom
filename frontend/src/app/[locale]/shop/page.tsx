import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { ShopBrowser } from "@/components/storefront/shop-browser";

type PageParams = Promise<{ locale: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return {
    title: t("shopTitle"),
    description: t("shopDescription"),
  };
}

export default async function ShopPage({ searchParams, params }: { searchParams: SearchParams; params: PageParams }) {
  const sp = await searchParams;
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop" });
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  return (
    <StorefrontShell>
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-semibold">{t("title")}</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {t("subtitle")}
          </p>
        </div>
      </div>
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10">{t("loading")}</div>}>
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
