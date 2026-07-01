"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";
import { getToken } from "@/lib/auth-token";

const field = "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]";

export function PaymentProofUpload({
  code,
  phone,
  onUploaded,
}: {
  code: string;
  phone: string;
  onUploaded?: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations("checkout");
  const [file, setFile] = useState<File | null>(null);
  const [phoneInput, setPhoneInput] = useState(phone);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error(t("chooseFile"));
    setUploading(true);
    const fd = new FormData();
    fd.append("phone", phoneInput);
    fd.append("file", file);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/orders/${code}/payment-proof`, {
        method: "POST",
        headers: { Accept: "application/json", "Accept-Language": locale, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
        body: fd,
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message ?? t("uploadFailed"));
      setDone(true);
      toast.success(t("proofUploaded"));
      onUploaded?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("uploadFailed"));
    } finally {
      setUploading(false);
    }
  };

  if (done) {
    return <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{t("proofReceived")}</p>;
  }

  return (
    <form className="space-y-3 rounded-xl border border-[var(--accent)]/40 bg-[var(--surface)] p-5" onSubmit={upload}>
      <h3 className="font-semibold">{t("uploadProof")}</h3>
      <p className="text-sm text-[var(--muted-foreground)]">{t("proofCopy")}</p>
      {!phone && (
        <input className={field} placeholder={t("phoneUsed")} value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} required />
      )}
      <input className={field} type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <Button type="submit" disabled={uploading}>{uploading ? t("uploading") : t("proofButton")}</Button>
    </form>
  );
}
