"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { apiFetch, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/format";

type CustomRequest = {
  request_code: string;
  name: string;
  description: string;
  status: { label: string };
  silver_type?: string | null;
  expected_weight_grams?: number | null;
  size?: string | null;
  customer_message?: string | null;
  quote?: { final_quote: number; message?: string | null; status: string } | null;
  created_at: string;
};

const field = "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]";

export function CustomTrackView() {
  const locale = useLocale();
  const t = useTranslations("customOrder");
  const orders = useTranslations("orders");
  const common = useTranslations("common");
  const params = useSearchParams();
  const [code, setCode] = useState(params.get("code") ?? "");
  const [phone, setPhone] = useState("");
  const [request, setRequest] = useState<CustomRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const track = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ data: CustomRequest }>("/custom-requests/track", {
        method: "POST",
        body: { request_code: code, phone },
      });
      setRequest(res.data);
    } catch (err) {
      setRequest(null);
      setError(err instanceof ApiError ? err.message : common("somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  const respondToQuote = async (decision: "accept" | "reject") => {
    try {
      const res = await apiFetch<{ data: CustomRequest }>(`/custom-requests/${code}/${decision}-quote`, {
        method: "POST",
        body: { phone },
      });
      setRequest(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : common("somethingWentWrong"));
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold">{t("trackTitle")}</h1>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{t("trackCopy")}</p>

      <form className="mt-6 space-y-3" onSubmit={track}>
        <input className={field} placeholder="CR-260701-ABCDE" value={code} onChange={(e) => setCode(e.target.value)} required />
        <input className={field} placeholder={orders("phonePlaceholder")} value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <Button type="submit" disabled={loading}>{loading ? orders("checking") : t("trackRequest")}</Button>
      </form>

      {error && <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      {request && (
        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-[var(--border)] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{request.request_code}</h2>
              <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-medium">{request.status.label}</span>
            </div>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">{request.description}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--muted-foreground)]">
              {request.silver_type && <span>{t("silverType")}: {request.silver_type}</span>}
              {request.expected_weight_grams ? <span>{t("weight")}: {request.expected_weight_grams} {common("grams")}</span> : null}
              {request.size && <span>{t("size")}: {request.size}</span>}
            </div>
          </div>

          {request.customer_message && (
            <div className="rounded-xl border border-[var(--border)] bg-white p-5">
              <h3 className="font-semibold">{t("messageFromUs")}</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">{request.customer_message}</p>
            </div>
          )}

          {request.quote && (
            <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--surface)] p-5">
              <h3 className="font-semibold">{t("quote")}</h3>
              <p className="mt-2 font-serif text-2xl font-semibold">{formatPrice(request.quote.final_quote, "EGP", locale)}</p>
              {request.quote.message && <p className="mt-2 text-sm text-[var(--muted-foreground)]">{request.quote.message}</p>}
              {request.quote.status === "sent" ? (
                <div className="mt-4 flex gap-3">
                  <Button onClick={() => respondToQuote("accept")}>{t("acceptQuote")}</Button>
                  <Button variant="outline" onClick={() => respondToQuote("reject")}>{t("decline")}</Button>
                </div>
              ) : (
                <p className="mt-2 text-xs font-medium capitalize text-[var(--muted-foreground)]">
                  {request.quote.status}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
