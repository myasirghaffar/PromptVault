import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const metadata = {
  title: "Terms of Service - PromptVault",
  description: "Terms of service for PromptVault",
}

export default async function TermsOfServicePage() {
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
            Terms of Service
          </h1>

          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing and using PromptVault, you accept and agree to be bound by the terms and provision of this
                agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Use License</h2>
              <p className="mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on
                PromptVault for personal, non-commercial transitory viewing only. This is the grant of a license, not a
                transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on PromptVault</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Disclaimer</h2>
              <p>
                The materials on PromptVault are provided on an 'as is' basis. PromptVault makes no warranties,
                expressed or implied, and hereby disclaims and negates all other warranties including, without
                limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Limitations</h2>
              <p>
                In no event shall PromptVault or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on PromptVault.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Accuracy of Materials</h2>
              <p>
                The materials appearing on PromptVault could include technical, typographical, or photographic errors.
                PromptVault does not warrant that any of the materials on its website are accurate, complete, or
                current.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at our{" "}
                <a href="/contact" className="text-purple-400 hover:text-purple-300">
                  Contact page
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
