import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { COLLECTIONS, JOURNAL } from "@/lib/data";
import { POLICIES } from "@/lib/policies";
import { SITE } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${SITE.url}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/journal`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...[
      "/about",
      "/designer",
      "/contact",
      "/size-guide",
      "/privacy",
      ...POLICIES.map((policy) => `/policies/${policy.slug}`),
    ].map((path) => ({
      url: `${SITE.url}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];

  const collectionRoutes: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${SITE.url}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  const journalRoutes: MetadataRoute.Sitemap = JOURNAL.map((p) => ({
    url: `${SITE.url}/journal/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    productRoutes = products.map((p) => ({
      url: `${SITE.url}/products/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // API unavailable at build time — ship the static map
  }

  return [
    ...staticRoutes,
    ...collectionRoutes,
    ...productRoutes,
    ...journalRoutes,
  ];
}
