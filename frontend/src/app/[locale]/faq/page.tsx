import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { StorefrontShell } from "@/components/layout/storefront-shell";
import { apiFetch } from "@/lib/api";
import { localizedField, normalizeLocale } from "@/lib/locale";

type PageParams = Promise<{ locale: string }>;
type Faq = { id: number; question: string; question_en?: string | null; question_ar?: string | null; answer: string; answer_en?: string | null; answer_ar?: string | null; group?: string | null };

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "support" });

  return {
    title: t("faqTitle"),
  };
}

async function getFaqs(locale: string): Promise<Faq[]> {
  try {
    const res = await apiFetch<{ data: Faq[] }>("/faqs", { cache: "no-store", locale });
    return res.data;
  } catch {
    return [];
  }
}

export default async function FaqPage({ params }: { params: PageParams }) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "support" });
  const faqs = await getFaqs(locale);

  return (
    <StorefrontShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold sm:text-4xl">{t("faqTitle")}</h1>
        <div className="mt-8 space-y-3">
          {faqs.length === 0 && <p className="text-sm text-[var(--muted-foreground)]">{t("noFaqs")}</p>}
          {faqs.map((faq) => (
            <details key={faq.id} className="group rounded-xl border border-[var(--border)] bg-white p-5">
              <summary className="cursor-pointer list-none font-medium">
                {localizedField(faq, "question", locale)}
              </summary>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{localizedField(faq, "answer", locale)}</p>
            </details>
          ))}
        </div>
      </div>
    </StorefrontShell>
  );
}
