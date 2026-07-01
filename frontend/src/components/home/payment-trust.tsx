import { BadgeCheck, Package, Upload, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/home/reveal";
import { SectionHeader } from "@/components/home/section-header";

const stepIcons = [Wallet, Upload, BadgeCheck, Package];

export function PaymentTrustSection() {
  const t = useTranslations("homepage.payment");
  const paymentSteps = t.raw("steps") as { title: string; description: string }[];
  const paymentMethods = t.raw("methods") as string[];

  return (
    <section className="bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paymentSteps.map((step, i) => {
            const Icon = stepIcons[i] ?? Wallet;
            return (
              <Reveal key={step.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-[var(--border)] bg-white p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--accent)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-semibold text-[var(--muted-foreground)]">{t("step", { number: i + 1 })}</span>
                  </div>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">{step.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-[var(--muted-foreground)]">{t("accepted")}</span>
          {paymentMethods.map((m) => (
            <span key={m} className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-sm font-medium">
              {m}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
