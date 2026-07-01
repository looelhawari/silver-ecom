"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { PaymentProofUpload } from "@/components/storefront/payment-proof-upload";
import { Button } from "@/components/ui/button";
import { storeConfig } from "@/config";
import { apiFetch } from "@/lib/api";
import { formatPrice } from "@/lib/format";

type Order = {
  order_code: string;
  total: number;
  currency: string;
  payment_status: { label: string };
  payment_method?: {
    name: string;
    instructions?: string | null;
    account_details?: string | null;
    requires_proof?: boolean;
  } | null;
  has_payment_proof?: boolean;
  items: { product_name: string; quantity: number; line_total: number }[];
};

export function OrderSuccessView() {
  const locale = useLocale();
  const t = useTranslations("orders");
  const params = useSearchParams();
  const code = params.get("code") ?? "";
  const phone = params.get("phone") ?? "";

  const { data, isLoading } = useQuery({
    queryKey: ["order", code, phone],
    queryFn: () => apiFetch<{ data: Order }>("/orders/track", { method: "POST", body: { order_code: code, phone } }).then((r) => r.data),
    enabled: Boolean(code && phone),
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6">
      <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
      <h1 className="mt-4 font-serif text-3xl font-semibold">{t("successTitle")}</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        {t.rich("successCopy", { code: () => <span className="font-semibold text-[var(--foreground)]">{code}</span> })}
      </p>

      {isLoading && <p className="mt-8 text-sm text-[var(--muted-foreground)]">{t("loadingOrder")}</p>}

      {data && (
        <div className="mt-8 space-y-4 text-left">
          <div className="rounded-xl border border-[var(--border)] bg-white p-5">
            <h2 className="font-semibold">{t("summary")}</h2>
            <ul className="mt-3 space-y-1 text-sm">
              {data.items.map((i, idx) => (
                <li key={idx} className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">{i.product_name} × {i.quantity}</span>
                  <span>{formatPrice(i.line_total, data.currency, locale)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-[var(--border)] pt-3 font-semibold">
              <span>{t("total")}</span><span>{formatPrice(data.total, data.currency, locale)}</span>
            </div>
          </div>

          {data.payment_method && (data.payment_method.instructions || data.payment_method.account_details) && (
            <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--surface)] p-5">
              <h2 className="font-semibold">{t("payment")} - {data.payment_method.name}</h2>
              {data.payment_method.instructions && (
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{data.payment_method.instructions}</p>
              )}
              {data.payment_method.account_details && (
                <p className="mt-2 text-sm font-medium">{data.payment_method.account_details}</p>
              )}
            </div>
          )}

          {data.payment_method?.requires_proof && !data.has_payment_proof && (
            <PaymentProofUpload code={code} phone={phone} />
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild><Link href={`/track-order?code=${code}&phone=${encodeURIComponent(phone)}`}>{t("trackMyOrder")}</Link></Button>
        <Button asChild variant="secondary">
          <a href={`https://wa.me/${storeConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">
            {t("contactSupport")}
          </a>
        </Button>
      </div>
    </div>
  );
}
