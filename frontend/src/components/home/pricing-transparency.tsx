"use client";

import { BadgeCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { calculatorTypes } from "@/config/homepageData";
import { formatPrice } from "@/lib/format";

const field = "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]";

export function PricingTransparency() {
  const locale = useLocale();
  const t = useTranslations("homepage.pricing");
  const points = t.raw("points") as string[];
  const typeLabels = t.raw("types") as string[];
  const [weight, setWeight] = useState("5");
  const [typeIndex, setTypeIndex] = useState(0);
  const [workmanship, setWorkmanship] = useState("120");

  const estimate = useMemo(() => {
    const w = parseFloat(weight) || 0;
    const rate = calculatorTypes[typeIndex]?.ratePerGram ?? 0;
    const fee = parseFloat(workmanship) || 0;
    return Math.max(0, w * rate + fee);
  }, [weight, typeIndex, workmanship]);

  return (
    <section className="bg-[var(--background)]">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-normal text-[var(--accent)]">
            {t("eyebrow")}
          </span>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
            {t("title")}
          </h2>
          <ul className="mt-6 space-y-4">
            {points.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-6 text-[var(--muted-foreground)]">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Estimate calculator (preview) */}
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold">{t("estimateTitle")}</p>
          <p className="text-xs text-[var(--muted-foreground)]">{t("estimateCopy")}</p>

          <div className="mt-4 space-y-3">
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">{t("weight")}</span>
              <input className={field} type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">{t("silverType")}</span>
              <select className={field} value={typeIndex} onChange={(e) => setTypeIndex(Number(e.target.value))}>
                {calculatorTypes.map((t, i) => (
                  <option key={t.label} value={i}>{typeLabels[i] ?? t.label} (~{t.ratePerGram} EGP/g)</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">{t("workmanship")}</span>
              <input className={field} type="number" min="0" value={workmanship} onChange={(e) => setWorkmanship(e.target.value)} />
            </label>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl bg-[var(--surface)] px-4 py-3">
            <span className="text-sm text-[var(--muted-foreground)]">{t("estimatedTotal")}</span>
            <span className="font-serif text-2xl font-semibold">{formatPrice(estimate, "EGP", locale)}</span>
          </div>

          <Link
            href="/custom-order"
            className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[var(--primary)] text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-strong)]"
          >
            {t("requestQuote")}
          </Link>
        </div>
      </div>
    </section>
  );
}
