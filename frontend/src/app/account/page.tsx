"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { Button } from "@/components/ui/button";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";

const field = "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]";

type Address = {
  id: number; label?: string | null; full_name: string; phone: string;
  city: string; area?: string | null; address_line: string; is_default: boolean;
};

export default function AccountPage() {
  const router = useRouter();
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
    onSuccess: (res) => { setUser(res.data!); toast.success("Profile updated."); },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : "Update failed."),
  });

  const changePassword = useMutation({
    mutationFn: (body: Record<string, string>) => apiFetch("/profile/password", { method: "PATCH", body }),
    onSuccess: () => toast.success("Password changed."),
    onError: (e) => toast.error(e instanceof ApiError ? e.message : "Could not change password."),
  });

  const addAddress = useMutation({
    mutationFn: (body: Record<string, string>) => apiFetch("/addresses", { method: "POST", body }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["addresses"] }); toast.success("Address added."); },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : "Could not add address."),
  });

  const removeAddress = useMutation({
    mutationFn: (id: number) => apiFetch(`/addresses/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["addresses"] }); toast.success("Address removed."); },
  });

  const [showAddr, setShowAddr] = useState(false);

  if (!user) {
    return <StorefrontShell><div className="mx-auto max-w-md px-4 py-16 text-center text-[var(--muted-foreground)]">Loading…</div></StorefrontShell>;
  }

  return (
    <StorefrontShell>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl font-semibold">My account</h1>
          <Button variant="outline" onClick={() => logout().then(() => router.push("/"))}>Log out</Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/account/orders" className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 hover:border-[var(--primary)]">My orders</Link>
          <Link href="/account/requests" className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 hover:border-[var(--primary)]">Custom requests</Link>
          <Link href="/wishlist" className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 hover:border-[var(--primary)]">Wishlist</Link>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Profile */}
          <form
            className="space-y-3 rounded-xl border border-[var(--border)] bg-white p-6"
            onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); updateProfile.mutate(Object.fromEntries(fd) as Record<string, string>); }}
          >
            <h2 className="font-semibold">Profile</h2>
            <input className={field} name="name" defaultValue={user.name} placeholder="Name" required />
            <input className={field} name="email" type="email" defaultValue={user.email} placeholder="Email" required />
            <input className={field} name="phone" defaultValue={user.phone ?? ""} placeholder="Phone" />
            <input className={field} name="whatsapp" defaultValue={user.whatsapp ?? ""} placeholder="WhatsApp" />
            <Button type="submit" disabled={updateProfile.isPending}>Save profile</Button>
          </form>

          {/* Password */}
          <form
            className="space-y-3 rounded-xl border border-[var(--border)] bg-white p-6"
            onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); changePassword.mutate(Object.fromEntries(fd) as Record<string, string>); (e.currentTarget as HTMLFormElement).reset(); }}
          >
            <h2 className="font-semibold">Change password</h2>
            <input className={field} name="current_password" type="password" placeholder="Current password" required />
            <input className={field} name="password" type="password" placeholder="New password" required minLength={8} />
            <input className={field} name="password_confirmation" type="password" placeholder="Confirm new password" required minLength={8} />
            <Button type="submit" disabled={changePassword.isPending}>Update password</Button>
          </form>
        </div>

        {/* Addresses */}
        <div className="mt-8 rounded-xl border border-[var(--border)] bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Addresses</h2>
            <Button variant="outline" size="sm" onClick={() => setShowAddr((s) => !s)}>{showAddr ? "Cancel" : "Add address"}</Button>
          </div>

          {showAddr && (
            <form
              className="mt-4 grid gap-3 sm:grid-cols-2"
              onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); addAddress.mutate(Object.fromEntries(fd) as Record<string, string>); (e.currentTarget as HTMLFormElement).reset(); setShowAddr(false); }}
            >
              <input className={field} name="full_name" placeholder="Full name *" required defaultValue={user.name} />
              <input className={field} name="phone" placeholder="Phone *" required defaultValue={user.phone ?? ""} />
              <input className={field} name="city" placeholder="City *" required />
              <input className={field} name="area" placeholder="Area" />
              <input className={`${field} sm:col-span-2`} name="address_line" placeholder="Street address *" required />
              <Button type="submit" className="sm:col-span-2" disabled={addAddress.isPending}>Save address</Button>
            </form>
          )}

          <ul className="mt-4 space-y-2">
            {addresses?.length === 0 && <li className="text-sm text-[var(--muted-foreground)]">No saved addresses.</li>}
            {addresses?.map((a) => (
              <li key={a.id} className="flex items-start justify-between rounded-lg border border-[var(--border)] p-3 text-sm">
                <span>
                  <span className="font-medium">{a.full_name}</span> · {a.phone}
                  <span className="block text-[var(--muted-foreground)]">{a.address_line}, {a.area ? `${a.area}, ` : ""}{a.city}</span>
                </span>
                <button onClick={() => removeAddress.mutate(a.id)} className="text-[var(--muted-foreground)] hover:text-red-600" aria-label="Remove address">
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
