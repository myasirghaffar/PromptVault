import { createClient } from "@/lib/supabase/server"
import { ApprovalsManager } from "@/components/approvals-manager"

export default async function ApprovalsPage() {
  const supabase = await createClient()

  const { data: pendingPrompts } = await supabase
    .from("prompts")
    .select("*, profiles(email)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Pending Approvals
        </h1>
        <p className="text-muted-foreground mt-2">Review and approve user-submitted prompts.</p>
      </div>

        <ApprovalsManager prompts={pendingPrompts || []} />
      </div>
    </div>
  )
}
