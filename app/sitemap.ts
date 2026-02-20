import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { seoConfig } from "@/lib/seo/metadata-builder";
import { PROGRAMMATIC_PAGE_SLUGS } from "@/lib/seo/programmatic-pages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: prompts } = await supabase
    .from("prompts")
    .select("id, updated_at")
    .eq("status", "approved")
    .order("updated_at", { ascending: false });

  const { data: blogs } = await supabase
    .from("blogs")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  const baseUrl = seoConfig.siteUrl;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/documentation`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    ...PROGRAMMATIC_PAGE_SLUGS.map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];

  const promptPages: MetadataRoute.Sitemap =
    prompts?.map((prompt) => ({
      url: `${baseUrl}/prompt/${prompt.id}`,
      lastModified: prompt.updated_at ? new Date(prompt.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    })) || [];

  const blogPages: MetadataRoute.Sitemap =
    blogs?.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updated_at ? new Date(blog.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.85,
    })) || [];

  return [...staticPages, ...promptPages, ...blogPages];
}
