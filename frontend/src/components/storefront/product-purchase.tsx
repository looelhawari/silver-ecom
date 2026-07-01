"use client";

import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import type { ProductDetail } from "@/types/catalog";

export function ProductPurchase({ product }: { product: ProductDetail }) {
  const router = useRouter();
  const add = useCartStore((s) => s.add);
  const user = useAuthStore((s) => s.user);
  const [quantity, setQuantity] = useState(1);
  const [variantId, setVariantId] = useState<number | null>(product.variants[0]?.id ?? null);

  const addToWishlist = async () => {
    if (!user) {
      toast.error("Sign in to save to your wishlist.");
      return router.push("/login");
    }
    try {
      await apiFetch(`/wishlist/${product.id}`, { method: "POST" });
      toast.success("Saved to wishlist");
    } catch {
      toast.error("Could not update wishlist.");
    }
  };

  const variant = product.variants.find((v) => v.id === variantId);
  const unitPrice = product.price + (variant?.price_adjustment ?? 0);

  const addToCart = () => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: unitPrice,
        image: product.main_image ?? product.images[0]?.url ?? null,
        variantId: variant?.id ?? null,
        variantLabel: variant?.label ?? null,
      },
      quantity,
    );
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="space-y-5">
      <div className="font-serif text-3xl font-semibold">{formatPrice(unitPrice, product.currency)}</div>

      {product.variants.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">{product.variants[0].type.replace(/_/g, " ")}</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  variantId === v.id
                    ? "border-[var(--foreground)] bg-[var(--foreground)] text-white"
                    : "border-[var(--border)] hover:border-[var(--foreground)]"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-lg border border-[var(--border)]">
          <button type="button" className="px-3 py-2" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button type="button" className="px-3 py-2" onClick={() => setQuantity((q) => q + 1)} aria-label="Increase">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className={`text-sm ${product.in_stock ? "text-[var(--muted-foreground)]" : "text-red-600"}`}>
          {product.in_stock ? `In stock (${product.stock_quantity})` : "Out of stock"}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="flex-1" disabled={!product.in_stock} onClick={addToCart}>
          <ShoppingBag className="h-4 w-4" /> Add to cart
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="flex-1"
          disabled={!product.in_stock}
          onClick={() => {
            addToCart();
            router.push("/checkout");
          }}
        >
          Buy now
        </Button>
        <Button size="lg" variant="outline" aria-label="Add to wishlist" onClick={addToWishlist}>
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
