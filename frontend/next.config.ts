import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Allow product/category/banner images served from the Laravel API (public disk)
// plus web placeholder-image hosts used during development.
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
let apiHost: URL | null = null;
try {
  apiHost = new URL(apiUrl);
} catch {
  apiHost = null;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(apiHost
        ? [
            {
              protocol: apiHost.protocol.replace(":", "") as "http" | "https",
              hostname: apiHost.hostname,
              port: apiHost.port || undefined,
              pathname: "/storage/**",
            },
          ]
        : []),
      { protocol: "https", hostname: "loremflickr.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
