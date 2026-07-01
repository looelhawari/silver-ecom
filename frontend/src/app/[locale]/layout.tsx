import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

import { AppProviders } from "@/components/providers/app-providers";
import { defaultLocale, routing, type Locale } from "@/i18n/routing";
import { storeConfig } from "@/config";
import { getDirection } from "@/lib/locale";

import "../globals.css";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale)
    ? (rawLocale as Locale)
    : defaultLocale;
  const t = await getTranslations({ locale, namespace: "seo" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("defaultTitle"),
      template: `%s · ${storeConfig.name}`,
    },
    description: t("defaultDescription"),
    keywords: t.raw("keywords"),
    robots: "index,follow",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        "ar-EG": "/ar-EG",
      },
    },
    openGraph: {
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      images: ["/images/storefront-hero.png"],
      type: "website",
      locale,
      alternateLocale: routing.locales.filter((item) => item !== locale),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} dir={getDirection(locale)} className="h-full antialiased">
      <body className="min-h-full">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
