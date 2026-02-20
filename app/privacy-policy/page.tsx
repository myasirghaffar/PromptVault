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
    pathname: "/privacy-policy",
    title: "PromptVault Privacy Policy",
    description:
      "Read PromptVault privacy policy and how we collect, process, and safeguard user data across our prompt management platform.",
    h1: "PromptVault Privacy Policy",
    keywords: ["privacy policy", "promptvault privacy", "data protection"],
  });

  return generateSEOMetadata({
    pathname: "/privacy-policy",
    title: seo.title,
    description: seo.description,
    h1: seo.h1,
    keywords: seo.keywords,
    type: "website",
  });
}

export default async function PrivacyPolicyPage() {
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
        title="PromptVault Privacy Policy"
        description="Read PromptVault privacy policy and how we collect, process, and safeguard user data across our prompt management platform."
        canonical="/privacy-policy"
        keywords={["privacy policy", "promptvault privacy", "data protection"]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/privacy-policy" },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/10 flex flex-col">
        <Header user={user} isAdmin={isAdmin} username={username} />

        <main className="container mx-auto px-4 py-12 flex-1">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent mb-8">
              PromptVault Privacy Policy
            </h1>

            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Introduction
                </h2>
                <p>
                  PromptVault operates this website and explains here how personal
                  data is collected, used, and protected.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Information Collection and Use
                </h2>
                <p className="mb-4">
                  We collect information required to provide and improve the
                  service.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Email address</li>
                  <li>Username</li>
                  <li>Usage data and analytics</li>
                  <li>Cookies and related technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Data Usage
                </h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide and maintain the platform</li>
                  <li>Improve product quality and reliability</li>
                  <li>Support customer requests and account security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Contact
                </h2>
                <p>
                  Questions about this policy can be sent through the{" "}
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
