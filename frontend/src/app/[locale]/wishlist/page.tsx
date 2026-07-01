"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { ProductCard } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";
import type { ProductListItem } from "@/types/catalog";

export default function WishlistPage() {
  const account = useTranslations("account");
  const product = useTranslations("product");
  const auth = useTranslations("auth");
  const common = useTranslations("common");
  const qc = useQueryClient();
  const { user, hydrated } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => apiFetch<{ data: ProductListItem[] }>("/wishlist").then((r) => r.data),
    enabled: Boolean(user),
  });

  const remove = useMutation({
    mutationFn: (productId: number) => apiFetch(`/wishlist/${productId}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  return (
    <StorefrontShell>
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-semibold">{account("wishlist")}</h1>

        {hydrated && !user ? (
          <div className="mt-8 rounded-xl border border-dashed border-[var(--border)] bg-white p-12 text-center">
            <p className="font-medium">{product("wishlistSignIn")}</p>
            <Button asChild className="mt-4"><Link href="/login">{auth("signIn")}</Link></Button>
          </div>
        ) : isLoading ? (
          <p className="mt-6 text-sm text-[var(--muted-foreground)]">{common("loading")}</p>
        ) : data && data.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {data.map((p) => (
              <div key={p.id}>
                <ProductCard product={p} />
                <button onClick={() => remove.mutate(p.id)} className="mt-2 text-xs text-[var(--muted-foreground)] hover:text-red-600">
                  {common("remove")}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-dashed border-[var(--border)] bg-white p-12 text-center">
            <p className="font-medium">{account("noWishlist")}</p>
            <Button asChild className="mt-4"><Link href="/shop">{common("browseSilver")}</Link></Button>
          </div>
        )}
      </div>
    </StorefrontShell>
  );
}
