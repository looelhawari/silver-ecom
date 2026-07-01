import { ArrowRight, BadgeCheck, FileText, MessageCircle, Upload } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/home/reveal";
import { storeConfig } from "@/config";
import { customSteps } from "@/config/homepageData";

const whatsappHref = `https://wa.me/${storeConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`;

export function CustomOrderStory() {
  return (
    <section className="bg-[#15171b] text-white">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Copy + steps */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Custom silver
          </span>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
            Have a design in mind? We can make it in silver.
          </h2>
          <p className="mt-4 max-w-lg text-white/70">
            Send a reference or describe your idea. Our workshop reviews it, sends a clear quote,
            and crafts your piece once you approve.
          </p>

          <ol className="mt-8 space-y-5">
            {customSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <li className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-sm font-semibold text-[var(--accent)]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-sm text-white/60">{step.description}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/custom-order"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-[var(--foreground)] transition-transform hover:-translate-y-0.5"
            >
              Start custom order <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4" /> Talk on WhatsApp
            </a>
          </div>

          <p className="mt-4 flex items-center gap-2 text-sm text-white/60">
            <BadgeCheck className="h-4 w-4 text-[var(--accent)]" /> You receive a trackable request code.
          </p>
        </div>

        {/* Visual mockup */}
        <Reveal className="relative mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-dashed border-white/25 bg-white/5 p-8 text-center">
            <Upload className="mx-auto h-8 w-8 text-[var(--accent)]" />
            <p className="mt-3 text-sm font-medium">Upload a reference image</p>
            <p className="text-xs text-white/50">JPG or PNG — up to 5 photos</p>
          </div>

          <div className="mt-4 rounded-2xl border border-white/15 bg-white p-5 text-[var(--foreground)] shadow-2xl sm:absolute sm:-bottom-8 sm:-right-6 sm:mt-0 sm:w-72">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4 text-[var(--accent)]" /> Your quote
              </span>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                Quote sent
              </span>
            </div>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-[var(--muted-foreground)]">Piece</dt><dd>Custom ring</dd></div>
              <div className="flex justify-between"><dt className="text-[var(--muted-foreground)]">Silver</dt><dd>Italian 925</dd></div>
              <div className="flex justify-between"><dt className="text-[var(--muted-foreground)]">Weight</dt><dd>4.5 g</dd></div>
              <div className="flex justify-between border-t border-[var(--border)] pt-1.5 font-semibold"><dt>Estimated</dt><dd>1,150 EGP</dd></div>
            </dl>
            <p className="mt-3 text-[11px] text-[var(--muted-foreground)]">Request code: CR-260701-AB12C</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
