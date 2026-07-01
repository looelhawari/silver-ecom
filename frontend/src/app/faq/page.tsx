import type { Metadata } from "next";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { apiFetch } from "@/lib/api";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about silver types, delivery, payment, custom orders, returns and care.",
};

type Faq = { id: number; question: string; answer: string; group?: string | null };

async function getFaqs(): Promise<Faq[]> {
  try {
    const res = await apiFetch<{ data: Faq[] }>("/faqs", { cache: "no-store" });
    return res.data;
  } catch {
    return [];
  }
}

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <StorefrontShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Frequently asked questions</h1>
        <div className="mt-8 space-y-3">
          {faqs.length === 0 && <p className="text-sm text-[var(--muted-foreground)]">No FAQs yet.</p>}
          {faqs.map((faq) => (
            <details key={faq.id} className="group rounded-xl border border-[var(--border)] bg-white p-5">
              <summary className="cursor-pointer list-none font-medium">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </StorefrontShell>
  );
}
