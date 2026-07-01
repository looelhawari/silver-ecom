import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import type { Collection } from "@/config/homepageData";

export function CollectionTile({ collection }: { collection: Collection }) {
  const t = useTranslations("common");
  const large = collection.size === "large";

  return (
    <Link
      href={collection.href}
      className={`group relative overflow-hidden rounded-2xl border border-[var(--border)] ${
        large ? "md:col-span-2 md:row-span-2 min-h-[280px] md:min-h-[420px]" : "min-h-[200px]"
      }`}
    >
      <Image
        src={collection.image}
        alt={collection.name}
        fill
        sizes={large ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6 text-white">
        <h3 className={`font-serif font-semibold ${large ? "text-2xl sm:text-3xl" : "text-lg"}`}>
          {collection.name}
        </h3>
        <p className="mt-1 max-w-sm text-sm text-white/80">{collection.description}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-normal text-[var(--accent)]">
          {t("discover")} <ArrowUpRight className="rtl-flip h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
