"use client";

import dynamic from "next/dynamic";

export const CookieBannerLoader = dynamic(
  () => import("@/components/cookie-banner").then((m) => m.CookieBanner),
  { ssr: false }
);
