import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPromptsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: prompts } = await supabase
    .from("prompts")
    .select(
      "id,title,description,prompt_text,category,tags,image_url,created_by,created_at, profiles:created_by(username,is_admin)",
    )
    .order("created_at", { ascending: false })

  // Transform prompts to match the expected type structure
  // Supabase returns profiles as an array, but we need it as a single object
  const transformedPrompts = prompts?.map((prompt) => ({
    id: prompt.id,
    title: prompt.title,
    description: prompt.description,
    prompt_text: prompt.prompt_text,
    category: prompt.category,
    tags: prompt.tags,
    image_url: prompt.image_url,
    created_at: prompt.created_at,
    created_by: prompt.created_by,
    profiles: Array.isArray(prompt.profiles) 
      ? prompt.profiles[0] || null 
      : prompt.profiles || null,
  })) || []

  return <AdminDashboard prompts={transformedPrompts} userId={user.id} />
}
