import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { PageSEO } from "@/components/SEO/PageSEO";
import type { ProgrammaticPageData } from "@/lib/seo/programmatic-pages";
import { autoInternalLinkTextContent } from "@/lib/seo/internal-linking";

interface ProgrammaticLandingPageProps {
  data: ProgrammaticPageData;
}

export async function ProgrammaticLandingPage({
  data,
}: ProgrammaticLandingPageProps) {
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

  return (
    <>
      <PageSEO
        title={data.title}
        description={data.description}
        canonical={`/${data.slug}`}
        keywords={[data.primaryKeyword, ...data.secondaryKeywords]}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: data.h1, url: `/${data.slug}` },
        ]}
        faqs={data.faqs}
        productData={{
          name: data.title,
          description: data.description,
          category: "Software",
          tags: [data.primaryKeyword, ...data.secondaryKeywords],
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/10 flex flex-col">
        <Header user={user} isAdmin={isAdmin} username={username} />

        <main className="container mx-auto px-4 py-12 flex-1">
          <article className="max-w-4xl mx-auto space-y-8">
            <header className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent">
                {data.h1}
              </h1>
              <p className="text-lg text-muted-foreground">{data.intro}</p>
              <p className="text-base text-muted-foreground">
                Get started on the{" "}
                <Link href="/" className="text-purple-400 hover:text-purple-300">
                  PromptVault homepage
                </Link>
                , explore practical tutorials in the{" "}
                <Link
                  href="/blog"
                  className="text-purple-400 hover:text-purple-300"
                >
                  blog
                </Link>
                , and review implementation details in{" "}
                <Link
                  href="/documentation"
                  className="text-purple-400 hover:text-purple-300"
                >
                  documentation
                </Link>
                .
              </p>
            </header>

            {data.sections.map((section) => (
              <section key={section.heading} className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph, idx) => (
                  <p
                    key={`${section.heading}-${idx}`}
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html: autoInternalLinkTextContent(paragraph),
                    }}
                  />
                ))}
              </section>
            ))}

            <section className="space-y-4 pt-2">
              <h2 className="text-2xl font-semibold text-foreground">FAQ</h2>
              {data.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-lg border border-purple-500/20 bg-card/50 p-4"
                >
                  <h3 className="text-lg font-medium text-foreground">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground mt-2">{faq.answer}</p>
                </div>
              ))}
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}
