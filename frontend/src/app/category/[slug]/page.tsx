import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { ProductCard } from "@/components/storefront/product-card";
import { apiFetch, ApiError } from "@/lib/api";
import type { Category, ProductListItem } from "@/types/catalog";

type CategoryResponse = { data: Category; meta: { products: { data: ProductListItem[] } } };
type Params = Promise<{ slug: string }>;

async function getCategory(slug: string): Promise<CategoryResponse | null> {
  try {
    return await apiFetch<CategoryResponse>(`/categories/${slug}`, { cache: "no-store" });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const res = await getCategory(slug);
  if (!res) return { title: "Category not found" };
  return {
    title: `${res.data.name} — Silver jewelry`,
    description: res.data.description ?? `Shop handcrafted silver ${res.data.name}.`,
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const res = await getCategory(slug);
  if (!res) notFound();

  const category = res.data;
  const products = res.meta.products.data;

  return (
    <StorefrontShell>
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-semibold">{category.name}</h1>
          {category.description && (
            <p className="mt-1 max-w-2xl text-sm text-[var(--muted-foreground)]">{category.description}</p>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-12 text-center">
            <p className="font-medium">No products in this category yet</p>
            <Link href="/shop" className="mt-2 inline-block text-sm text-[var(--primary)] hover:underline">
              Browse all silver
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
                Refine with filters →
              </Link>
            </div>
          </>
        )}
      </div>
    </StorefrontShell>
  );
}
