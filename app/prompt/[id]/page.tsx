import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import { PromptDetail } from "@/components/prompt-detail";
import type { Metadata } from "next";
import {
  generateMetadata as generateSEOMetadata,
  generateAutoSEOContent,
} from "@/lib/seo/metadata-builder";
import { PageSEO } from "@/components/SEO/PageSEO";

interface PromptPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PromptPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: prompt } = await supabase
    .from("prompts")
    .select("id, title, description, tags, image_url, status")
    .eq("id", id)
    .eq("status", "approved")
    .single();

  if (!prompt) {
    return generateSEOMetadata({
      pathname: `/prompt/${id}`,
      title: "Prompt Not Found",
      description: "The requested prompt could not be found.",
      noindex: true,
    });
  }

  const seo = generateAutoSEOContent({
    pathname: `/prompt/${id}`,
    title: `${prompt.title} Prompt`,
    description:
      prompt.description ||
      "Reusable AI prompt template to improve output quality and productivity.",
    h1: prompt.title,
    keywords: prompt.tags || [],
  });

  return generateSEOMetadata({
    pathname: `/prompt/${id}`,
    title: seo.title,
    description: seo.description,
    h1: seo.h1,
    keywords: seo.keywords,
    images: prompt.image_url ? [prompt.image_url] : [],
    type: "article",
  });
}

export default async function PromptPage({ params }: PromptPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user is admin
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.is_admin || false;
  }

  // Get prompt with user info
  const { data: prompt, error } = await supabase
    .from("prompts")
    .select("*, profiles:created_by(username, is_admin)")
    .eq("id", id)
    .single();

  if (error || !prompt) {
    notFound();
  }

  // Get prompt creator username
  const promptCreatorUsername = Array.isArray(prompt.profiles)
    ? prompt.profiles[0]?.username
    : prompt.profiles?.username;

  return (
    <>
      <PageSEO
        title={`${prompt.title} Prompt`}
        description={
          prompt.description ||
          "Reusable AI prompt template to improve output quality and productivity."
        }
        canonical={`/prompt/${id}`}
        keywords={prompt.tags || []}
        images={prompt.image_url ? [prompt.image_url] : []}
        type="article"
        publishedTime={prompt.created_at}
        modifiedTime={prompt.updated_at}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Prompt", url: `/prompt/${id}` },
        ]}
        productData={{
          name: prompt.title,
          description:
            prompt.description ||
            "Reusable AI prompt template for prompt productivity and quality.",
          imageUrl: prompt.image_url || undefined,
          category: prompt.category,
          tags: prompt.tags,
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-purple-800/10 flex flex-col">
        <Header user={user} isAdmin={isAdmin} username={promptCreatorUsername} />
        <main className="flex-1">
          <PromptDetail prompt={prompt} />
        </main>
        <Footer />
      </div>
    </>
  );
}
