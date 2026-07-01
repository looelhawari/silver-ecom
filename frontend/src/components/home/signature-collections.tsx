import { useTranslations } from "next-intl";

import { CollectionTile } from "@/components/home/collection-tile";
import { Reveal } from "@/components/home/reveal";
import { SectionHeader } from "@/components/home/section-header";
import { collections } from "@/config/homepageData";

export function SignatureCollections() {
  const t = useTranslations("homepage.collections");
  const localizedCollections = collections.map((collection, i) => ({
    ...collection,
    ...((t.raw("items") as { name: string; description: string }[])[i] ?? {}),
  }));

  return (
    <section className="bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <Reveal className="mt-10">
          <div className="grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {localizedCollections.map((collection) => (
              <CollectionTile key={collection.name} collection={collection} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
