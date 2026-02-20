import type { Metadata } from "next";

interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  descriptionTemplate: string;
  twitterHandle?: string;
  author: string;
  logo: string;
  ogImage: string;
}

const DEFAULT_KEYWORDS = [
  "prompt manager",
  "ai prompt organizer",
  "llm prompts",
  "reusable prompt system",
  "prompt productivity tool",
  "prompt engineering",
];

export const seoConfig: SEOConfig = {
  siteName: "PromptVault",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.promptsvault.online",
  defaultTitle: "PromptVault",
  titleTemplate: "%s | PromptVault",
  defaultDescription:
    "PromptVault helps teams discover, organize, and reuse high-performing AI prompts for modern LLM workflows.",
  descriptionTemplate:
    "Explore %s with PromptVault to organize prompts, improve AI output quality, and ship faster.",
  author: "PromptVault Team",
  logo: "/icons/icon-192x192.svg",
  ogImage: "/icons/icon-512x512.svg",
};

export interface SEOContent {
  title: string;
  description: string;
  h1: string;
  keywords: string[];
  canonical: string;
}

function normalizePath(path = ""): string {
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
}

function toTitleCase(value: string): string {
  return value
    .split(/[-_/]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function dedupeStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean)));
}

export function generateCanonicalUrl(path: string): string {
  const normalized = normalizePath(path);
  return normalized === "/"
    ? seoConfig.siteUrl
    : `${seoConfig.siteUrl}${normalized}`;
}

export function toAbsoluteUrl(urlOrPath: string): string {
  if (!urlOrPath) return seoConfig.siteUrl;
  if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
    return urlOrPath;
  }
  return generateCanonicalUrl(urlOrPath);
}

export function generateKeywordVariations(baseKeywords: string[]): string[] {
  const variations = baseKeywords.flatMap((keyword) => [
    keyword,
    `${keyword} software`,
    `${keyword} tool`,
    `best ${keyword}`,
    `${keyword} for teams`,
  ]);
  return dedupeStrings([...DEFAULT_KEYWORDS, ...variations]);
}

export function generateAutoSEOContent({
  pathname = "/",
  title,
  description,
  h1,
  keywords,
}: {
  pathname?: string;
  title?: string;
  description?: string;
  h1?: string;
  keywords?: string[];
}): SEOContent {
  const normalizedPath = normalizePath(pathname);
  const inferredTopic =
    normalizedPath === "/" ? "AI Prompt Management" : toTitleCase(normalizedPath);
  const finalH1 = h1 || title || inferredTopic;
  const finalTitle = title || inferredTopic;
  const finalDescription =
    description ||
    seoConfig.descriptionTemplate.replace("%s", inferredTopic.toLowerCase());
  const finalKeywords = generateKeywordVariations(
    keywords?.length ? keywords : [inferredTopic.toLowerCase()],
  );

  return {
    title: finalTitle,
    description: finalDescription,
    h1: finalH1,
    keywords: finalKeywords,
    canonical: generateCanonicalUrl(normalizedPath),
  };
}

export function generateGlobalMetadata(): Metadata {
  return {
    metadataBase: new URL(seoConfig.siteUrl),
    title: {
      default: seoConfig.defaultTitle,
      template: seoConfig.titleTemplate,
    },
    description: seoConfig.defaultDescription,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/favicon.ico",
      apple: "/icons/icon-192x192.svg",
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      url: seoConfig.siteUrl,
      siteName: seoConfig.siteName,
      title: seoConfig.defaultTitle,
      description: seoConfig.defaultDescription,
      images: [
        {
          url: `${seoConfig.siteUrl}${seoConfig.ogImage}`,
          width: 1200,
          height: 630,
          alt: seoConfig.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoConfig.defaultTitle,
      description: seoConfig.defaultDescription,
      images: [`${seoConfig.siteUrl}${seoConfig.ogImage}`],
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

export function generateMetadata({
  pathname = "/",
  title,
  description,
  h1,
  canonical,
  images,
  keywords,
  locale = "en_US",
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  noindex = false,
}: {
  pathname?: string;
  title?: string;
  description?: string;
  h1?: string;
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
  noindex?: boolean;
}): Metadata {
  const seo = generateAutoSEOContent({
    pathname,
    title,
    description,
    h1,
    keywords,
  });
  const pageCanonical = canonical || seo.canonical;
  const fullTitle = `${seo.title} | ${seoConfig.siteName}`;
  const metaImages = (images?.length ? images : [seoConfig.ogImage]).map((img) => ({
    url: img.startsWith("http") ? img : `${seoConfig.siteUrl}${img}`,
    width: 1200,
    height: 630,
    alt: seo.h1,
  }));

  return {
    metadataBase: new URL(seoConfig.siteUrl),
    title: fullTitle,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: pageCanonical,
    },
    openGraph: {
      type,
      locale,
      url: pageCanonical,
      title: fullTitle,
      description: seo.description,
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
      description: seo.description,
      images: [metaImages[0]?.url || `${seoConfig.siteUrl}${seoConfig.ogImage}`],
      creator: seoConfig.twitterHandle,
      site: seoConfig.twitterHandle,
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
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
      "https://www.linkedin.com",
      "https://x.com",
      "https://github.com/myasirghaffar",
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
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${seoConfig.siteUrl}/blog?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: seoConfig.siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: seoConfig.siteName,
      url: seoConfig.siteUrl,
    },
  };
}

export function generateAuthorSchema({
  name,
  url,
}: {
  name: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: url || seoConfig.siteUrl,
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
    image: imageUrl || `${seoConfig.siteUrl}${seoConfig.ogImage}`,
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
