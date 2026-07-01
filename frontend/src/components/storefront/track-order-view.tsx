"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { apiFetch, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/format";

type Order = {
  order_code: string;
  status: { label: string };
  payment_status: { label: string };
  shipping_status: { label: string };
  total: number;
  currency: string;
  tracking_number?: string | null;
  courier_name?: string | null;
  shipping_note?: string | null;
  items: { product_name: string; quantity: number; line_total: number }[];
  timeline: { status: string; note?: string | null; at: string }[];
};

const field = "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]";

export function TrackOrderView() {
  const params = useSearchParams();
  const [code, setCode] = useState(params.get("code") ?? "");
  const [phone, setPhone] = useState(params.get("phone") ?? "");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const track = async (c: string, p: string) => {
    if (!c || !p) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ data: Order }>("/orders/track", { method: "POST", body: { order_code: c, phone: p } });
      setOrder(res.data);
    } catch (err) {
      setOrder(null);
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.get("code") && params.get("phone")) {
      track(params.get("code")!, params.get("phone")!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold">Track your order</h1>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">Enter your order code and the phone number used at checkout.</p>

      <form className="mt-6 space-y-3" onSubmit={(e) => { e.preventDefault(); track(code, phone); }}>
        <input className={field} placeholder="Order code (e.g. FS-260701-ABCDE)" value={code} onChange={(e) => setCode(e.target.value)} required />
        <input className={field} placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <Button type="submit" disabled={loading}>{loading ? "Checking…" : "Track order"}</Button>
      </form>

      {error && <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      {order && (
        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[["Order", order.status.label], ["Payment", order.payment_status.label], ["Shipping", order.shipping_status.label]].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-[var(--border)] bg-white p-3 text-center">
                <p className="text-xs text-[var(--muted-foreground)]">{k}</p>
                <p className="mt-1 text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>

          {(order.tracking_number || order.shipping_note) && (
            <div className="rounded-xl border border-[var(--border)] bg-white p-4 text-sm">
              {order.courier_name && <p><span className="text-[var(--muted-foreground)]">Courier:</span> {order.courier_name}</p>}
              {order.tracking_number && <p><span className="text-[var(--muted-foreground)]">Tracking #:</span> {order.tracking_number}</p>}
              {order.shipping_note && <p className="mt-1">{order.shipping_note}</p>}
            </div>
          )}

          <div className="rounded-xl border border-[var(--border)] bg-white p-4">
            <h2 className="font-semibold">Items</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">{i.product_name} × {i.quantity}</span>
                  <span>{formatPrice(i.line_total, order.currency)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex justify-between border-t border-[var(--border)] pt-2 font-semibold">
              <span>Total</span><span>{formatPrice(order.total, order.currency)}</span>
            </div>
          </div>

          {order.timeline.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-white p-4">
              <h2 className="font-semibold">Timeline</h2>
              <ol className="mt-3 space-y-3">
                {order.timeline.map((t, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span>
                      <span className="font-medium capitalize">{t.status.replace(/_/g, " ")}</span>
                      {t.note && <span className="block text-[var(--muted-foreground)]">{t.note}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
