import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin, username").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-purple-800/10">
      <Header user={user} isAdmin={true} username={profile?.username || undefined} />
      <div className="flex relative">
        <AdminSidebar />
        <main className="flex-1 ml-0 md:ml-64 min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  )
}
