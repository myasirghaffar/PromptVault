import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  generateMetadata as generateSEOMetadata,
  generateAutoSEOContent,
} from "@/lib/seo/metadata-builder";
import { getProgrammaticPageData } from "@/lib/seo/programmatic-pages";
import { ProgrammaticLandingPage } from "@/components/SEO/ProgrammaticLandingPage";

const slug = "reusable-prompts-system";

export async function generateMetadata(): Promise<Metadata> {
  const data = getProgrammaticPageData(slug);
  if (!data) {
    return generateSEOMetadata({
      pathname: `/${slug}`,
      title: "Page Not Found",
      description: "The requested page could not be found.",
      noindex: true,
    });
  }

  const seo = generateAutoSEOContent({
    pathname: `/${slug}`,
    title: data.title,
    description: data.description,
    h1: data.h1,
    keywords: [data.primaryKeyword, ...data.secondaryKeywords],
  });

  return generateSEOMetadata({
    pathname: `/${slug}`,
    title: seo.title,
    description: seo.description,
    h1: seo.h1,
    keywords: seo.keywords,
    type: "website",
  });
}

export default async function ReusablePromptsSystemPage() {
  const data = getProgrammaticPageData(slug);
  if (!data) notFound();
  return <ProgrammaticLandingPage data={data} />;
}
