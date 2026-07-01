"use client";

import { useEffect, useState } from "react";

/**
 * Typewriter that cycles through phrases. Renders the first phrase on the server
 * (no layout shift / hydration mismatch) and animates after mount.
 */
export function TypingText({
  phrases,
  className,
  typingSpeed = 60,
  deletingSpeed = 30,
  pause = 1400,
}: {
  phrases: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pause?: number;
}) {
  const [text, setText] = useState(phrases[0] ?? "");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return;

    const current = phrases[index % phrases.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      timeout = setTimeout(() => {
        setDeleting(false);
        setIndex((v) => (v + 1) % phrases.length);
      }, deletingSpeed);
    } else {
      const next = deleting
        ? current.slice(0, text.length - 1)
        : current.slice(0, text.length + 1);
      timeout = setTimeout(() => setText(next), deleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, index, phrases, typingSpeed, deletingSpeed, pause]);

  return (
    <span className={className} aria-live="polite">
      {text}
      <span className="caret ml-0.5 font-normal text-[var(--accent)]">▍</span>
    </span>
  );
}
