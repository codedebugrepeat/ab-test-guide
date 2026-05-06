import type { NextConfig } from "next";

const posthogUrl = new URL(
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com"
);
const region = posthogUrl.hostname.split(".")[0] ?? "eu";
const posthogIngestHost = posthogUrl.hostname.endsWith(".i.posthog.com")
  ? posthogUrl.origin
  : `${posthogUrl.protocol}//${region}.i.posthog.com`;
const posthogAssetsHost = `${posthogUrl.protocol}//${region}-assets.i.posthog.com`;

const nextConfig: NextConfig = {
  images: {
    // formats: ['image/avif', 'image/webp'],
    qualities: [75, 90, 100],
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: `${posthogAssetsHost}/static/:path*`,
      },
      {
        source: "/ingest/array/:path*",
        destination: `${posthogAssetsHost}/array/:path*`,
      },
      {
        source: "/ingest/:path*",
        destination: `${posthogIngestHost}/:path*`,
      },
    ];
  },
};

export default nextConfig;
