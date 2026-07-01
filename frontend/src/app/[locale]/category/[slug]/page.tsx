import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { ProductCard } from "@/components/storefront/product-card";
import { apiFetch, ApiError } from "@/lib/api";
import { localizedField, normalizeLocale } from "@/lib/locale";
import type { Category, ProductListItem } from "@/types/catalog";

type CategoryResponse = { data: Category; meta: { products: { data: ProductListItem[] } } };
type Params = Promise<{ locale: string; slug: string }>;

async function getCategory(slug: string, locale: string): Promise<CategoryResponse | null> {
  try {
    return await apiFetch<CategoryResponse>(`/categories/${slug}`, { cache: "no-store", locale });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = normalizeLocale(rawLocale);
  const common = await getTranslations({ locale, namespace: "common" });
  const res = await getCategory(slug, locale);
  if (!res) return { title: common("categoryNotFound") };
  const name = localizedField(res.data, "name", locale);
  const description = localizedField(res.data, "description", locale);
  return {
    title: `${name} - Silver jewelry`,
    description: description || `Shop handcrafted silver ${name}.`,
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { locale: rawLocale, slug } = await params;
  const locale = normalizeLocale(rawLocale);
  const common = await getTranslations({ locale, namespace: "common" });
  const res = await getCategory(slug, locale);
  if (!res) notFound();

  const category = res.data;
  const name = localizedField(category, "name", locale);
  const description = localizedField(category, "description", locale);
  const products = res.meta.products.data;

  return (
    <StorefrontShell>
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-semibold">{name}</h1>
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-[var(--muted-foreground)]">{description}</p>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-12 text-center">
            <p className="font-medium">{common("noProductsInCategory")}</p>
            <Link href="/shop" className="mt-2 inline-block text-sm text-[var(--primary)] hover:underline">
              {common("browseSilver")}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href={`/shop?category=${category.slug}`} className="text-sm font-medium text-[var(--primary)] hover:underline">
                {common("refineWithFilters")} <span className="rtl-flip inline-block">-&gt;</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </StorefrontShell>
  );
}
