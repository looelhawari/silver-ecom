"use client";

import { useQuery } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { useRouter } from "@/i18n/navigation";
import { apiFetch } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useAuthStore } from "@/stores/useAuthStore";

type Order = {
  order_code: string;
  status: { label: string };
  payment_status: { label: string };
  total: number;
  currency: string;
  placed_at?: string | null;
};

export default function AccountOrdersPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("account");
  const common = useTranslations("common");
  const { user, hydrated } = useAuthStore();
  useEffect(() => { if (hydrated && !user) router.replace("/login"); }, [hydrated, user, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => apiFetch<{ data: Order[] }>("/profile/orders").then((r) => r.data),
    enabled: Boolean(user),
  });

  return (
    <StorefrontShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/account" className="text-sm text-[var(--primary)] hover:underline">&larr; {t("title")}</Link>
        <h1 className="mt-2 font-serif text-3xl font-semibold">{t("orders")}</h1>

        {isLoading && <p className="mt-6 text-sm text-[var(--muted-foreground)]">{common("loading")}</p>}
        {data?.length === 0 && <p className="mt-6 text-sm text-[var(--muted-foreground)]">{t("noOrders")}</p>}

        <ul className="mt-6 space-y-3">
          {data?.map((o) => (
            <li key={o.order_code} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white p-4">
              <div>
                <p className="font-medium">{o.order_code}</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {o.placed_at ? new Date(o.placed_at).toLocaleDateString() : ""} · {o.status.label} · {o.payment_status.label}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(o.total, o.currency, locale)}</p>
                <Link href={`/track-order?code=${o.order_code}`} className="text-xs text-[var(--primary)] hover:underline">
                  {common("view")}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </StorefrontShell>
  );
}
