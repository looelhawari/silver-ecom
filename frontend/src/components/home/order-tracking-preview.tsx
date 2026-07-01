"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { SectionHeader } from "@/components/home/section-header";
import { trackingSteps } from "@/config/homepageData";

// Mock progress: everything up to "Shipped" is done.
const CURRENT = 4;

export function OrderTrackingPreview() {
  return (
    <section className="bg-[var(--background)]">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Order tracking"
          title="Always know where your order is"
          description="Every order gets a code you can track any time — from confirmation to your doorstep."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-10 rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-8"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-[var(--muted-foreground)]">
              Order <span className="font-semibold text-[var(--foreground)]">FS-260701-AB12C</span>
            </span>
            <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-medium">In transit</span>
          </div>

          {/* Timeline: vertical on mobile, horizontal on desktop */}
          <ol className="flex flex-col gap-6 md:flex-row md:justify-between md:gap-0">
            {trackingSteps.map((step, i) => {
              const done = i <= CURRENT;
              return (
                <li key={step} className="relative flex items-center gap-3 md:flex-1 md:flex-col md:text-center">
                  {/* connector (desktop) */}
                  {i < trackingSteps.length - 1 && (
                    <span
                      className={`absolute left-[11px] top-6 h-full w-0.5 md:left-auto md:top-3 md:h-0.5 md:w-full md:translate-x-1/2 ${
                        i < CURRENT ? "bg-[var(--accent)]" : "bg-[var(--border)]"
                      }`}
                    />
                  )}
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.35 }}
                    className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      done
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : "border-[var(--border)] bg-white text-transparent"
                    } ${i === CURRENT ? "ring-4 ring-[var(--accent)]/20" : ""}`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </motion.span>
                  <span className={`text-sm md:mt-2 ${done ? "font-medium" : "text-[var(--muted-foreground)]"}`}>
                    {step}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 text-center">
            <Link
              href="/track-order"
              className="inline-flex h-11 items-center rounded-lg bg-[var(--foreground)] px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Track your order
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
