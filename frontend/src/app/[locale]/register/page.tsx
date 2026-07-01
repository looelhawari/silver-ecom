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

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const footer = useTranslations("footer");
  const register = useAuthStore((s) => s.register);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await register({
        name: String(fd.get("name")),
        email: String(fd.get("email")),
        phone: String(fd.get("phone") || ""),
        password: String(fd.get("password")),
        password_confirmation: String(fd.get("password_confirmation")),
      });
      toast.success(t("accountCreated"));
      router.push("/account");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t("registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <StorefrontShell>
      <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold">{t("createAccountTitle")}</h1>
        <form className="mt-6 space-y-3" onSubmit={submit}>
          <input className={field} name="name" placeholder={t("fullName")} required />
          <input className={field} name="email" type="email" placeholder={t("email")} required />
          <input className={field} name="phone" placeholder={t("phoneOptional")} />
          <input className={field} name="password" type="password" placeholder={t("passwordMin")} required minLength={8} />
          <input className={field} name="password_confirmation" type="password" placeholder={t("confirmPassword")} required minLength={8} />
          <label className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <input type="checkbox" required /> {t("agreeTerms")}{" "}
            <Link href="/terms" className="text-[var(--primary)] hover:underline">{footer("terms")}</Link>
          </label>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? t("creating") : t("createAccount")}</Button>
        </form>
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
          {t("alreadyHaveAccount")} <Link href="/login" className="text-[var(--primary)] hover:underline">{t("signIn")}</Link>
        </p>
      </div>
    </StorefrontShell>
  );
}
