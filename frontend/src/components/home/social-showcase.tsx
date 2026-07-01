import { MessageCircle } from "lucide-react";
import Image from "next/image";

import { Reveal } from "@/components/home/reveal";
import { SectionHeader } from "@/components/home/section-header";
import { storeConfig } from "@/config";
import { socialImages } from "@/config/homepageData";

const whatsappHref = `https://wa.me/${storeConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`;

export function SocialShowcase() {
  return (
    <section className="bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="On social"
          title="Follow our latest silver pieces"
          description="New arrivals, custom builds and behind-the-scenes from the workshop."
        />

        <Reveal className="mt-10 grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6">
          {socialImages.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl">
              <Image
                src={src}
                alt="Silver jewelry on social media"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </Reveal>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="#"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-[var(--border)] bg-white px-6 text-sm font-semibold transition-colors hover:border-[var(--foreground)]"
          >
            Follow on Instagram
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--foreground)] px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" /> Send us your design
          </a>
        </div>
      </div>
    </section>
  );
}
