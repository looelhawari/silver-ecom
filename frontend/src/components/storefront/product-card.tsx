"use client";

import { Gem, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/stores/useCartStore";
import type { ProductListItem } from "@/types/catalog";

export function ProductCard({ product }: { product: ProductListItem }) {
  const add = useCartStore((s) => s.add);

  const badge = product.is_best_seller
    ? { label: "Best seller", tone: "bg-[var(--accent)] text-white" }
    : product.is_featured
      ? { label: "Featured", tone: "bg-[var(--foreground)] text-white" }
      : null;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-white transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-[var(--muted)]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--muted-foreground)]">
            <Gem className="h-10 w-10 opacity-40" />
          </div>
        )}
        {badge && (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${badge.tone}`}>
            {badge.label}
          </span>
        )}
        {!product.in_stock && (
          <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          {product.silver_type && <span>{product.silver_type}</span>}
          {product.weight_in_grams ? <span>· {product.weight_in_grams} g</span> : null}
        </div>
        <Link href={`/products/${product.slug}`} className="mt-1 line-clamp-2 font-medium hover:text-[var(--primary)]">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-serif text-lg font-semibold">
            {formatPrice(product.price, product.currency)}
          </span>
          <Button
            size="icon"
            variant="secondary"
            aria-label="Add to cart"
            disabled={!product.in_stock}
            onClick={() => {
              add({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image ?? null,
              });
              toast.success(`${product.name} added to cart`);
            }}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
