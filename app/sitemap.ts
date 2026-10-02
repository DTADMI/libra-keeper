import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://librakeeper.app";
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const language of SUPPORTED_LOCALES) {
    entries.push({
      url: `${baseUrl}/${language.code}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    });
  }

  entries.push({
    url: `${baseUrl}/download`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  });

  return entries;
}
