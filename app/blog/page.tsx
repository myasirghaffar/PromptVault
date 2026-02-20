import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  generateMetadata as generateSEOMetadata,
  generateAutoSEOContent,
} from "@/lib/seo/metadata-builder";
import { PageSEO } from "@/components/SEO/PageSEO";
import type { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const seo = generateAutoSEOContent({
    pathname: "/blog",
    title: "AI Prompt Tutorials and Prompt Engineering Guides",
    description:
      "Read AI prompt tutorials, growth playbooks, and prompt engineering best practices for modern LLM tools.",
    h1: "AI Prompt Tutorials and Prompt Engineering Guides",
    keywords: [
      "ai prompt tutorial",
      "prompt engineering guide",
      "llm tutorials",
      "ai prompts blog",
    ],
  });

  return generateSEOMetadata({
    pathname: "/blog",
    title: seo.title,
    description: seo.description,
    h1: seo.h1,
    keywords: seo.keywords,
    type: "website",
  });
}

export default async function BlogsPage() {
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

  const { data: blogs } = await supabase
    .from("blogs")
    .select("*, profiles:author_id(username,is_admin)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageSEO
        title="AI Prompt Tutorials and Prompt Engineering Guides"
        description="Read AI prompt tutorials, growth playbooks, and prompt engineering best practices for modern LLM tools."
        canonical="/blog"
        keywords={[
          "ai prompt tutorial",
          "prompt engineering guide",
          "llm tutorials",
          "ai prompts blog",
        ]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/10 flex flex-col">
        <Header user={user} isAdmin={isAdmin} username={username} />

        <main className="min-h-screen flex-1">
          {/* Hero Section */}
          <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent mb-4">
                Blog & Resources
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover tips, tricks, and best practices for using AI prompts
                effectively
              </p>
            </div>
          </section>

          {/* Blogs Grid */}
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {blogs && blogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((blog: any) => (
                    <Link key={blog.id} href={`/blog/${blog.slug}`}>
                      <Card className="h-full border-purple-500/20 bg-card/50 backdrop-blur hover:border-purple-500/40 transition-all cursor-pointer group overflow-hidden">
                        {/* Featured Image */}
                        {blog.featured_image && (
                          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-500/20 to-purple-600/20">
                            <Image
                              src={blog.featured_image || "/icons/icon-512x512.svg"}
                              alt={`${blog.title} featured image`}
                              fill
                              sizes="(max-width: 1024px) 100vw, 33vw"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                              unoptimized={blog.featured_image?.startsWith("http")}
                            />
                          </div>
                        )}

                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-purple-300 transition">
                                {blog.title}
                              </h3>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {blog.description}
                            </p>

                            {blog.keywords && blog.keywords.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {blog.keywords
                                  .slice(0, 2)
                                  .map((keyword: string) => (
                                    <Badge
                                      key={keyword}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {keyword}
                                    </Badge>
                                  ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-purple-500/10">
                              <span className="text-xs text-muted-foreground">
                                by {blog.profiles?.username || "Admin"}
                              </span>
                              <ArrowRight className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No blog posts yet. Check back soon!
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
