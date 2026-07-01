"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { announcements } from "@/config/homepageData";

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % announcements.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-[var(--foreground)] text-[var(--background)]">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center overflow-hidden px-4 text-center text-xs tracking-wide">
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
