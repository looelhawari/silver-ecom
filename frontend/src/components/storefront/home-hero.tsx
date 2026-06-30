"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { storeConfig } from "@/config";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="relative min-h-[520px] overflow-hidden md:min-h-[620px]">
      <Image
        src={storeConfig.hero.imagePath}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,14,12,0.82),rgba(10,14,12,0.48)_48%,rgba(10,14,12,0.12))]" />
      <div className="relative mx-auto flex min-h-[520px] w-full max-w-7xl items-center px-4 py-14 sm:px-6 md:min-h-[620px] lg:px-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl text-white"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/24 bg-white/12 px-3 py-2 text-sm font-medium backdrop-blur">
            <Sparkles className="h-4 w-4" />
            {storeConfig.hero.eyebrow}
          </div>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">
            {storeConfig.hero.headline}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/82 sm:text-lg">
            {storeConfig.hero.copy}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/shop">
                Shop collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/collections">View edits</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
