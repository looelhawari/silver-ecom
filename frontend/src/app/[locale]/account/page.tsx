"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";

const field = "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]";

type Address = {
  id: number; label?: string | null; full_name: string; phone: string;
  city: string; area?: string | null; address_line: string; is_default: boolean;
};

export default function AccountPage() {
  const router = useRouter();
  const t = useTranslations("account");
  const common = useTranslations("common");
  const checkout = useTranslations("checkout");
  const auth = useTranslations("auth");
  const qc = useQueryClient();
  const { user, hydrated, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  const { data: addresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => apiFetch<{ data: Address[] }>("/addresses").then((r) => r.data),
    enabled: Boolean(user),
  });

  const updateProfile = useMutation({
    mutationFn: (body: Record<string, string>) => apiFetch<{ data: typeof user }>("/profile", { method: "PATCH", body }),
    onSuccess: (res) => { setUser(res.data!); toast.success(t("profileUpdated")); },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t("updateFailed")),
  });

  const changePassword = useMutation({
    mutationFn: (body: Record<string, string>) => apiFetch("/profile/password", { method: "PATCH", body }),
    onSuccess: () => toast.success(t("passwordChanged")),
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t("passwordFailed")),
  });

  const addAddress = useMutation({
    mutationFn: (body: Record<string, string>) => apiFetch("/addresses", { method: "POST", body }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["addresses"] }); toast.success(t("addressAdded")); },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : t("addressAddFailed")),
  });

  const removeAddress = useMutation({
    mutationFn: (id: number) => apiFetch(`/addresses/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["addresses"] }); toast.success(t("addressRemoved")); },
  });

  const [showAddr, setShowAddr] = useState(false);

  if (!user) {
    return <StorefrontShell><div className="mx-auto max-w-md px-4 py-16 text-center text-[var(--muted-foreground)]">{common("loading")}</div></StorefrontShell>;
  }

  return (
    <StorefrontShell>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl font-semibold">{t("title")}</h1>
          <Button variant="outline" onClick={() => logout().then(() => router.push("/"))}>{t("logout")}</Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/account/orders" className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 hover:border-[var(--primary)]">{t("orders")}</Link>
          <Link href="/account/requests" className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 hover:border-[var(--primary)]">{t("customRequests")}</Link>
          <Link href="/wishlist" className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 hover:border-[var(--primary)]">{t("wishlist")}</Link>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Profile */}
          <form
            className="space-y-3 rounded-xl border border-[var(--border)] bg-white p-6"
            onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); updateProfile.mutate(Object.fromEntries(fd) as Record<string, string>); }}
          >
            <h2 className="font-semibold">{t("profile")}</h2>
            <input className={field} name="name" defaultValue={user.name} placeholder={t("name")} required />
            <input className={field} name="email" type="email" defaultValue={user.email} placeholder={common("email")} required />
            <input className={field} name="phone" defaultValue={user.phone ?? ""} placeholder={t("phone")} />
            <input className={field} name="whatsapp" defaultValue={user.whatsapp ?? ""} placeholder={t("whatsapp")} />
            <Button type="submit" disabled={updateProfile.isPending}>{t("saveProfile")}</Button>
          </form>

          {/* Password */}
          <form
            className="space-y-3 rounded-xl border border-[var(--border)] bg-white p-6"
            onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); changePassword.mutate(Object.fromEntries(fd) as Record<string, string>); (e.currentTarget as HTMLFormElement).reset(); }}
          >
            <h2 className="font-semibold">{t("changePassword")}</h2>
            <input className={field} name="current_password" type="password" placeholder={t("currentPassword")} required />
            <input className={field} name="password" type="password" placeholder={auth("newPassword")} required minLength={8} />
            <input className={field} name="password_confirmation" type="password" placeholder={t("confirmNewPassword")} required minLength={8} />
            <Button type="submit" disabled={changePassword.isPending}>{t("updatePassword")}</Button>
          </form>
        </div>

        {/* Addresses */}
        <div className="mt-8 rounded-xl border border-[var(--border)] bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{t("addresses")}</h2>
            <Button variant="outline" size="sm" onClick={() => setShowAddr((s) => !s)}>{showAddr ? t("cancel") : t("addAddress")}</Button>
          </div>

          {showAddr && (
            <form
              className="mt-4 grid gap-3 sm:grid-cols-2"
              onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); addAddress.mutate(Object.fromEntries(fd) as Record<string, string>); (e.currentTarget as HTMLFormElement).reset(); setShowAddr(false); }}
            >
              <input className={field} name="full_name" placeholder={checkout("fullName")} required defaultValue={user.name} />
              <input className={field} name="phone" placeholder={checkout("phone")} required defaultValue={user.phone ?? ""} />
              <input className={field} name="city" placeholder={checkout("city")} required />
              <input className={field} name="area" placeholder={checkout("area")} />
              <input className={`${field} sm:col-span-2`} name="address_line" placeholder={checkout("streetAddress")} required />
              <Button type="submit" className="sm:col-span-2" disabled={addAddress.isPending}>{t("saveAddress")}</Button>
            </form>
          )}

          <ul className="mt-4 space-y-2">
            {addresses?.length === 0 && <li className="text-sm text-[var(--muted-foreground)]">{t("noAddresses")}</li>}
            {addresses?.map((a) => (
              <li key={a.id} className="flex items-start justify-between rounded-lg border border-[var(--border)] p-3 text-sm">
                <span>
                  <span className="font-medium">{a.full_name}</span> · {a.phone}
                  <span className="block text-[var(--muted-foreground)]">{a.address_line}, {a.area ? `${a.area}, ` : ""}{a.city}</span>
                </span>
                <button onClick={() => removeAddress.mutate(a.id)} className="text-[var(--muted-foreground)] hover:text-red-600" aria-label={common("remove")}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StorefrontShell>
  );
}
