import { ArrowRight, BadgeCheck, FileText, MessageCircle, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { Reveal } from "@/components/home/reveal";
import { storeConfig } from "@/config";

const whatsappHref = `https://wa.me/${storeConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`;

export function CustomOrderStory() {
  const t = useTranslations("homepage.customOrder");
  const common = useTranslations("common");
  const customSteps = t.raw("steps") as { title: string; description: string }[];

  return (
    <section className="bg-[#15171b] text-white">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Copy + steps */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-normal text-[var(--accent)]">
            {t("eyebrow")}
          </span>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-lg text-white/70">
            {t("description")}
          </p>

          <ol className="mt-8 space-y-5">
            {customSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <li className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-sm font-semibold text-[var(--accent)]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-sm text-white/60">{step.description}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/custom-order"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-[var(--foreground)] transition-transform hover:-translate-y-0.5"
            >
              {t("start")} <ArrowRight className="rtl-flip h-4 w-4" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4" /> {common("talkOnWhatsApp")}
            </a>
          </div>

          <p className="mt-4 flex items-center gap-2 text-sm text-white/60">
            <BadgeCheck className="h-4 w-4 text-[var(--accent)]" /> {t("trackable")}
          </p>
        </div>

        {/* Visual mockup */}
        <Reveal className="relative mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-dashed border-white/25 bg-white/5 p-8 text-center">
            <Upload className="mx-auto h-8 w-8 text-[var(--accent)]" />
            <p className="mt-3 text-sm font-medium">{t("uploadTitle")}</p>
            <p className="text-xs text-white/50">{t("uploadHint")}</p>
          </div>

          <div className="mt-4 rounded-2xl border border-white/15 bg-white p-5 text-[var(--foreground)] shadow-2xl sm:absolute sm:-bottom-8 sm:-right-6 sm:mt-0 sm:w-72">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4 text-[var(--accent)]" /> {t("quoteTitle")}
              </span>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                {t("quoteSent")}
              </span>
            </div>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-[var(--muted-foreground)]">{t("piece")}</dt><dd>{t("pieceValue")}</dd></div>
              <div className="flex justify-between"><dt className="text-[var(--muted-foreground)]">{t("silver")}</dt><dd>{t("silverValue")}</dd></div>
              <div className="flex justify-between"><dt className="text-[var(--muted-foreground)]">{t("weight")}</dt><dd>4.5 {common("grams")}</dd></div>
              <div className="flex justify-between border-t border-[var(--border)] pt-1.5 font-semibold"><dt>{t("estimated")}</dt><dd>1,150 {common("egp")}</dd></div>
            </dl>
            <p className="mt-3 text-[11px] text-[var(--muted-foreground)]">{t("requestCode")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
