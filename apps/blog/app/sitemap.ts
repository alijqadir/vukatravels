import type { MetadataRoute } from "next";
import { isSanityConfigured, sanityClient } from "@/lib/sanity.client";
import { postSlugsQuery } from "@/lib/sanity.queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/blog`,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  if (!isSanityConfigured) {
    return entries;
  }

  const slugs = await sanityClient.fetch<string[]>(postSlugsQuery, {}, { next: { revalidate: 300 } });

  return [
    ...entries,
    ...slugs.map((slug) => ({
      url: `${siteUrl}/blog/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
