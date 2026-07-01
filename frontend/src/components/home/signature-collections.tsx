import { CollectionTile } from "@/components/home/collection-tile";
import { Reveal } from "@/components/home/reveal";
import { SectionHeader } from "@/components/home/section-header";
import { collections } from "@/config/homepageData";

export function SignatureCollections() {
  return (
    <section className="bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Signature collections"
          title="Curated silver, by story"
          description="Each collection is grouped by origin and mood — so you can shop the feeling, not just the piece."
        />

        <Reveal className="mt-10">
          <div className="grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {collections.map((collection) => (
              <CollectionTile key={collection.name} collection={collection} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
