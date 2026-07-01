"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";

const field = "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const common = useTranslations("common");
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await login(String(fd.get("email")), String(fd.get("password")));
      toast.success(t("welcomeBack"));
      router.push("/account");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <StorefrontShell>
      <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold">{t("signIn")}</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{t("signInCopy")}</p>
        <form className="mt-6 space-y-3" onSubmit={submit}>
          <input className={field} name="email" type="email" placeholder={t("email")} required />
          <input className={field} name="password" type="password" placeholder={t("password")} required />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? t("signingIn") : t("signIn")}</Button>
        </form>
        <p className="mt-3 text-sm">
          <Link href="/forgot-password" className="text-[var(--primary)] hover:underline">{t("forgotPassword")}</Link>
        </p>
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
          {t("newHere")} <Link href="/register" className="text-[var(--primary)] hover:underline">{t("createAccount")}</Link>
        </p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {common("or")} <Link href="/track-order" className="text-[var(--primary)] hover:underline">{t("trackGuest")}</Link>.
        </p>
      </div>
    </StorefrontShell>
  );
}
