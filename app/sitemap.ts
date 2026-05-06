import type { MetadataRoute } from "next";
import { chapters } from "@/components/tutorial/chapters";

const BASE = "https://learnabtest.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: BASE, lastModified, priority: 1, changeFrequency: "monthly" },
    ...chapters.map((c) => ({
      url: `${BASE}${c.href}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${BASE}/calculator`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
