import { useTranslations } from "next-intl";

import { Reveal } from "@/components/home/reveal";
import { TrustBadge } from "@/components/home/trust-badge";
import { trustPoints } from "@/config/homepageData";

export function TrustStrip() {
  const t = useTranslations("homepage");
  const localizedTrustPoints = t.raw("trustPoints") as { title: string; description: string }[];
  const points = trustPoints.map((point, i) => ({
    ...point,
    ...(localizedTrustPoints[i] ?? {}),
  }));

  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {points.map((point, i) => (
          <Reveal key={point.title} delay={i * 0.08}>
            <TrustBadge point={point} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
