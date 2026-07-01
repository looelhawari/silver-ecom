"use client";

import { Gem, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { formatPrice } from "@/lib/format";
import { localizedField } from "@/lib/locale";
import { useCartStore } from "@/stores/useCartStore";
import type { ProductListItem } from "@/types/catalog";

export function ProductCard({ product }: { product: ProductListItem }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("product");
  const common = useTranslations("common");
  const add = useCartStore((s) => s.add);
  const name = localizedField(product, "name", locale);
  const silverType =
    typeof product.silver_type === "string"
      ? product.silver_type
      : localizedField(product.silver_type, "name", locale);

  const badge = product.is_best_seller
    ? { label: t("bestSeller"), tone: "bg-[var(--accent)] text-white" }
    : product.is_featured
      ? { label: t("featured"), tone: "bg-[var(--foreground)] text-white" }
      : null;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-white transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-[var(--muted)]">
        {product.image ? (
          <Image
            src={product.image}
            alt={name}
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
            {t("outOfStock")}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          {silverType && <span>{silverType}</span>}
          {product.weight_in_grams ? <span>· {product.weight_in_grams} {common("grams")}</span> : null}
        </div>
        <Link href={`/products/${product.slug}`} className="mt-1 line-clamp-2 font-medium hover:text-[var(--primary)]">
          {name}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-serif text-lg font-semibold">
            {formatPrice(product.price, product.currency, locale)}
          </span>
          <Button
            size="icon"
            variant="secondary"
            aria-label={t("addToCart")}
            disabled={!product.in_stock}
            onClick={() => {
              add({
                productId: product.id,
                slug: product.slug,
                name,
                price: product.price,
                image: product.image ?? null,
              });
              toast.success(t("addedToCart", { name }));
            }}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
