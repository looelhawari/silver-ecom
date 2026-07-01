import { Gem } from "lucide-react";

/**
 * Pure-CSS infinite marquee (GPU transform). The list is duplicated so the
 * -50% translate loops seamlessly.
 */
export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];

  return (
    <div className="border-y border-[var(--border)] bg-[var(--foreground)] py-3 text-[var(--background)]">
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track">
          {doubled.map((item, i) => (
            <span key={i} className="flex items-center whitespace-nowrap text-sm font-medium tracking-wide">
              <span className="px-6">{item}</span>
              <Gem className="h-3.5 w-3.5 text-[var(--accent)]" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
