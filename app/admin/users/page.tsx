import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UsersManagement } from "@/components/users-management"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Users Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage user accounts and permissions</p>
        </div>
        <UsersManagement users={profiles || []} />
      </div>
    </div>
  )
}
