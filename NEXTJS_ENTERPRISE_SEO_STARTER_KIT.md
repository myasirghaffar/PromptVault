# 🚀 ENTERPRISE NEXT.JS SEO STARTER KIT (APP ROUTER)

Production-ready SEO architecture.

Supports:

- Next.js 13+
- Next.js 14+
- Next.js 15+
- App Router only

---

# 📁 REQUIRED FILE STRUCTURE

Create:

```
/lib/seo/
    site.ts
    metadata.ts
    schema.ts
    page.ts

/components/seo/
    JsonLd.tsx

/app/
    sitemap.ts
    robots.ts
```

---

# 1️⃣ GLOBAL SITE CONFIG

## `/lib/seo/site.ts`

```ts
export const SITE = {
  name: "PromptsVault",
  url: "https://www.promptsvault.online",
  description:
    "AI Prompt Manager Chrome Extension to save, organize, and reuse prompts instantly.",
};
```

---

---

# 2️⃣ ENTERPRISE METADATA ENGINE

## `/lib/seo/metadata.ts`

```ts
import { SITE } from "./site";

type Props = {
  title?: string;
  description?: string;
  path?: string;
};

export function buildMetadata({ title, description, path = "" }: Props = {}) {
  const url = `${SITE.url}${path}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE.url),

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
```

---

---

# 3️⃣ AUTO PAGE SEO GENERATOR

## `/lib/seo/page.ts`

```ts
import { buildMetadata } from "./metadata";

export function createPageSEO(
  title: string,
  description: string,
  path: string,
) {
  return buildMetadata({
    title,
    description,
    path,
  });
}
```

---

Usage example:

```ts
export const metadata = createPageSEO(
  "Blog",
  "Latest AI productivity articles",
  "/blog",
);
```

---

---

# 4️⃣ JSON-LD ENGINE

## `/lib/seo/schema.ts`

```ts
export function softwareSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PromptsVault",
    applicationCategory: "BrowserApplication",
    operatingSystem: "Chrome",
  };
}

export function articleSchema(post: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
  };
}
```

---

---

# 5️⃣ JSON-LD COMPONENT

## `/components/seo/JsonLd.tsx`

```tsx
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
```

---

Usage:

```tsx
<JsonLd data={softwareSchema()} />
```

---

---

# 6️⃣ GLOBAL ROOT METADATA

## `app/layout.tsx`

```ts
import { SITE } from "@/lib/seo/site";

export const metadata = {
  metadataBase: new URL(SITE.url),

  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },

  description: SITE.description,
};
```

---

---

# 7️⃣ BLOG AUTO SEO (ENTERPRISE PATTERN)

## `app/blog/[slug]/page.tsx`

```ts
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${params.slug}`,
  });
}
```

---

---

# 8️⃣ AUTO DYNAMIC SITEMAP (VERY IMPORTANT)

## `app/sitemap.ts`

```ts
export default async function sitemap() {
  const posts = await getAllPosts();

  const blogUrls = posts.map((p) => ({
    url: `https://www.promptsvault.online/blog/${p.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: "https://www.promptsvault.online",
      lastModified: new Date(),
    },
    ...blogUrls,
  ];
}
```

---

---

# 9️⃣ ROBOTS FILE

## `app/robots.ts`

```ts
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.promptsvault.online/sitemap.xml",
  };
}
```

---

---

# 🔟 ENTERPRISE IMAGE SEO RULE

Always:

```
import Image from "next/image";
```

Never raw `<img>`.

Every image must have:

- descriptive alt
- width
- height

---

---

# 1️⃣1️⃣ PROGRAMMATIC SEO READY PATTERN

To create 100+ landing pages:

```
/app/(seo)/[keyword]/page.tsx
```

Fetch keyword from DB.

Generate:

```
generateMetadata()
```

Automatically.

This enables:

- /ai-prompt-manager
- /ai-prompt-organizer
- /save-ai-prompts

Unlimited SEO pages.

---

---

# 🏆 FINAL RESULT

After installing this starter:

✔ automatic canonical URLs
✔ automatic OG tags
✔ automatic twitter tags
✔ dynamic blog metadata
✔ dynamic sitemap
✔ JSON-LD structured data
✔ programmatic SEO ready
✔ enterprise safe architecture

This is the same structural SEO pattern used in large SaaS platforms.

---

END OF STARTER KIT
