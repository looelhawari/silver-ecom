"use client";

import { BadgeCheck, ArrowRight, PencilRuler } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { hero } from "@/config/homepageData";

const miniBadges = ["Quality silver", "Custom designs", "Delivery across Egypt", "Secure tracking"];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#15171b] text-white">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-[var(--accent)]/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-white/10 blur-[120px]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
        {/* Copy */}
        <div>
          <motion.span
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/80"
          >
            {hero.eyebrow}
          </motion.span>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-xl font-serif text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl"
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg"
          >
            {hero.subheadline}
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-[var(--foreground)] transition-transform hover:-translate-y-0.5"
            >
              Shop collection <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/custom-order"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <PencilRuler className="h-4 w-4" /> Create custom piece
            </Link>
          </motion.div>

          <motion.ul
            custom={4}
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
        </div>

        {/* Art direction */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-[4/5] w-full max-w-md"
        >
          <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10">
            <Image
              src={hero.image}
              alt="Handcrafted silver jewelry"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Floating detail cards */}
          {hero.floatingCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.6 + i * 0.2 },
                y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
              }}
              className={`absolute hidden items-center gap-3 rounded-2xl border border-white/15 bg-white/90 p-2.5 text-[var(--foreground)] shadow-xl backdrop-blur sm:flex ${
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
        </motion.div>
      </div>
    </section>
  );
}
