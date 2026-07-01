import { useTranslations } from "next-intl";

import { CategoryCard } from "@/components/home/category-card";
import { Reveal } from "@/components/home/reveal";
import { SectionHeader } from "@/components/home/section-header";
import { showcaseCategories } from "@/config/homepageData";

export function CategoryShowcase() {
  const t = useTranslations("homepage.category");
  const categories = showcaseCategories.map((category) => ({
    ...category,
    ...(t.raw(`items.${category.slug}`) as { name: string; description: string }),
  }));

  return (
    <section className="bg-[var(--background)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        {/* Horizontal scroll on mobile, grid on larger screens */}
        <Reveal className="mt-10">
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
