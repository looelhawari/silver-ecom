"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Counts from 0 → `to` once it scrolls into view (rAF, single run). SSR renders
 * the start value so there's no hydration mismatch. Jumps to `to` for reduced motion.
 */
export function CountUp({
  to,
  duration = 1500,
  decimals = 0,
  suffix = "",
  className,
}: {
  to: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      setValue(to);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(to * eased);
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [to, duration, reduced]);

  const display =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-US");

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
