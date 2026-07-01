import type { NextConfig } from "next";

// Allow product/category/banner images served from the Laravel API (public disk).
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
    ],
  },
};

export default nextConfig;
