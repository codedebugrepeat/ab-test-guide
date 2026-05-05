import type { NextConfig } from "next";

const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com";
const region = posthogHost.split("://")[1]?.split(".")[0] ?? "eu";
const posthogIngestHost = posthogHost.replace(
  ".posthog.com",
  ".i.posthog.com"
);
const posthogAssetsHost = `https://${region}-assets.i.posthog.com`;

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
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
