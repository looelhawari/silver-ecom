import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import { seoConfig, storeConfig } from "@/config";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: seoConfig.title,
    template: `%s · ${storeConfig.name}`,
  },
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  robots: seoConfig.robots,
  openGraph: {
    title: seoConfig.title,
    description: seoConfig.description,
    images: [seoConfig.openGraphImage],
    type: "website",
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
      className={`h-full antialiased ${inter.variable} ${cormorant.variable}`}
    >
      <body className="min-h-full">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
