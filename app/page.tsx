import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { HomeClient } from "@/components/home-client";
import { Footer } from "@/components/footer";
import {
  generateMetadata as generateSEOMetadata,
  generateAutoSEOContent,
} from "@/lib/seo/metadata-builder";
import { PageSEO } from "@/components/SEO/PageSEO";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const seo = generateAutoSEOContent({
    pathname: "/",
    title: "AI Prompt Manager and AI Prompt Organizer",
    description:
      "Use PromptVault as your AI prompt manager, AI prompt organizer, and reusable prompts system for teams and creators.",
    h1: "AI Prompt Manager for High-Performing AI Workflows",
    keywords: [
      "ai prompt manager",
      "ai prompt organizer",
      "save ai prompts",
      "prompt productivity tool",
      "reusable prompts system",
    ],
  });

  return generateSEOMetadata({
    pathname: "/",
    title: seo.title,
    description: seo.description,
    h1: seo.h1,
    keywords: seo.keywords,
    type: "website",
  });
}
export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  let username: string | undefined = undefined;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin, username")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.is_admin || false;
    username = profile?.username || undefined;
  }

  const { data: prompts } = await supabase
    .from("prompts")
    .select(
      "id, title, description, prompt_text, category, tags, image_url, profiles:created_by(username, is_admin)",
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  // Transform prompts to match the expected type structure
  // Supabase returns profiles as an array, but we need it as a single object
  const transformedPrompts =
    prompts?.map((prompt: any) => ({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      prompt_text: prompt.prompt_text,
      category: prompt.category,
      tags: prompt.tags,
      image_url: prompt.image_url,
      profiles: Array.isArray(prompt.profiles)
        ? (prompt.profiles[0] as
            | { username?: string | null; is_admin?: boolean | null }
            | undefined) || undefined
        : (prompt.profiles as
            | { username?: string | null; is_admin?: boolean | null }
            | undefined) || undefined,
    })) || [];

  const categories = Array.from(
    new Set(transformedPrompts.map((p: any) => p.category)),
  );

  return (
    <>
      <PageSEO
        title="AI Prompt Manager and AI Prompt Organizer"
        description="Use PromptVault as your AI prompt manager, AI prompt organizer, and reusable prompts system for teams and creators."
        canonical="/"
        keywords={[
          "ai prompt manager",
          "ai prompt organizer",
          "save ai prompts",
          "prompt productivity tool",
          "reusable prompts system",
        ]}
        breadcrumbs={[{ name: "Home", url: "/" }]}
        productData={{
          name: "PromptVault Prompt Manager",
          description:
            "SaaS prompt manager for organizing, saving, and sharing reusable prompts.",
          category: "Software",
          tags: [
            "prompt manager",
            "ai prompt manager",
            "ai prompt organizer",
          ],
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-purple-800/10 flex flex-col">
        <Header user={user} isAdmin={isAdmin} username={username} />

        <main className="container mx-auto px-4 py-12 flex-1">
          {/* Hero Section */}
          <section className="text-center mb-12 space-y-4">
            <div className="mx-auto relative w-20 h-20 mb-4">
              <Image
                src="/icons/icon-512x512.svg"
                alt="PromptVault prompt manager logo"
                fill
                priority
                sizes="80px"
                className="object-contain"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent animate-fade-in">
              AI Prompt Manager for High-Performing AI Workflows
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Organize, save, and reuse prompts with an AI prompt organizer
              designed for creators, teams, and growth-focused SaaS workflows.
            </p>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto">
              Need practical guidance? Explore our{" "}
              <Link href="/blog" className="text-purple-400 hover:text-purple-300">
                prompt engineering tutorials
              </Link>{" "}
              and discover feature walkthroughs in{" "}
              <Link
                href="/documentation"
                className="text-purple-400 hover:text-purple-300"
              >
                documentation
              </Link>
              .
            </p>
            <nav
              aria-label="Core prompt management topics"
              className="pt-2 flex flex-wrap justify-center gap-4 text-sm"
            >
              <Link
                href="/ai-prompt-manager"
                className="text-purple-400 hover:text-purple-300"
              >
                AI prompt manager
              </Link>
              <Link
                href="/ai-prompt-organizer"
                className="text-purple-400 hover:text-purple-300"
              >
                AI prompt organizer
              </Link>
              <Link
                href="/save-ai-prompts"
                className="text-purple-400 hover:text-purple-300"
              >
                Save AI prompts
              </Link>
              <Link
                href="/prompt-productivity-tool"
                className="text-purple-400 hover:text-purple-300"
              >
                Prompt productivity tool
              </Link>
              <Link
                href="/reusable-prompts-system"
                className="text-purple-400 hover:text-purple-300"
              >
                Reusable prompts system
              </Link>
            </nav>
          </section>

          <HomeClient prompts={transformedPrompts} categories={categories} />
        </main>

        <Footer />
      </div>
    </>
  );
}
