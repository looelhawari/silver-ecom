"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { Button } from "@/components/ui/button";
import { apiFetch, ApiError } from "@/lib/api";

const field = "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const common = useTranslations("common");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await apiFetch("/auth/forgot-password", { method: "POST", body: { email: fd.get("email") } });
      setSent(true);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : common("somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <StorefrontShell>
      <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold">{t("resetPassword")}</h1>
        {sent ? (
          <p className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            {t("resetSent")}
          </p>
        ) : (
          <form className="mt-6 space-y-3" onSubmit={submit}>
            <p className="text-sm text-[var(--muted-foreground)]">{t("resetCopy")}</p>
            <input className={field} name="email" type="email" placeholder={t("email")} required />
            <Button type="submit" className="w-full" disabled={loading}>{loading ? t("sending") : t("sendReset")}</Button>
          </form>
        )}
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
          <Link href="/login" className="text-[var(--primary)] hover:underline">{t("backToSignIn")}</Link>
        </p>
      </div>
    </StorefrontShell>
  );
}
