import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"

// Admin pages should not be cached
export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Parallel fetch for better performance
  const [profileResult, promptsResult] = await Promise.all([
    supabase.from("profiles").select("is_admin").eq("id", user.id).single(),
    supabase
      .from("prompts")
      .select("id, title, description, prompt_text, category, tags, image_url, created_by, created_at, profiles:created_by(username, is_admin)")
      .order("created_at", { ascending: false }),
  ])

  const { data: profile } = profileResult

  if (!profile?.is_admin) {
    redirect("/")
  }

  const { data: prompts } = promptsResult

  return <AdminDashboard prompts={prompts || []} userId={user.id} />
}
