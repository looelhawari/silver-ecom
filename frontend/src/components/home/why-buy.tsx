import { Reveal } from "@/components/home/reveal";
import { SectionHeader } from "@/components/home/section-header";
import { TrustBadge } from "@/components/home/trust-badge";
import { whyBuy } from "@/config/homepageData";

export function WhyBuyFromUs() {
  return (
    <section className="bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Why buy from us"
          title="A silver shop you can trust"
          description="Every part of the experience is built to feel clear, safe and personal."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyBuy.map((point, i) => (
            <Reveal key={point.title} delay={(i % 3) * 0.08}>
              <TrustBadge point={point} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
