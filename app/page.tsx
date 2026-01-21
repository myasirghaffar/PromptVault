import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { HomeClient } from "@/components/home-client"
import { Footer } from "@/components/footer"

export default async function HomePage() {
  const supabase = await createClient()
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

  const { data: prompts } = await supabase
    .from("prompts")
    .select("id, title, description, prompt_text, category, tags, image_url, profiles:created_by(username, is_admin)")
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  // Transform prompts to match the expected type structure
  // Supabase returns profiles as an array, but we need it as a single object
  const transformedPrompts = prompts?.map((prompt: any) => ({
    id: prompt.id,
    title: prompt.title,
    description: prompt.description,
    prompt_text: prompt.prompt_text,
    category: prompt.category,
    tags: prompt.tags,
    image_url: prompt.image_url,
    profiles: Array.isArray(prompt.profiles) 
      ? (prompt.profiles[0] as { username?: string | null; is_admin?: boolean | null } | undefined) || undefined
      : (prompt.profiles as { username?: string | null; is_admin?: boolean | null } | undefined) || undefined,
  })) || []

  const categories = Array.from(new Set(transformedPrompts.map((p) => p.category)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-purple-800/10 flex flex-col">
      <Header user={user} isAdmin={isAdmin} username={username} />

      <main className="container mx-auto px-4 py-12 flex-1">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Discover Amazing AI Prompts
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse our curated collection of high-quality prompts for Gemini APP, ChatGPT and more
          </p>
        </div>

        <HomeClient prompts={transformedPrompts} categories={categories} />
      </main>

      <Footer />
    </div>
  )
}
