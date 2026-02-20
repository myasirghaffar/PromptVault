import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Metadata } from "next";
import {
  generateMetadata as generateSEOMetadata,
  generateAutoSEOContent,
} from "@/lib/seo/metadata-builder";
import { PageSEO } from "@/components/SEO/PageSEO";

export async function generateMetadata(): Promise<Metadata> {
  const seo = generateAutoSEOContent({
    pathname: "/contact",
    title: "Contact PromptVault",
    description:
      "Contact PromptVault for product support, SEO partnerships, prompt management questions, and enterprise workflow guidance.",
    h1: "Contact PromptVault",
    keywords: ["contact promptvault", "prompt manager support", "seo support"],
  });

  return generateSEOMetadata({
    pathname: "/contact",
    title: seo.title,
    description: seo.description,
    h1: seo.h1,
    keywords: seo.keywords,
    type: "website",
  });
}

export default async function ContactPage() {
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
        title="Contact PromptVault"
        description="Contact PromptVault for product support, SEO partnerships, prompt management questions, and enterprise workflow guidance."
        canonical="/contact"
        keywords={["contact promptvault", "prompt manager support", "seo support"]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/10 flex flex-col">
        <Header user={user} isAdmin={isAdmin} username={username} />

        <main className="container mx-auto px-4 py-12 flex-1">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent mb-4 text-center">
              Contact PromptVault
            </h1>
            <p className="text-center text-muted-foreground mb-12">
              Have a question or feedback? Send us a message and our team will
              respond as soon as possible.
            </p>

            <form className="space-y-6 border border-purple-500/20 rounded-lg p-8 bg-card/50 backdrop-blur">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="bg-background/50 border-purple-500/20 focus:border-purple-500/50"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="bg-background/50 border-purple-500/20 focus:border-purple-500/50"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Subject
                </label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="What is this about?"
                  className="bg-background/50 border-purple-500/20 focus:border-purple-500/50"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Your message here..."
                  rows={6}
                  className="bg-background/50 border-purple-500/20 focus:border-purple-500/50"
                  required
                />
              </div>

              <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800">
                Send Message
              </Button>
            </form>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-muted-foreground">support@promptvault.com</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">
                  Response Time
                </h3>
                <p className="text-muted-foreground">24-48 hours</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">Location</h3>
                <p className="text-muted-foreground">Worldwide</p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
