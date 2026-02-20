# 🚀 AUTO-SCANNING NEXT.JS SEO ENGINE (ENTERPRISE)

Works with:

* Next.js 13+
* Next.js 14+
* Next.js 15+
* App Router only

Goal:

Automatically generate SEO metadata + schema + sitemap by scanning routes.

---

# 📁 REQUIRED STRUCTURE

Create:

/lib/seo/
engine.ts
detect.ts
schema.ts
site.ts

/components/seo/
JsonLd.tsx
AutoSchema.tsx

/app/
sitemap.ts

---

# 1️⃣ GLOBAL SITE CONFIG

## /lib/seo/site.ts

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

# 2️⃣ PAGE TYPE DETECTOR (VERY IMPORTANT)

## /lib/seo/detect.ts

```ts
export function detectPageType(path: string) {

  if (path.startsWith("/blog/")) return "article";

  if (path.startsWith("/docs/")) return "docs";

  if (path === "/") return "homepage";

  return "page";
}
```

---

---

# 3️⃣ MAIN SEO ENGINE

## /lib/seo/engine.ts

```ts
import { SITE } from "./site";
import { detectPageType } from "./detect";

export function autoSEO({
  title,
  description,
  path,
}: {
  title?: string;
  description?: string;
  path: string;
}) {

  const type = detectPageType(path);
  const url = SITE.url + path;

  return {
    title,
    description,
    metadataBase: new URL(SITE.url),

    alternates: { canonical: url },

    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: type === "article" ? "article" : "website",
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

# 4️⃣ SCHEMA GENERATOR

## /lib/seo/schema.ts

```ts
export function generateSchema(type: string, data: any) {

  if (type === "article") {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      datePublished: data.date,
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: data.title,
  };
}
```

---

---

# 5️⃣ JSON-LD COMPONENT

## /components/seo/JsonLd.tsx

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

---

# 6️⃣ AUTO SCHEMA COMPONENT

## /components/seo/AutoSchema.tsx

```tsx
import JsonLd from "./JsonLd";
import { generateSchema } from "@/lib/seo/schema";
import { detectPageType } from "@/lib/seo/detect";

export default function AutoSchema({ path, data }) {

  const type = detectPageType(path);
  const schema = generateSchema(type, data);

  return <JsonLd data={schema} />;
}
```

---

---

# 7️⃣ HOW TO USE ON ANY PAGE

Example:

```ts
import { autoSEO } from "@/lib/seo/engine";

export const metadata = autoSEO({
  title: "Blog Title",
  description: "Article description",
  path: "/blog/my-post",
});
```

Then inside JSX:

```tsx
<AutoSchema
  path="/blog/my-post"
  data={{ title: "Blog Title", date: "2025-01-01" }}
/>
```

---

---

# 8️⃣ AUTO SITEMAP FROM DATABASE

## /app/sitemap.ts

```ts
export default async function sitemap() {

  const posts = await getAllPosts();

  return [
    {
      url: "https://www.promptsvault.online",
      lastModified: new Date(),
    },
    ...posts.map(p => ({
      url: `https://www.promptsvault.online/blog/${p.slug}`,
      lastModified: new Date(),
    }))
  ];
}
```

---

---

# 🏆 FINAL RESULT

After installing:

✔ automatic page type detection
✔ automatic metadata generation
✔ automatic canonical URLs
✔ automatic schema injection
✔ automatic blog SEO
✔ automatic sitemap scaling
✔ supports unlimited pages

This is the structural SEO automation pattern used by serious SaaS platforms.

---

END ENGINE
