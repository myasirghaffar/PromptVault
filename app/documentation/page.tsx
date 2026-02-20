import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import {
  generateMetadata as generateSEOMetadata,
  generateAutoSEOContent,
} from "@/lib/seo/metadata-builder";
import { PageSEO } from "@/components/SEO/PageSEO";

export async function generateMetadata(): Promise<Metadata> {
  const seo = generateAutoSEOContent({
    pathname: "/documentation",
    title: "PromptVault Documentation",
    description:
      "Learn PromptVault workflows for organizing prompts, improving team productivity, and scaling reusable AI prompt operations.",
    h1: "PromptVault Documentation",
    keywords: [
      "promptvault documentation",
      "prompt manager guide",
      "ai prompt organizer docs",
      "prompt productivity workflows",
    ],
  });

  return generateSEOMetadata({
    pathname: "/documentation",
    title: seo.title,
    description: seo.description,
    h1: seo.h1,
    keywords: seo.keywords,
    type: "website",
  });
}

export default async function DocumentationPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

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

  return (
    <>
      <PageSEO
        title="PromptVault Documentation"
        description="Learn PromptVault workflows for organizing prompts, improving team productivity, and scaling reusable AI prompt operations."
        canonical="/documentation"
        keywords={[
          "promptvault documentation",
          "prompt manager guide",
          "ai prompt organizer docs",
          "prompt productivity workflows",
        ]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Documentation", url: "/documentation" },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/10 flex flex-col">
        <Header user={user} isAdmin={isAdmin} username={username} />

        <main className="container mx-auto px-4 py-12 flex-1">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent mb-8">
              PromptVault Documentation
            </h1>

            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Getting Started
                </h2>
                <p className="mb-4">
                  Welcome to PromptVault. This guide explains how to use the
                  platform as a prompt manager and AI prompt organizer.
                </p>
                <p>
                  PromptVault helps you save AI prompts, organize reusable
                  prompt workflows, and improve output consistency across teams.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  How to Browse Prompts
                </h2>
                <p className="mb-4">
                  On the homepage, browse approved prompts and filter by
                  category to find the best prompt for your task.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Open any prompt card to view details</li>
                  <li>Copy prompt text in one click</li>
                  <li>Share links with your team</li>
                  <li>Open prompts directly in your preferred AI assistant</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Account and Submissions
                </h2>
                <p className="mb-4">
                  Create an account to submit prompts, track approval, and build
                  your personal prompt library.
                </p>
                <p>
                  Submitted prompts are reviewed before publishing to maintain
                  quality and relevance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Need Help?
                </h2>
                <p>
                  Visit our{" "}
                  <a href="/contact" className="text-purple-400 hover:text-purple-300">
                    contact page
                  </a>{" "}
                  or review the{" "}
                  <a href="/faq" className="text-purple-400 hover:text-purple-300">
                    FAQ
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
