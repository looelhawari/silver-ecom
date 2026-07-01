"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { Button } from "@/components/ui/button";
import { apiFetch, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/stores/useCartStore";

type PaymentMethod = { id: number; code: string; name: string; instructions?: string | null; requires_proof: boolean };
type Totals = { subtotal: number; shipping_cost: number; total: number; currency: string };

const field = "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);
  const [form, setForm] = useState({
    customer_name: "", customer_phone: "", customer_whatsapp: "", customer_email: "",
    city: "", area: "", address_line: "", building: "", floor: "", apartment: "", notes: "",
  });

  const cartPayload = items.map((i) => ({ product_id: i.productId, variant_id: i.variantId ?? null, quantity: i.quantity }));

  const { data: methods } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => apiFetch<{ data: PaymentMethod[] }>("/payment-methods").then((r) => r.data),
  });

  const { data: totals } = useQuery({
    queryKey: ["checkout-totals", cartPayload],
    queryFn: () => apiFetch<{ data: Totals }>("/checkout/validate", { method: "POST", body: { items: cartPayload } }).then((r) => r.data),
    enabled: items.length > 0,
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const placeOrder = async () => {
    if (!paymentMethodId) return toast.error("Please choose a payment method.");
    setSubmitting(true);
    try {
      const res = await apiFetch<{ data: { order_code: string } }>("/checkout/place-order", {
        method: "POST",
        body: {
          items: cartPayload,
          customer_name: form.customer_name,
          customer_phone: form.customer_phone,
          customer_whatsapp: form.customer_whatsapp || null,
          customer_email: form.customer_email || null,
          payment_method_id: paymentMethodId,
          notes: form.notes || null,
          shipping_address: {
            full_name: form.customer_name,
            phone: form.customer_phone,
            whatsapp: form.customer_whatsapp || null,
            city: form.city,
            area: form.area || null,
            address_line: form.address_line,
            building: form.building || null,
            floor: form.floor || null,
            apartment: form.apartment || null,
            notes: null,
          },
        },
      });
      clear();
      router.push(`/order/success?code=${res.data.order_code}&phone=${encodeURIComponent(form.customer_phone)}`);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <StorefrontShell>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="font-serif text-2xl font-semibold">Your cart is empty</h1>
          <Button asChild className="mt-6"><Link href="/shop">Shop silver</Link></Button>
        </div>
      </StorefrontShell>
    );
  }

  const selectedMethod = methods?.find((m) => m.id === paymentMethodId);

  return (
    <StorefrontShell>
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); placeOrder(); }}>
          <h1 className="font-serif text-3xl font-semibold">Checkout</h1>

          <fieldset className="space-y-3 rounded-xl border border-[var(--border)] bg-white p-5">
            <legend className="px-1 font-semibold">Contact</legend>
            <input className={field} placeholder="Full name *" required value={form.customer_name} onChange={set("customer_name")} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={field} placeholder="Phone *" required value={form.customer_phone} onChange={set("customer_phone")} />
              <input className={field} placeholder="WhatsApp (optional)" value={form.customer_whatsapp} onChange={set("customer_whatsapp")} />
            </div>
            <input className={field} type="email" placeholder="Email (optional)" value={form.customer_email} onChange={set("customer_email")} />
          </fieldset>

          <fieldset className="space-y-3 rounded-xl border border-[var(--border)] bg-white p-5">
            <legend className="px-1 font-semibold">Shipping address</legend>
            <input className={field} placeholder="Street address *" required value={form.address_line} onChange={set("address_line")} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={field} placeholder="City *" required value={form.city} onChange={set("city")} />
              <input className={field} placeholder="Area / district" value={form.area} onChange={set("area")} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <input className={field} placeholder="Building" value={form.building} onChange={set("building")} />
              <input className={field} placeholder="Floor" value={form.floor} onChange={set("floor")} />
              <input className={field} placeholder="Apartment" value={form.apartment} onChange={set("apartment")} />
            </div>
            <textarea className={field} rows={2} placeholder="Order notes (optional)" value={form.notes} onChange={set("notes")} />
          </fieldset>

          <fieldset className="space-y-2 rounded-xl border border-[var(--border)] bg-white p-5">
            <legend className="px-1 font-semibold">Payment method</legend>
            {methods?.map((m) => (
              <label key={m.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${paymentMethodId === m.id ? "border-[var(--foreground)]" : "border-[var(--border)]"}`}>
                <input type="radio" name="pm" className="mt-1" checked={paymentMethodId === m.id} onChange={() => setPaymentMethodId(m.id)} />
                <span>
                  <span className="font-medium">{m.name}</span>
                  {m.instructions && <span className="mt-0.5 block text-xs text-[var(--muted-foreground)]">{m.instructions}</span>}
                </span>
              </label>
            ))}
            {selectedMethod?.requires_proof && (
              <p className="text-xs text-[var(--accent)]">You'll receive payment details and can upload your proof after ordering.</p>
            )}
          </fieldset>
        </form>

        <aside className="h-fit rounded-xl border border-[var(--border)] bg-white p-6">
          <h2 className="font-semibold">Order summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((i) => (
              <li key={`${i.productId}-${i.variantId ?? "x"}`} className="flex justify-between gap-2">
                <span className="text-[var(--muted-foreground)]">{i.name} × {i.quantity}</span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-[var(--border)] pt-4 text-sm">
            <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">Subtotal</span><span>{totals ? formatPrice(totals.subtotal, totals.currency) : "…"}</span></div>
            <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">Shipping</span><span>{totals ? formatPrice(totals.shipping_cost, totals.currency) : "…"}</span></div>
            <div className="flex justify-between pt-1 text-base font-semibold"><span>Total</span><span>{totals ? formatPrice(totals.total, totals.currency) : "…"}</span></div>
          </div>
          <Button className="mt-5 w-full" size="lg" disabled={submitting} onClick={placeOrder}>
            {submitting ? "Placing order…" : "Place order"}
          </Button>
          <p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">Totals are confirmed server-side.</p>
        </aside>
      </div>
    </StorefrontShell>
  );
}
