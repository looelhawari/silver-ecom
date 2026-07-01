"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/stores/useCartStore";

export default function CartPage() {
  const locale = useLocale();
  const t = useTranslations("cart");
  const common = useTranslations("common");
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <StorefrontShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-semibold">{t("title")}</h1>

        {items.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-[var(--border)] bg-white p-12 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-[var(--muted-foreground)] opacity-40" />
            <p className="mt-4 font-medium">{t("emptyTitle")}</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{t("emptyCopy")}</p>
            <Button asChild className="mt-6">
              <Link href="/shop">{common("shopSilver")}</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId ?? "x"}`}
                  className="flex gap-4 rounded-xl border border-[var(--border)] bg-white p-4"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--muted)]">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/products/${item.slug}`} className="font-medium hover:text-[var(--primary)]">
                          {item.name}
                        </Link>
                        {item.variantLabel && (
                          <p className="text-xs text-[var(--muted-foreground)]">{item.variantLabel}</p>
                        )}
                      </div>
                      <button
                        onClick={() => remove(item.productId, item.variantId)}
                        className="text-[var(--muted-foreground)] hover:text-red-600"
                        aria-label={common("remove")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-lg border border-[var(--border)]">
                        <button className="px-2.5 py-1.5" aria-label={common("decrease")}
                          onClick={() => setQuantity(item.productId, item.variantId, item.quantity - 1)}>
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button className="px-2.5 py-1.5" aria-label={common("increase")}
                          onClick={() => setQuantity(item.productId, item.variantId, item.quantity + 1)}>
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-medium">{formatPrice(item.price * item.quantity, "EGP", locale)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-xl border border-[var(--border)] bg-white p-6">
              <h2 className="font-semibold">{t("summary")}</h2>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">{t("subtotal")}</span>
                <span className="font-medium">{formatPrice(subtotal, "EGP", locale)}</span>
              </div>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                {common("shippingAtCheckout")}
              </p>
              <Button asChild className="mt-5 w-full" size="lg">
                <Link href="/checkout">{t("proceed")}</Link>
              </Button>
              <Link href="/shop" className="mt-3 block text-center text-sm text-[var(--primary)] hover:underline">
                {common("continueShopping")}
              </Link>
            </aside>
          </div>
        )}
      </div>
    </StorefrontShell>
  );
}
