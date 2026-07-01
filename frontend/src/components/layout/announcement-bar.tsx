"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function AnnouncementBar() {
  const t = useTranslations("announcement");
  const announcements = t.raw("items") as string[];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % announcements.length), 4500);
    return () => clearInterval(id);
  }, [announcements.length]);

  return (
    <div className="bg-[var(--foreground)] text-[var(--background)]">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center overflow-hidden px-4 text-center text-xs tracking-normal">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            {announcements[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
