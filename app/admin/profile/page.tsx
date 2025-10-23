import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Mail, Calendar, User } from "lucide-react"

export default async function AdminProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-2">View your account information</p>
        </div>

        <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm py-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Profile Information
            {profile?.is_admin && (
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Your account details and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <User className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-muted-foreground">Username</p>
              <p className="font-medium">@{profile?.username}</p>
            </div>
          </div>
          {/* Email */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Mail className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          {/* Member Since */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Calendar className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
          {/* Role */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Shield className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium">{profile?.is_admin ? "Administrator" : "User"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
