"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { apiFetch, ApiError } from "@/lib/api";

const field = "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]";

export function ResetPasswordView() {
  const router = useRouter();
  const t = useTranslations("auth");
  const common = useTranslations("common");
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: {
          token,
          email,
          password: fd.get("password"),
          password_confirmation: fd.get("password_confirmation"),
        },
      });
      toast.success(t("passwordReset"));
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("resetFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="font-medium">{t("invalidReset")}</p>
        <Link href="/forgot-password" className="mt-3 inline-block text-sm text-[var(--primary)] hover:underline">
          {t("requestNewLink")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold">{t("chooseNewPassword")}</h1>
      <form className="mt-6 space-y-3" onSubmit={submit}>
        <input className={field} value={email} disabled />
        <input className={field} name="password" type="password" placeholder={t("newPassword")} required minLength={8} />
        <input className={field} name="password_confirmation" type="password" placeholder={t("confirmPassword")} required minLength={8} />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? common("saving") : t("resetPassword")}</Button>
      </form>
    </div>
  );
}
