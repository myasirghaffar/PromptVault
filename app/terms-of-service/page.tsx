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
    pathname: "/terms-of-service",
    title: "PromptVault Terms of Service",
    description:
      "Read PromptVault terms of service governing the use of our prompt manager and AI prompt organizer platform.",
    h1: "PromptVault Terms of Service",
    keywords: ["terms of service", "promptvault legal", "prompt platform terms"],
  });

  return generateSEOMetadata({
    pathname: "/terms-of-service",
    title: seo.title,
    description: seo.description,
    h1: seo.h1,
    keywords: seo.keywords,
    type: "website",
  });
}

export default async function TermsOfServicePage() {
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
        title="PromptVault Terms of Service"
        description="Read PromptVault terms of service governing the use of our prompt manager and AI prompt organizer platform."
        canonical="/terms-of-service"
        keywords={["terms of service", "promptvault legal", "prompt platform terms"]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Terms of Service", url: "/terms-of-service" },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/10 flex flex-col">
        <Header user={user} isAdmin={isAdmin} username={username} />

        <main className="container mx-auto px-4 py-12 flex-1">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent mb-8">
              PromptVault Terms of Service
            </h1>

            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  1. Agreement to Terms
                </h2>
                <p>
                  By accessing and using PromptVault, you agree to these terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  2. Use License
                </h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>No unauthorized copying or redistribution</li>
                  <li>No reverse engineering of the platform</li>
                  <li>No misuse of proprietary or copyrighted materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  3. Disclaimer
                </h2>
                <p>
                  The service is provided as-is without warranties of any kind.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  4. Contact
                </h2>
                <p>
                  Questions can be submitted on the{" "}
                  <a href="/contact" className="text-purple-400 hover:text-purple-300">
                    contact page
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
