import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getActiveProducts } from "@/lib/products";
import { getActiveBundles } from "@/lib/bundles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, bundles] = await Promise.all([getActiveProducts(), getActiveBundles()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/san-pham`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/combo`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/chinh-sach`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/san-pham/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const bundleRoutes: MetadataRoute.Sitemap = bundles.map((b) => ({
    url: `${SITE_URL}/combo/${b.slug}`,
    lastModified: b.created_at,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...bundleRoutes];
}
