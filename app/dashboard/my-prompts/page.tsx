import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

export default async function MyPromptsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: prompts } = await supabase
    .from("prompts")
    .select("*")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          My Prompts
        </h1>
        <p className="text-muted-foreground mt-2">View and manage all your submitted prompts.</p>
      </div>

      {prompts && prompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <Link key={prompt.id} href={`/prompt/${prompt.id}`} className="cursor-pointer">
              <Card className="group h-full overflow-hidden border-purple-500/20 bg-card/50 backdrop-blur-sm hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 py-6">
                {prompt.image_url && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={prompt.image_url || "/placeholder.svg"}
                      alt={prompt.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized={prompt.image_url?.startsWith("http")}
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg group-hover:text-purple-400 transition-colors line-clamp-2">
                      {prompt.title}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className={
                        prompt.status === "approved"
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : prompt.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                            : "bg-red-500/20 text-red-300 border-red-500/30"
                      }
                    >
                      {prompt.status}
                    </Badge>
                  </div>
                  {prompt.description && (
                    <CardDescription className="line-clamp-2 text-muted-foreground">
                      {prompt.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                    {prompt.category}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm py-6">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">You haven't submitted any prompts yet.</p>
            <Link
              href="/dashboard/submit"
              className="inline-block mt-4 text-purple-400 hover:text-purple-300 cursor-pointer"
            >
              Submit your first prompt →
            </Link>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  )
}
