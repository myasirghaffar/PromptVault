import { Metadata } from "next";

interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  twitterHandle?: string;
  author: string;
  logo: string;
}

export const seoConfig: SEOConfig = {
  siteName: "PromptVault",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://promptvault.vercel.app",
  defaultTitle: "PromptVault - Discover Amazing AI Prompts",
  defaultDescription:
    "Browse our curated collection of high-quality prompts for ChatGPT, Midjourney, Gemini and more AI tools",
  author: "PromptVault Team",
  logo: "/icons/icon-192x192.svg",
};

export function generateMetadata({
  title,
  description,
  canonical,
  images,
  keywords,
  locale = "en",
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
}: {
  title?: string;
  description?: string;
  canonical?: string;
  images?: string[];
  keywords?: string[];
  locale?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}): Metadata {
  const fullTitle = title
    ? `${title} | ${seoConfig.siteName}`
    : seoConfig.defaultTitle;

  const fullDescription = description || seoConfig.defaultDescription;

  const metaImages = images?.length
    ? images.map((img, index) => ({
        url: img.startsWith("http") ? img : `${seoConfig.siteUrl}${img}`,
        width: 1200,
        height: 630,
        alt: title || seoConfig.defaultTitle,
        type: "image/jpeg",
      }))
    : [
        {
          url: `${seoConfig.siteUrl}${seoConfig.logo}`,
          width: 192,
          height: 192,
          alt: seoConfig.siteName,
          type: "image/svg+xml",
        },
      ];

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: keywords?.join(", "),
    metadataBase: new URL(seoConfig.siteUrl),
    alternates: {
      canonical: canonical,
      languages: {
        en: seoConfig.siteUrl,
        "x-default": seoConfig.siteUrl,
      },
    },
    openGraph: {
      type,
      locale,
      url: canonical,
      title: fullTitle,
      description: fullDescription,
      siteName: seoConfig.siteName,
      images: metaImages,
      publishedTime,
      modifiedTime,
      authors,
      section,
      tags,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: metaImages[0]?.url,
      creator: seoConfig.twitterHandle,
      site: seoConfig.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
    },
  };
}

export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${seoConfig.siteUrl}/${cleanPath}`;
}

export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}${seoConfig.logo}`,
    description: seoConfig.defaultDescription,
    sameAs: [
      // Add social media URLs here
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: `${seoConfig.siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateArticleSchema({
  title,
  description,
  url,
  imageUrl,
  publishedTime,
  modifiedTime,
  author,
  keywords,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image: imageUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: seoConfig.siteName,
      logo: {
        "@type": "ImageObject",
        url: `${seoConfig.siteUrl}${seoConfig.logo}`,
      },
    },
    keywords: keywords?.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateProductSchema({
  name,
  description,
  imageUrl,
  category,
  tags,
}: {
  name: string;
  description: string;
  imageUrl?: string;
  category: string;
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: imageUrl,
    category,
    keywords: tags?.join(", "),
    brand: {
      "@type": "Brand",
      name: seoConfig.siteName,
    },
  };
}
