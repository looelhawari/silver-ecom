import { iconMap } from "@/components/home/icons";
import type { TrustPoint } from "@/config/homepageData";

export function TrustBadge({ point }: { point: TrustPoint }) {
  const Icon = iconMap[point.icon] ?? iconMap["shield-check"];

  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white/70 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-[var(--accent)]/50 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-white">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="text-base font-semibold">{point.title}</h3>
      <p className="text-sm leading-6 text-[var(--muted-foreground)]">{point.description}</p>
    </div>
  );
}
