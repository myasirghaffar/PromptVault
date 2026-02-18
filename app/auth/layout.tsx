import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // User is already logged in, check if admin and redirect accordingly
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (profile?.is_admin) {
      redirect("/admin/dashboard")
    } else {
      redirect("/user/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-background to-purple-800/20">
      {children}
    </div>
  )
}
