"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
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
  const params = useSearchParams();
  const code = params.get("code") ?? "";
  const phone = params.get("phone") ?? "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["invoice", code, phone],
    queryFn: () => apiFetch<{ data: Order }>("/orders/track", { method: "POST", body: { order_code: code, phone } }).then((r) => r.data),
    enabled: Boolean(code && phone),
  });

  if (isLoading) return <p className="mx-auto max-w-2xl px-6 py-16 text-center text-[var(--muted-foreground)]">Loading invoice…</p>;
  if (isError || !data) return <p className="mx-auto max-w-2xl px-6 py-16 text-center">Invoice not found. Check your code and phone.</p>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link href={`/track-order?code=${code}&phone=${encodeURIComponent(phone)}`} className="text-sm text-[var(--primary)] hover:underline">← Back to order</Link>
        <Button onClick={() => window.print()}>Print / Save PDF</Button>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-white p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-serif text-2xl font-semibold">{storeConfig.name}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{storeConfig.contact.email}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{storeConfig.contact.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">Invoice</p>
            <p className="text-sm text-[var(--muted-foreground)]">{data.order_code}</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              {data.placed_at ? new Date(data.placed_at).toLocaleDateString() : ""}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Billed to</p>
            <p>{data.customer_name}</p>
            {data.shipping_address && (
              <p className="text-[var(--muted-foreground)]">
                {data.shipping_address.address_line}, {data.shipping_address.area ? `${data.shipping_address.area}, ` : ""}
                {data.shipping_address.city} · {data.shipping_address.phone}
              </p>
            )}
          </div>
          <div className="text-right">
            <p><span className="text-[var(--muted-foreground)]">Payment:</span> {data.payment_method?.name ?? "—"} ({data.payment_status.label})</p>
            <p><span className="text-[var(--muted-foreground)]">Order status:</span> {data.status.label}</p>
          </div>
        </div>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[var(--muted-foreground)]">
              <th className="py-2">Item</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Unit</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((i, idx) => (
              <tr key={idx} className="border-b border-[var(--border)]">
                <td className="py-2">{i.product_name}{i.variant_label ? ` (${i.variant_label})` : ""}</td>
                <td className="py-2 text-center">{i.quantity}</td>
                <td className="py-2 text-right">{formatPrice(i.unit_price, data.currency)}</td>
                <td className="py-2 text-right">{formatPrice(i.line_total, data.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 ml-auto w-64 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">Subtotal</span><span>{formatPrice(data.subtotal, data.currency)}</span></div>
          <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">Shipping</span><span>{formatPrice(data.shipping_cost, data.currency)}</span></div>
          {data.discount_total > 0 && <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">Discount</span><span>-{formatPrice(data.discount_total, data.currency)}</span></div>}
          <div className="flex justify-between border-t border-[var(--border)] pt-1 text-base font-semibold"><span>Total</span><span>{formatPrice(data.total, data.currency)}</span></div>
        </div>

        <p className="mt-8 text-center text-xs text-[var(--muted-foreground)]">Thank you for shopping with {storeConfig.name}.</p>
      </div>
    </div>
  );
}
