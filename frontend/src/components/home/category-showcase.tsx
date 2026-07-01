import { CategoryCard } from "@/components/home/category-card";
import { Reveal } from "@/components/home/reveal";
import { SectionHeader } from "@/components/home/section-header";
import { showcaseCategories } from "@/config/homepageData";

export function CategoryShowcase() {
  return (
    <section className="bg-[var(--background)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Browse by category"
          title="Find your silver"
          description="From everyday essentials to statement pieces — explore the pieces our customers love most."
        />

        {/* Horizontal scroll on mobile, grid on larger screens */}
        <Reveal className="mt-10">
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {showcaseCategories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
