import type { Metadata } from "next";

import { AppProviders } from "@/components/providers/app-providers";
import { seoConfig, storeConfig } from "@/config";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: seoConfig.title,
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  robots: seoConfig.robots,
  openGraph: {
    title: seoConfig.title,
    description: seoConfig.description,
    images: [seoConfig.openGraphImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={storeConfig.locale}
      dir={storeConfig.direction}
      className="h-full antialiased"
    >
      <body className="min-h-full">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
