import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateFAQSchema,
  generateProductSchema,
} from "../../lib/seo/metadata-builder";

interface StructuredDataProps {
  type?:
    | "organization"
    | "website"
    | "breadcrumb"
    | "article"
    | "faq"
    | "product";
  data?: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let schema: any = {};

  switch (type) {
    case "organization":
      schema = generateOrganizationSchema();
      break;
    case "website":
      schema = generateWebsiteSchema();
      break;
    case "breadcrumb":
      schema = generateBreadcrumbSchema(data);
      break;
    case "article":
      schema = generateArticleSchema(data);
      break;
    case "faq":
      schema = generateFAQSchema(data);
      break;
    case "product":
      schema = generateProductSchema(data);
      break;
    default:
      return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 0),
      }}
    />
  );
}

interface PageSEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  images?: string[];
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  productData?: {
    name: string;
    description: string;
    imageUrl?: string;
    category: string;
    tags?: string[];
  };
}

export function PageSEO({
  title,
  description,
  canonical,
  images,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  breadcrumbs,
  faqs,
  productData,
}: PageSEOProps) {
  return (
    <>
      {/* Organization Schema - Always included */}
      <StructuredData type="organization" />

      {/* Website Schema - Always included */}
      <StructuredData type="website" />

      {/* Breadcrumb Schema - Conditional */}
      {breadcrumbs && <StructuredData type="breadcrumb" data={breadcrumbs} />}

      {/* Article Schema - Conditional */}
      {type === "article" && publishedTime && (
        <StructuredData
          type="article"
          data={{
            title,
            description,
            url: canonical,
            imageUrl: images?.[0],
            publishedTime,
            modifiedTime,
            author: authors?.[0] || "PromptVault Team",
            keywords: tags,
          }}
        />
      )}

      {/* FAQ Schema - Conditional */}
      {faqs && <StructuredData type="faq" data={faqs} />}

      {/* Product Schema - Conditional */}
      {productData && <StructuredData type="product" data={productData} />}
    </>
  );
}
