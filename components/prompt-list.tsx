"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

interface Prompt {
  id: string
  title: string
  description: string | null
  prompt_text: string
  category: string
  tags: string[]
  image_url: string | null
  created_at: string
  created_by?: string | null
  profiles?: { username: string | null; is_admin: boolean | null } | null
}

interface PromptListProps {
  prompts: Prompt[]
  onEdit: (prompt: Prompt) => void
  onDelete: (promptId: string) => void
}

export function PromptList({ prompts, onEdit, onDelete }: PromptListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (prompt: Prompt) => {
    if (!confirm(`Are you sure you want to delete "${prompt.title}"?`)) {
      return
    }

    setDeletingId(prompt.id)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("prompts").delete().eq("id", prompt.id)

      if (error) throw error
      onDelete(prompt.id)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete prompt")
    } finally {
      setDeletingId(null)
    }
  }

  if (prompts.length === 0) {
    return (
      <Card className="border-purple-500/20 bg-card/50 backdrop-blur-xl py-6">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No prompts yet. Create your first one!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {prompts.map((prompt) => {
        const creatorLabel = prompt?.profiles?.is_admin
          ? "Admin"
          : prompt?.profiles?.username
            ? `@${prompt.profiles.username}`
            : "Unknown"

        return (
          <Card key={prompt.id} className="border-purple-500/20 bg-card/50 backdrop-blur-xl py-6">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl">{prompt.title}</CardTitle>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {prompt.category}
                    </Badge>
                  </div>
                  {prompt.description && <CardDescription>{prompt.description}</CardDescription>}
                  <div className="flex flex-wrap gap-2">
                    {prompt.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-purple-500/30 text-purple-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-2 shrink-0">
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                    {creatorLabel}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(prompt)}
                      className="border-purple-500/30 hover:bg-purple-500/10 cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(prompt)}
                      disabled={deletingId === prompt.id}
                      className="border-red-500/30 hover:bg-red-500/10 text-red-400 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-mono text-xs bg-muted/50 p-3 rounded border border-purple-500/20 line-clamp-3">
                {prompt.prompt_text}
              </pre>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
