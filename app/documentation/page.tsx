import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const metadata = {
  title: "Documentation - PromptVault",
  description: "Learn how to use PromptVault and get the most out of our platform",
}

export default async function DocumentationPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  let username: string | undefined = undefined
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("is_admin, username").eq("id", user.id).single()
    isAdmin = profile?.is_admin || false
    username = profile?.username || undefined
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/10 flex flex-col">
      <Header user={user} isAdmin={isAdmin} username={username} />

      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent mb-8">
            Documentation
          </h1>

          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Getting Started</h2>
              <p className="mb-4">
                Welcome to PromptVault! This documentation will help you understand how to use our platform effectively.
              </p>
              <p>
                PromptVault is a curated collection of high-quality AI prompts designed to help you get the best results
                from AI tools like ChatGPT, Gemini, and more.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">How to Browse Prompts</h2>
              <p className="mb-4">
                On the home page, you can browse through our collection of prompts. Use the category filter to narrow
                down your search and find exactly what you need.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Click on any prompt card to view the full details</li>
                <li>Copy the prompt text with one click</li>
                <li>Share prompts with others using the share button</li>
                <li>Open prompts directly in ChatGPT or Gemini</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Creating an Account</h2>
              <p className="mb-4">
                To submit your own prompts and access your personal dashboard, create an account by clicking the Sign Up
                button.
              </p>
              <p>
                Once you have an account, you can submit prompts for approval and track their status in your dashboard.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Submitting Prompts</h2>
              <p className="mb-4">
                Users can submit their own prompts through the dashboard. All submitted prompts go through an approval
                process before being published.
              </p>
              <p>Make sure your prompts are clear, well-structured, and provide value to other users.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Need Help?</h2>
              <p>
                If you have any questions or need assistance, please visit our{" "}
                <a href="/contact" className="text-purple-400 hover:text-purple-300">
                  Contact page
                </a>{" "}
                or check out our{" "}
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
  )
}
