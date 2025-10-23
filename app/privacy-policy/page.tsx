import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const metadata = {
  title: "Privacy Policy - PromptVault",
  description: "Privacy policy for PromptVault",
}

export default async function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>

          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
              <p>
                PromptVault ("we", "our", or "us") operates the PromptVault website. This page informs you of our
                policies regarding the collection, use, and disclosure of personal data when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Information Collection and Use</h2>
              <p className="mb-4">
                We collect several different types of information for various purposes to provide and improve our
                service to you.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email address</li>
                <li>Username</li>
                <li>Usage data and analytics</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Use of Data</h2>
              <p className="mb-4">PromptVault uses the collected data for various purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To allow you to participate in interactive features</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Security of Data</h2>
              <p>
                The security of your data is important to us but remember that no method of transmission over the
                Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable
                means to protect your personal data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at our{" "}
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
