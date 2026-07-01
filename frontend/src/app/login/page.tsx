"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";

const field = "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await login(String(fd.get("email")), String(fd.get("password")));
      toast.success("Welcome back!");
      router.push("/account");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StorefrontShell>
      <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Access your orders and custom requests.</p>
        <form className="mt-6 space-y-3" onSubmit={submit}>
          <input className={field} name="email" type="email" placeholder="Email" required />
          <input className={field} name="password" type="password" placeholder="Password" required />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
        </form>
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
          New here? <Link href="/register" className="text-[var(--primary)] hover:underline">Create an account</Link>
        </p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Or <Link href="/track-order" className="text-[var(--primary)] hover:underline">track an order as a guest</Link>.
        </p>
      </div>
    </StorefrontShell>
  );
}
