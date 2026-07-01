import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { ShowcaseCategory } from "@/config/homepageData";

export function CategoryCard({ category }: { category: ShowcaseCategory }) {
  const href = category.slug === "custom" ? "/custom-order" : `/category/${category.slug}`;

  return (
    <Link
      href={href}
      className="group relative flex h-72 shrink-0 snap-start overflow-hidden rounded-2xl border border-[var(--border)] max-sm:w-[75%]"
    >
      <Image
        src={category.image}
        alt={`${category.name} — silver jewelry`}
        fill
        sizes="(max-width: 640px) 75vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="relative mt-auto w-full p-5 text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-semibold">{category.name}</h3>
          <ArrowUpRight className="h-5 w-5 -translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
        </div>
        <p className="mt-1 text-sm text-white/80">{category.description}</p>
        <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
          Explore
        </span>
      </div>
    </Link>
  );
}
