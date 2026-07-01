"use client";

import { Heart, Minus, Plus, Share2, ShoppingBag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { apiFetch } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { localizedField } from "@/lib/locale";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import type { ProductDetail } from "@/types/catalog";

export function ProductPurchase({ product }: { product: ProductDetail }) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("product");
  const common = useTranslations("common");
  const add = useCartStore((s) => s.add);
  const user = useAuthStore((s) => s.user);
  const [quantity, setQuantity] = useState(1);
  const [variantId, setVariantId] = useState<number | null>(product.variants[0]?.id ?? null);

  const name = localizedField(product, "name", locale);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: name, url });
      } catch {
        // user cancelled
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      toast.success(common("copied"));
    }
  };

  const addToWishlist = async () => {
    if (!user) {
      toast.error(t("wishlistSignIn"));
      return router.push("/login");
    }
    try {
      await apiFetch(`/wishlist/${product.id}`, { method: "POST" });
      toast.success(t("savedWishlist"));
    } catch {
      toast.error(t("wishlistError"));
    }
  };

  const variant = product.variants.find((v) => v.id === variantId);
  const unitPrice = product.price + (variant?.price_adjustment ?? 0);

  const addToCart = () => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name,
        price: unitPrice,
        image: product.main_image ?? product.images[0]?.url ?? null,
        variantId: variant?.id ?? null,
        variantLabel: variant?.label ?? null,
      },
      quantity,
    );
    toast.success(t("addedToCart", { name }));
  };

  return (
    <div className="space-y-5">
      <div className="font-serif text-3xl font-semibold">{formatPrice(unitPrice, product.currency, locale)}</div>

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
          <button type="button" className="px-3 py-2" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label={common("decrease")}>
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button type="button" className="px-3 py-2" onClick={() => setQuantity((q) => q + 1)} aria-label={common("increase")}>
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className={`text-sm ${product.in_stock ? "text-[var(--muted-foreground)]" : "text-red-600"}`}>
          {product.in_stock ? t("inStock", { count: product.stock_quantity }) : t("outOfStock")}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="flex-1" disabled={!product.in_stock} onClick={addToCart}>
          <ShoppingBag className="h-4 w-4" /> {t("addToCart")}
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
          {t("buyNow")}
        </Button>
        <Button size="lg" variant="outline" aria-label={t("wishlist")} onClick={addToWishlist}>
          <Heart className="h-4 w-4" />
        </Button>
        <Button size="lg" variant="outline" aria-label={t("share")} onClick={share}>
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
