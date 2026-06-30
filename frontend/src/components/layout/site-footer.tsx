import Link from "next/link";

import { footerSections, storeConfig } from "@/config";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--foreground)] text-[var(--background)]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_2fr] lg:px-8">
        <div className="max-w-sm">
          <p className="text-lg font-semibold">{storeConfig.name}</p>
          <p className="mt-3 text-sm leading-6 text-white/72">
            {storeConfig.slogan}
          </p>
          <p className="mt-5 text-sm text-white/72">{storeConfig.contact.email}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.title}>
              <p className="text-sm font-semibold">{section.title}</p>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/72 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
