import { useTranslations } from "next-intl";

import { NewsletterForm } from "@/components/layout/newsletter-form";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import { Link } from "@/i18n/navigation";
import { footerSections, storeConfig } from "@/config";
import { paymentMethods } from "@/config/homepageData";

const monogram = storeConfig.name
  .split(" ")
  .map((word) => word[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

const socials = ["Instagram", "Facebook", "TikTok"];

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--foreground)] text-[var(--background)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          {/* Brand + newsletter */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--background)] text-sm font-semibold text-[var(--foreground)]">
                {monogram}
              </span>
              <span className="font-serif text-lg font-semibold">{storeConfig.name}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/70">{storeConfig.slogan}</p>
            <div className="mt-6">
              <p className="text-sm font-semibold">{t("newsletterTitle")}</p>
              <p className="mb-2 text-xs text-white/60">{t("newsletterCopy")}</p>
              <NewsletterForm />
              <div className="mt-4">
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="grid gap-8 sm:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title}>
                <p className="text-sm font-semibold">{t(section.titleKey)}</p>
                <ul className="mt-3 space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                        {t(link.labelKey ?? link.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-sm font-semibold">{t("contact")}</p>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li>{storeConfig.contact.phone}</li>
                <li>{storeConfig.contact.email}</li>
                <li>{storeConfig.contact.address}</li>
                <li className="flex gap-3 pt-2">
                  {socials.map((s) => (
                    <a key={s} href="#" className="hover:text-white">{s}</a>
                  ))}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payments + copyright */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/50">{t("weAccept")}</span>
            {paymentMethods.map((m) => (
              <span key={m} className="rounded-md border border-white/15 px-2.5 py-1 text-[11px] text-white/70">
                {m}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-white/50">
            <Link href="/privacy-policy" className="hover:text-white">{t("privacy")}</Link>
            <Link href="/terms" className="hover:text-white">{t("terms")}</Link>
            <Link href="/returns-policy" className="hover:text-white">{t("returns")}</Link>
            <span>© {new Date().getFullYear()} {storeConfig.name}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
