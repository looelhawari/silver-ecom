import { ArrowRight, MessageCircle, PencilRuler } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { Reveal } from "@/components/home/reveal";
import { storeConfig } from "@/config";

const whatsappHref = `https://wa.me/${storeConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`;

export function FinalCTA() {
  const t = useTranslations("homepage.finalCta");
  const common = useTranslations("common");
  const hero = useTranslations("homepage.hero");

  return (
    <section className="relative overflow-hidden bg-[#15171b] text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--accent)]/25 blur-[120px]" />
      <Reveal className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6">
        <span className="text-xs font-semibold uppercase tracking-normal text-[var(--accent)]">
          {t("eyebrow")}
        </span>
        <h2 className="mt-4 max-w-2xl font-serif text-3xl font-semibold leading-tight sm:text-5xl">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-xl text-white/70">
          {t("description")}
        </p>

        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-[var(--foreground)] transition-transform hover:-translate-y-0.5"
          >
            {hero("shopNow")} <ArrowRight className="rtl-flip h-4 w-4" />
          </Link>
          <Link
            href="/custom-order"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <PencilRuler className="h-4 w-4" /> {hero("startCustom")}
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" /> {common("contactOnWhatsApp")}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
