import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react"

export default async function UserDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's prompts statistics
  const { data: prompts } = await supabase.from("prompts").select("*").eq("created_by", user.id)

  const totalPrompts = prompts?.length || 0
  const approvedPrompts = prompts?.filter((p) => p.status === "approved").length || 0
  const pendingPrompts = prompts?.filter((p) => p.status === "pending").length || 0
  const rejectedPrompts = prompts?.filter((p) => p.status === "rejected").length || 0

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's an overview of your prompts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm py-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPrompts}</div>
            <p className="text-xs text-muted-foreground">All your submitted prompts</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-card/50 backdrop-blur-sm py-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{approvedPrompts}</div>
            <p className="text-xs text-muted-foreground">Live on the platform</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/20 bg-card/50 backdrop-blur-sm py-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{pendingPrompts}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-card/50 backdrop-blur-sm py-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{rejectedPrompts}</div>
            <p className="text-xs text-muted-foreground">Not approved</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm py-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with these common tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link
            href="/user/submit"
            className="block p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all cursor-pointer"
          >
            <h3 className="font-semibold text-purple-400">Submit a New Prompt</h3>
            <p className="text-sm text-muted-foreground mt-1">Share your creative AI prompts with the community</p>
          </Link>
          <Link
            href="/user/my-prompts"
            className="block p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all cursor-pointer"
          >
            <h3 className="font-semibold text-purple-400">View My Prompts</h3>
            <p className="text-sm text-muted-foreground mt-1">Manage and edit your submitted prompts</p>
          </Link>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
