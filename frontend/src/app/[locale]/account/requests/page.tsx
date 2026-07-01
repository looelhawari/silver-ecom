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

type CustomRequest = {
  request_code: string;
  description: string;
  status: { label: string };
  quote?: { final_quote: number } | null;
  created_at: string;
};

export default function AccountRequestsPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("account");
  const custom = useTranslations("customOrder");
  const common = useTranslations("common");
  const { user, hydrated } = useAuthStore();
  useEffect(() => { if (hydrated && !user) router.replace("/login"); }, [hydrated, user, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["my-requests"],
    queryFn: () => apiFetch<{ data: CustomRequest[] }>("/profile/custom-requests").then((r) => r.data),
    enabled: Boolean(user),
  });

  return (
    <StorefrontShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/account" className="text-sm text-[var(--primary)] hover:underline">&larr; {t("title")}</Link>
        <h1 className="mt-2 font-serif text-3xl font-semibold">{t("customRequests")}</h1>

        {isLoading && <p className="mt-6 text-sm text-[var(--muted-foreground)]">{common("loading")}</p>}
        {data?.length === 0 && (
          <p className="mt-6 text-sm text-[var(--muted-foreground)]">
            {t("noRequests")} <Link href="/custom-order" className="text-[var(--primary)] hover:underline">{t("startOne")}</Link>.
          </p>
        )}

        <ul className="mt-6 space-y-3">
          {data?.map((r) => (
            <li key={r.request_code} className="rounded-xl border border-[var(--border)] bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{r.request_code}</p>
                <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs">{r.status.label}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">{r.description}</p>
              <div className="mt-2 flex items-center justify-between text-sm">
                {r.quote ? <span className="font-medium">{t("quote", { amount: formatPrice(r.quote.final_quote, "EGP", locale) })}</span> : <span className="text-[var(--muted-foreground)]">{custom("awaitingReview")}</span>}
                <Link href={`/track-custom?code=${r.request_code}`} className="text-xs text-[var(--primary)] hover:underline">{common("view")}</Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </StorefrontShell>
  );
}
