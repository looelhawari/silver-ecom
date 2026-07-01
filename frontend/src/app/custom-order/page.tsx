"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, apiFetch } from "@/lib/api";

type SilverType = { id: number; name: string };

const field = "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]";

export default function CustomOrderPage() {
  const [submitting, setSubmitting] = useState(false);
  const [requestCode, setRequestCode] = useState<string | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);

  const { data: silverTypes } = useQuery({
    queryKey: ["silver-types"],
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
        headers: { Accept: "application/json" },
        credentials: "include",
        body: fd,
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.message ?? "Please check the form and try again.");
      }
      setRequestCode(payload.data.request_code);
      formEl.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (requestCode) {
    return (
      <StorefrontShell>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
          <h1 className="mt-4 font-serif text-3xl font-semibold">Request received!</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Your tracking code is <span className="font-semibold text-[var(--foreground)]">{requestCode}</span>.
            We&apos;ll review your reference and send a quote.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild><Link href={`/track-custom?code=${requestCode}`}>Track request</Link></Button>
            <Button asChild variant="secondary"><Link href="/shop">Browse silver</Link></Button>
          </div>
        </div>
      </StorefrontShell>
    );
  }

  return (
    <StorefrontShell>
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold">Request a custom silver piece</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Upload a reference image and tell us what you have in mind. We&apos;ll send a quote.
        </p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={field} name="name" placeholder="Your name *" required />
            <input className={field} name="phone" placeholder="Phone *" required />
            <input className={field} name="whatsapp" placeholder="WhatsApp (optional)" />
            <input className={field} name="email" type="email" placeholder="Email (optional)" />
          </div>

          <textarea className={field} name="description" rows={4} placeholder="Describe the piece you want *" required />

          <div className="grid gap-3 sm:grid-cols-3">
            <select className={field} name="silver_type_id" defaultValue="">
              <option value="">Silver type (optional)</option>
              {silverTypes?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input className={field} name="expected_weight_grams" type="number" step="0.1" min="0" placeholder="Weight (g)" />
            <input className={field} name="size" placeholder="Size / length" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input className={field} name="budget_min" type="number" min="0" placeholder="Budget from (EGP)" />
            <input className={field} name="budget_max" type="number" min="0" placeholder="Budget to (EGP)" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Reference images (up to 5)</label>
            <input
              className={field}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
          </div>

          <textarea className={field} name="notes" rows={2} placeholder="Anything else? (optional)" />

          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit request"}
          </Button>
        </form>
      </div>
    </StorefrontShell>
  );
}
