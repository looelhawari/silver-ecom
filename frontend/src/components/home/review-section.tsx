import { Quote, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/home/reveal";
import { SectionHeader } from "@/components/home/section-header";

export function ReviewSection() {
  const t = useTranslations("homepage.reviews");
  const reviews = t.raw("items") as { name: string; product: string; rating: number; quote: string }[];

  return (
    <section className="bg-[var(--background)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.name + review.product} delay={(i % 3) * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-white p-6">
                <Quote className="h-6 w-6 text-[var(--accent)]/50" />
                <div className="mt-3 flex gap-0.5" aria-label={t("stars", { rating: review.rating })}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${s < review.rating ? "fill-[var(--accent)] text-[var(--accent)]" : "text-[var(--border)]"}`}
                    />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1 text-sm leading-6 text-[var(--foreground)]">
                  &quot;{review.quote}&quot;
                </blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold">{review.name}</span>
                  <span className="text-[var(--muted-foreground)]"> · {review.product}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
