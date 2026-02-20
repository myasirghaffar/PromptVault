import type { MetadataRoute } from "next";
import { seoConfig } from "@/lib/seo/metadata-builder";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = seoConfig.siteUrl;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/prompt", "/documentation", "/faq", "/contact"],
        disallow: [
          "/admin/",
          "/dashboard/",
          "/user/",
          "/api/",
          "/auth/",
          "/_next/",
          "/static/",
          "/manifest",
          "/*.json$",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/blog", "/prompt", "/documentation", "/faq", "/contact"],
        disallow: [
          "/admin/",
          "/dashboard/",
          "/user/",
          "/api/",
          "/auth/",
          "/_next/",
          "/static/",
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/user/",
          "/api/",
          "/auth/",
        ],
      },
      {
        userAgent: "AI-Assistant-User",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/user/",
          "/api/",
          "/auth/",
        ],
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/user/",
          "/api/",
          "/auth/",
        ],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/user/",
          "/api/",
          "/auth/",
        ],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/user/",
          "/api/",
          "/auth/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
