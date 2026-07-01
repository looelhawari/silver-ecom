"use client";

import { useQuery } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { storeConfig } from "@/config";
import { apiFetch } from "@/lib/api";
import { formatPrice } from "@/lib/format";

type Order = {
  order_code: string;
  status: { label: string };
  payment_status: { label: string };
  subtotal: number;
  shipping_cost: number;
  discount_total: number;
  total: number;
  currency: string;
  customer_name: string;
  placed_at?: string | null;
  payment_method?: { name: string } | null;
  items: { product_name: string; variant_label?: string | null; unit_price: number; quantity: number; line_total: number }[];
  shipping_address?: { full_name: string; phone: string; city: string; area?: string | null; address_line: string } | null;
};

export function InvoiceView() {
  const locale = useLocale();
  const t = useTranslations("orders");
  const checkout = useTranslations("checkout");
  const common = useTranslations("common");
  const params = useSearchParams();
  const code = params.get("code") ?? "";
  const phone = params.get("phone") ?? "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["invoice", code, phone],
    queryFn: () => apiFetch<{ data: Order }>("/orders/track", { method: "POST", body: { order_code: code, phone } }).then((r) => r.data),
    enabled: Boolean(code && phone),
  });

  if (isLoading) return <p className="mx-auto max-w-2xl px-6 py-16 text-center text-[var(--muted-foreground)]">{t("loadingInvoice")}</p>;
  if (isError || !data) return <p className="mx-auto max-w-2xl px-6 py-16 text-center">{t("invoiceNotFound")}</p>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link href={`/track-order?code=${code}&phone=${encodeURIComponent(phone)}`} className="text-sm text-[var(--primary)] hover:underline">&larr; {t("backToOrder")}</Link>
        <Button onClick={() => window.print()}>{t("print")}</Button>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-white p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-serif text-2xl font-semibold">{storeConfig.name}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{storeConfig.contact.email}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{storeConfig.contact.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{t("invoice")}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{data.order_code}</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              {data.placed_at ? new Date(data.placed_at).toLocaleDateString() : ""}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">{t("billedTo")}</p>
            <p>{data.customer_name}</p>
            {data.shipping_address && (
              <p className="text-[var(--muted-foreground)]">
                {data.shipping_address.address_line}, {data.shipping_address.area ? `${data.shipping_address.area}, ` : ""}
                {data.shipping_address.city} · {data.shipping_address.phone}
              </p>
            )}
          </div>
          <div className="text-right">
            <p><span className="text-[var(--muted-foreground)]">{t("paymentStatus")}</span> {data.payment_method?.name ?? "-"} ({data.payment_status.label})</p>
            <p><span className="text-[var(--muted-foreground)]">{t("orderStatus")}</span> {data.status.label}</p>
          </div>
        </div>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[var(--muted-foreground)]">
              <th className="py-2">{t("item")}</th>
              <th className="py-2 text-center">{t("qty")}</th>
              <th className="py-2 text-right">{t("unit")}</th>
              <th className="py-2 text-right">{t("total")}</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((i, idx) => (
              <tr key={idx} className="border-b border-[var(--border)]">
                <td className="py-2">{i.product_name}{i.variant_label ? ` (${i.variant_label})` : ""}</td>
                <td className="py-2 text-center">{i.quantity}</td>
                <td className="py-2 text-right">{formatPrice(i.unit_price, data.currency, locale)}</td>
                <td className="py-2 text-right">{formatPrice(i.line_total, data.currency, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 ml-auto w-64 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">{checkout("subtotal")}</span><span>{formatPrice(data.subtotal, data.currency, locale)}</span></div>
          <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">{checkout("shipping")}</span><span>{formatPrice(data.shipping_cost, data.currency, locale)}</span></div>
          {data.discount_total > 0 && <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">{common("discount")}</span><span>-{formatPrice(data.discount_total, data.currency, locale)}</span></div>}
          <div className="flex justify-between border-t border-[var(--border)] pt-1 text-base font-semibold"><span>{checkout("total")}</span><span>{formatPrice(data.total, data.currency, locale)}</span></div>
        </div>

        <p className="mt-8 text-center text-xs text-[var(--muted-foreground)]">{t("thanksInvoice", { store: storeConfig.name })}</p>
      </div>
    </div>
  );
}
