"use client";

import { useEffect, useRef } from "react";

/**
 * Thin top scroll-progress bar. Writes the scaleX transform straight to the DOM
 * on scroll (passive, no React state / re-render).
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? doc.scrollTop / max : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div
        ref={ref}
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[var(--accent)] to-[var(--foreground)]"
      />
    </div>
  );
}
