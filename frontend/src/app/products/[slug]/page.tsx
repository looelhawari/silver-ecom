import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductPurchase } from "@/components/storefront/product-purchase";
import { apiFetch, ApiError } from "@/lib/api";
import type { ProductDetail, ProductListItem } from "@/types/catalog";

type ProductResponse = { data: ProductDetail; meta: { related: ProductListItem[] } };
type Params = Promise<{ slug: string }>;

async function getProduct(slug: string): Promise<ProductResponse | null> {
  try {
    return await apiFetch<ProductResponse>(`/products/${slug}`, { cache: "no-store" });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const res = await getProduct(slug);
  if (!res) return { title: "Product not found" };
  const p = res.data;
  return {
    title: p.name,
    description: p.description?.slice(0, 160) ?? `${p.name} — 925 sterling silver.`,
    openGraph: { images: p.main_image ? [p.main_image] : [] },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const res = await getProduct(slug);
  if (!res) notFound();

  const product = res.data;
  const related = res.meta.related;
  const gallery = product.images.length ? product.images : [];

  return (
    <StorefrontShell>
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-[var(--muted-foreground)]">
          <Link href="/shop" className="hover:text-[var(--primary)]">Shop</Link>
          {product.category && (
            <>
              {" / "}
              <Link href={`/category/${product.category.slug}`} className="hover:text-[var(--primary)]">
                {product.category.name}
              </Link>
            </>
          )}
          {" / "}
          <span className="text-[var(--foreground)]">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--muted)]">
              {product.main_image || gallery[0] ? (
                <Image
                  src={product.main_image ?? gallery[0].url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[var(--muted-foreground)]">
                  No image yet
                </div>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {gallery.slice(0, 5).map((img) => (
                  <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg bg-[var(--muted)]">
                    <Image src={img.url} alt={img.alt ?? product.name} fill sizes="10vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted-foreground)]">
              {product.silver_type && <span>{product.silver_type.name}</span>}
              {product.silver_type?.purity && <span>· {product.silver_type.purity}</span>}
              {product.weight_in_grams ? <span>· {product.weight_in_grams} g</span> : null}
            </div>
            <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">{product.name}</h1>

            <div className="mt-6">
              <ProductPurchase product={product} />
            </div>

            {product.description && (
              <div className="mt-8 border-t border-[var(--border)] pt-6">
                <h2 className="font-semibold">Description</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{product.description}</p>
              </div>
            )}
            {product.workmanship_fee !== undefined && (
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                Includes workmanship fee: {product.workmanship_fee} {product.currency}
              </p>
            )}
            {product.care_instructions && (
              <div className="mt-6">
                <h2 className="font-semibold">Care</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{product.care_instructions}</p>
              </div>
            )}
            <div className="mt-6 rounded-lg bg-[var(--surface)] p-4 text-sm text-[var(--muted-foreground)]">
              Ready-made pieces can be exchanged within 14 days in original condition. See our{" "}
              <Link href="/returns-policy" className="text-[var(--primary)] hover:underline">returns policy</Link>.
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-serif text-2xl font-semibold">You may also like</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </StorefrontShell>
  );
}
