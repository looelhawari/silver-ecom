"use client";

import { ArrowRight, BadgeCheck, PencilRuler } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { CountUp } from "@/components/home/count-up";
import { Tilt } from "@/components/home/tilt";
import { TypingText } from "@/components/home/typing-text";
import { hero } from "@/config/homepageData";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function HeroSection() {
  const t = useTranslations("homepage.hero");
  const miniBadges = t.raw("badges") as string[];
  const typedPhrases = t.raw("typedPhrases") as string[];
  const floatingCards = hero.floatingCards.map((card, i) => ({
    ...card,
    ...((t.raw("floatingCards") as { title: string; caption: string }[])[i] ?? {}),
  }));
  const stats: { to: number; label: string; decimals?: number }[] = [
    { to: 5, label: t("stats.silverTypes") },
    { to: 9, label: t("stats.categories") },
    { to: 4, label: t("stats.paymentOptions") },
    { to: 4.9, decimals: 1, label: t("stats.avgRating") },
  ];

  return (
    <section className="relative overflow-hidden bg-[#15171b] text-white">
      {/* Animated ambient glows */}
      <div className="aurora pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-[var(--accent)]/25 blur-[120px]" />
      <div className="aurora pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-white/10 blur-[120px]" style={{ animationDelay: "-6s" }} />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
        {/* Copy */}
        <div>
          <motion.span
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-normal text-white/80"
          >
            {t("eyebrow")}
          </motion.span>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-xl font-serif text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl"
          >
            {t("headline")}
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-5 text-lg font-medium text-white/90"
          >
            {t("nowCrafting")}{" "}
            <TypingText phrases={typedPhrases} className="font-serif text-[var(--accent)]" />
          </motion.p>

          <motion.p
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-3 max-w-xl text-base leading-7 text-white/70"
          >
            {t("subheadline")}
          </motion.p>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/shop"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-[var(--foreground)] transition-transform hover:-translate-y-0.5"
            >
              {t("shopNow")}
              <ArrowRight className="rtl-flip h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/custom-order"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <PencilRuler className="h-4 w-4" /> {t("startCustom")}
            </Link>
          </motion.div>

          <motion.ul
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2"
          >
            {miniBadges.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-white/70">
                <BadgeCheck className="h-4 w-4 text-[var(--accent)]" /> {b}
              </li>
            ))}
          </motion.ul>

          {/* Count-up stats */}
          <motion.dl
            custom={6}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-10 grid max-w-md grid-cols-4 gap-4 border-t border-white/10 pt-6"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-serif text-2xl font-semibold sm:text-3xl">
                  <CountUp to={s.to} decimals={s.decimals ?? 0} />
                </dd>
                <p className="mt-1 text-[11px] leading-tight text-white/55">{s.label}</p>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Art direction */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <Tilt className="relative aspect-[4/5] w-full">
            <div className="shine relative h-full w-full overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={hero.image}
                alt={t("imageAlt")}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="ken-burns object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            </div>

            {/* Floating detail cards */}
            {floatingCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: [0, -10, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.6 + i * 0.2 },
                  y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
                }}
                className={`absolute z-10 hidden items-center gap-3 rounded-2xl border border-white/15 bg-white/90 p-2.5 text-[var(--foreground)] shadow-xl backdrop-blur sm:flex ${
                  i === 0 ? "-left-6 top-10" : "-right-6 bottom-12"
                }`}
              >
                <span className="relative h-12 w-12 overflow-hidden rounded-xl">
                  <Image src={card.image} alt={card.title} fill sizes="48px" className="object-cover" />
                </span>
                <span className="pr-2">
                  <span className="block text-sm font-semibold">{card.title}</span>
                  <span className="block text-xs text-[var(--muted-foreground)]">{card.caption}</span>
                </span>
              </motion.div>
            ))}
          </Tilt>
        </motion.div>
      </div>
    </section>
  );
}
