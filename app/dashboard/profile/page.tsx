import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Profile
        </h1>
        <p className="text-muted-foreground mt-2">Manage your account information.</p>
      </div>

      <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm py-6">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Username</label>
            <p className="text-lg">@{profile?.username}</p>
          </div>
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-lg">{user.email}</p>
          </div>
          {/* User ID */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">User ID</label>
            <p className="text-sm font-mono text-muted-foreground">{user.id}</p>
          </div>
          {/* Account Type */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Account Type</label>
            <p className="text-lg">{profile?.is_admin ? "Admin" : "User"}</p>
          </div>
          {/* Member Since */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Member Since</label>
            <p className="text-lg">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
