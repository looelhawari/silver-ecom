"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { apiFetch } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useAuthStore } from "@/stores/useAuthStore";

type CustomRequest = {
  request_code: string;
  description: string;
  status: { label: string };
  quote?: { final_quote: number } | null;
  created_at: string;
};

export default function AccountRequestsPage() {
  const router = useRouter();
  const { user, hydrated } = useAuthStore();
  useEffect(() => { if (hydrated && !user) router.replace("/login"); }, [hydrated, user, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["my-requests"],
    queryFn: () => apiFetch<{ data: CustomRequest[] }>("/profile/custom-requests").then((r) => r.data),
    enabled: Boolean(user),
  });

  return (
    <StorefrontShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/account" className="text-sm text-[var(--primary)] hover:underline">← Account</Link>
        <h1 className="mt-2 font-serif text-3xl font-semibold">Custom requests</h1>

        {isLoading && <p className="mt-6 text-sm text-[var(--muted-foreground)]">Loading…</p>}
        {data?.length === 0 && (
          <p className="mt-6 text-sm text-[var(--muted-foreground)]">
            No requests yet. <Link href="/custom-order" className="text-[var(--primary)] hover:underline">Start one</Link>.
          </p>
        )}

        <ul className="mt-6 space-y-3">
          {data?.map((r) => (
            <li key={r.request_code} className="rounded-xl border border-[var(--border)] bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{r.request_code}</p>
                <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs">{r.status.label}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">{r.description}</p>
              <div className="mt-2 flex items-center justify-between text-sm">
                {r.quote ? <span className="font-medium">Quote: {formatPrice(r.quote.final_quote)}</span> : <span className="text-[var(--muted-foreground)]">Awaiting review</span>}
                <Link href={`/track-custom?code=${r.request_code}`} className="text-xs text-[var(--primary)] hover:underline">View</Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </StorefrontShell>
  );
}
