import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/")
  }

  const { data: prompts } = await supabase
    .from("prompts")
    .select("id, title, description, prompt_text, category, tags, image_url, created_by, created_at, profiles:created_by(username, is_admin)")
    .order("created_at", { ascending: false })

  return <AdminDashboard prompts={prompts || []} userId={user.id} />
}
