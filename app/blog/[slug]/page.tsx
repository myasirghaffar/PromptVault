import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  generateMetadata as generateSEOMetadata,
  generateAutoSEOContent,
} from "@/lib/seo/metadata-builder";
import { PageSEO } from "@/components/SEO/PageSEO";
import type { Metadata } from "next";
import Image from "next/image";
import { autoInternalLinkHtmlContent } from "@/lib/seo/internal-linking";
import { generateImageAltText } from "@/lib/seo/image-seo";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
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

  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!blog) {
    return generateSEOMetadata({
      pathname: `/blog/${params.slug}`,
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
      noindex: true,
    });
  }

  const seo = generateAutoSEOContent({
    pathname: `/blog/${params.slug}`,
    title: blog.title,
    description: blog.description,
    h1: blog.title,
    keywords:
      blog.keywords?.length > 0
        ? blog.keywords
        : ["ai prompt tutorial", "prompt engineering guide"],
  });

  return generateSEOMetadata({
    pathname: `/blog/${params.slug}`,
    title: seo.title,
    description: seo.description,
    h1: seo.h1,
    keywords: seo.keywords,
    images: blog.featured_image ? [blog.featured_image] : [],
    type: "article",
    publishedTime: blog.created_at,
    modifiedTime: blog.updated_at,
    authors: [blog.profiles?.username || "PromptVault Team"],
    tags: blog.keywords,
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
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

  const { data: blog } = await supabase
    .from("blogs")
    .select("*, profiles:author_id(username,is_admin)")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!blog) {
    notFound();
  }

  // Get user data for header
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

  const formattedDate = new Date(blog.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const linkedBlogContent = autoInternalLinkHtmlContent(blog.content || "");

  const { data: relatedBlogsRaw } = await supabase
    .from("blogs")
    .select("id, slug, title, description, keywords, created_at")
    .eq("status", "published")
    .neq("id", blog.id)
    .order("created_at", { ascending: false })
    .limit(12);

  const relatedBlogs =
    relatedBlogsRaw
      ?.filter((candidate: any) => {
        if (!blog.keywords?.length || !candidate.keywords?.length) return true;
        const current = new Set(
          blog.keywords.map((keyword: string) => keyword.toLowerCase()),
        );
        return candidate.keywords.some((k: string) =>
          current.has(k.toLowerCase()),
        );
      })
      .slice(0, 3) || [];

  return (
    <>
      <PageSEO
        title={blog.title}
        description={blog.description}
        canonical={`/blog/${params.slug}`}
        keywords={blog.keywords}
        images={blog.featured_image ? [blog.featured_image] : []}
        type="article"
        publishedTime={blog.created_at}
        modifiedTime={blog.updated_at}
        authors={[blog.profiles?.username || "PromptVault Team"]}
        tags={blog.keywords}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          {
            name: blog.title,
            url: `/blog/${params.slug}`,
          },
        ]}
        authorData={{
          name: blog.profiles?.username || "PromptVault Team",
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/10 flex flex-col">
        <Header user={user} isAdmin={isAdmin} username={username} />
        <main className="min-h-screen flex-1">
          {/* Header */}
          <div className="border-b border-purple-500/20 bg-card/50 backdrop-blur sticky top-16 z-30">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <Link href="/blog">
                <Button variant="ghost" className="gap-2 cursor-pointer">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blogs
                </Button>
              </Link>
            </div>
          </div>

          {/* Content */}
          <article className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Featured Image */}
              {blog.featured_image && (
                <div className="mb-8 rounded-lg overflow-hidden border border-purple-500/20">
                  <Image
                    src={blog.featured_image}
                    alt={generateImageAltText({
                      title: blog.title,
                      context: "blog featured image",
                    })}
                    width={1200}
                    height={630}
                    className="w-full h-auto max-h-96 object-cover"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    loading="eager"
                    unoptimized={blog.featured_image?.startsWith("http")}
                  />
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                {blog.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-purple-500/20">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{blog.profiles?.username || "Admin"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              {/* Keywords */}
              {blog.keywords && blog.keywords.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-2">
                  {blog.keywords.map((keyword: string) => (
                    <Badge key={keyword} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-8">
                {blog.description}
              </p>

              {/* Content */}
              <div
                className="prose prose-invert max-w-none mb-12 [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_p]:text-base [&_p]:leading-relaxed [&_a]:text-purple-400 [&_a]:hover:text-purple-300 [&_blockquote]:border-l-4 [&_blockquote]:border-purple-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:bg-background/50 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_pre]:bg-background/50 [&_pre]:p-4 [&_pre]:rounded [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6"
                dangerouslySetInnerHTML={{ __html: linkedBlogContent }}
              />

              {relatedBlogs.length > 0 && (
                <section className="mb-12 pt-6 border-t border-purple-500/20">
                  <h2 className="text-2xl font-semibold mb-4">Related posts</h2>
                  <ul className="space-y-3">
                    {relatedBlogs.map((related: any) => (
                      <li key={related.id}>
                        <Link
                          href={`/blog/${related.slug}`}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          {related.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Back Link */}
              <div className="pt-8 border-t border-purple-500/20">
                <Link href="/blog">
                  <Button
                    variant="outline"
                    className="gap-2 cursor-pointer bg-transparent"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to All Blogs
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
}
