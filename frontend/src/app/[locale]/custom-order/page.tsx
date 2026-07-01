"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { API_BASE_URL, apiFetch } from "@/lib/api";
import { localizedField } from "@/lib/locale";

type SilverType = { id: number; name: string; name_en?: string | null; name_ar?: string | null };

const field = "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]";

export default function CustomOrderPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations("customOrder");
  const homeCustom = useTranslations("homepage.customOrder");
  const common = useTranslations("common");
  const [submitting, setSubmitting] = useState(false);
  const [requestCode, setRequestCode] = useState<string | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);

  const { data: silverTypes } = useQuery({
    queryKey: ["silver-types", locale],
    queryFn: () => apiFetch<{ data: SilverType[] }>("/silver-types").then((r) => r.data),
  });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    // Attach images explicitly as images[].
    if (files) {
      Array.from(files).slice(0, 5).forEach((f) => fd.append("images[]", f));
    }
    try {
      const res = await fetch(`${API_BASE_URL}/custom-requests`, {
        method: "POST",
        headers: { Accept: "application/json", "Accept-Language": locale },
        credentials: "include",
        body: fd,
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.message ?? t("requestError"));
      }
      setRequestCode(payload.data.request_code);
      formEl.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : common("somethingWentWrong"));
    } finally {
      setSubmitting(false);
    }
  };

  if (requestCode) {
    return (
      <StorefrontShell>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
          <h1 className="mt-4 font-serif text-3xl font-semibold">{t("successTitle")}</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            <span className="font-semibold text-[var(--foreground)]">{requestCode}</span>
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild><Link href={`/track-custom?code=${requestCode}`}>{t("trackRequest")}</Link></Button>
            <Button asChild variant="secondary"><Link href="/shop">{common("browseSilver")}</Link></Button>
          </div>
        </div>
      </StorefrontShell>
    );
  }

  return (
    <StorefrontShell>
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold">{t("title")}</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {homeCustom("description")}
        </p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={field} name="name" placeholder={t("name")} required />
            <input className={field} name="phone" placeholder={t("phone")} required />
            <input className={field} name="whatsapp" placeholder={t("whatsapp")} />
            <input className={field} name="email" type="email" placeholder={t("email")} />
          </div>

          <textarea className={field} name="description" rows={4} placeholder={t("description")} required />

          <div className="grid gap-3 sm:grid-cols-3">
            <select className={field} name="silver_type_id" defaultValue="">
              <option value="">{t("silverType")}</option>
              {silverTypes?.map((s) => <option key={s.id} value={s.id}>{localizedField(s, "name", locale)}</option>)}
            </select>
            <input className={field} name="expected_weight_grams" type="number" step="0.1" min="0" placeholder={t("weight")} />
            <input className={field} name="size" placeholder={t("size")} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input className={field} name="budget_min" type="number" min="0" placeholder={t("budgetFrom")} />
            <input className={field} name="budget_max" type="number" min="0" placeholder={t("budgetTo")} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">{t("referenceImages")}</label>
            <input
              className={field}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
          </div>

          <textarea className={field} name="notes" rows={2} placeholder={t("notes")} />

          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? t("submitting") : t("submit")}
          </Button>
        </form>
      </div>
    </StorefrontShell>
  );
}
