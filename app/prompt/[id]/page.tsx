import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import { PromptDetail } from "@/components/prompt-detail"

// Revalidate every 60 seconds for fresh content
export const revalidate = 60

interface PromptPageProps {
  params: Promise<{ id: string }>
}

export default async function PromptPage({ params }: PromptPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Parallel data fetching to eliminate waterfall requests
  const [userResult, promptResult] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("prompts").select("*").eq("id", id).single(),
  ])

  const {
    data: { user },
  } = userResult

  // Check if user is admin (only if user exists)
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
    isAdmin = profile?.is_admin || false
  }

  const { data: prompt, error } = promptResult

  if (error || !prompt) {
    notFound()
  }

  // Only show approved prompts to non-admin users
  if (!isAdmin && prompt.status !== "approved") {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-purple-800/10 flex flex-col">
      <Header user={user} isAdmin={isAdmin} />
      <main className="flex-1">
        <PromptDetail prompt={prompt} />
      </main>
      <Footer />
    </div>
  )
}
