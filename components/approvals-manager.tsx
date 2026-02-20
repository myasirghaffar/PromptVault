"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Eye } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Prompt {
  id: string
  title: string
  description: string | null
  prompt_text: string
  category: string
  tags: string[]
  image_url: string | null
  created_by: string
  created_at: string
  profiles: {
    email: string
  }
}

interface ApprovalsManagerProps {
  prompts: Prompt[]
}

export function ApprovalsManager({ prompts: initialPrompts }: ApprovalsManagerProps) {
  const [prompts, setPrompts] = useState(initialPrompts)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleApprove = async (promptId: string) => {
    setLoading(promptId)
    const { error } = await supabase.from("prompts").update({ status: "approved" }).eq("id", promptId)

    if (error) {
      console.error("Error approving prompt:", error)
    } else {
      setPrompts(prompts.filter((p) => p.id !== promptId))
      router.refresh()
    }
    setLoading(null)
  }

  const handleReject = async (promptId: string) => {
    setLoading(promptId)
    const { error } = await supabase.from("prompts").update({ status: "rejected" }).eq("id", promptId)

    if (error) {
      console.error("Error rejecting prompt:", error)
    } else {
      setPrompts(prompts.filter((p) => p.id !== promptId))
      router.refresh()
    }
    setLoading(null)
  }

  if (prompts.length === 0) {
    return (
      <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No pending prompts to review.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {prompts.map((prompt) => (
        <Card key={prompt.id} className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-xl">{prompt.title}</CardTitle>
                <CardDescription className="mt-2">
                  Submitted by: {prompt.profiles?.email || "Unknown"} on{" "}
                  {new Date(prompt.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                {prompt.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {prompt.image_url && (
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <Image
                  src={prompt.image_url || "/placeholder.svg"}
                  alt={prompt.title}
                  fill
                  className="object-cover"
                  unoptimized={prompt.image_url?.startsWith("http")}
                />
              </div>
            )}

            {prompt.description && (
              <div>
                <h4 className="font-semibold mb-2">Description:</h4>
                <p className="text-muted-foreground">{prompt.description}</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2">Prompt:</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">{prompt.prompt_text}</p>
            </div>

            {prompt.tags.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-purple-500/30 text-purple-400">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => handleApprove(prompt.id)}
                disabled={loading === prompt.id}
                className="flex-1 bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 cursor-pointer"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => handleReject(prompt.id)}
                disabled={loading === prompt.id}
                variant="outline"
                className="flex-1 border-red-500/30 text-red-300 hover:bg-red-500/20 cursor-pointer"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Link href={`/prompt/${prompt.id}`}>
                <Button
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-500/20 cursor-pointer bg-transparent"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
