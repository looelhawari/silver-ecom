import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { Reveal } from "@/components/home/reveal";
import { SectionHeader } from "@/components/home/section-header";

export function FAQPreview() {
  const t = useTranslations("homepage.faq");
  const faqPreview = t.raw("items") as { question: string; answer: string }[];

  return (
    <section className="bg-[var(--background)]">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />

        <Reveal className="mt-8 space-y-3">
          {faqPreview.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-[var(--border)] bg-white p-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                {faq.question}
                <Plus className="h-4 w-4 shrink-0 text-[var(--accent)] transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{faq.answer}</p>
            </details>
          ))}
        </Reveal>

        <div className="mt-8 text-center">
          <Link href="/faq" className="text-sm font-semibold text-[var(--primary)] hover:underline">
            {t("viewAll")} <span className="rtl-flip inline-block">-&gt;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
