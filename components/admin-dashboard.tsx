"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { PromptForm } from "@/components/prompt-form"
import { PromptList } from "@/components/prompt-list"

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

interface AdminDashboardProps {
  prompts: Prompt[]
  userId: string
}

export function AdminDashboard({ prompts: initialPrompts, userId }: AdminDashboardProps) {
  const [prompts, setPrompts] = useState(initialPrompts)
  const [isCreating, setIsCreating] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)

  const handleCreate = () => {
    setEditingPrompt(null)
    setIsCreating(true)
  }

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt)
    setIsCreating(true)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingPrompt(null)
  }

  const handleSuccess = (prompt: Prompt) => {
    if (editingPrompt) {
      // Update existing prompt
      setPrompts(prompts.map((p) => (p.id === prompt.id ? prompt : p)))
    } else {
      // Add new prompt
      setPrompts([prompt, ...prompts])
    }
    setIsCreating(false)
    setEditingPrompt(null)
  }

  const handleDelete = (promptId: string) => {
    setPrompts(prompts.filter((p) => p.id !== promptId))
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Manage your AI prompts collection</p>
          </div>
          {!isCreating && (
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden md:block">New Prompt</span>
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm py-6">
            <CardHeader className="pb-3">
              <CardDescription>Total Prompts</CardDescription>
              <CardTitle className="text-3xl text-purple-400">{prompts.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm py-6">
            <CardHeader className="pb-3">
              <CardDescription>Categories</CardDescription>
              <CardTitle className="text-3xl text-purple-400">{new Set(prompts.map((p) => p.category)).size}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm py-6">
            <CardHeader className="pb-3">
              <CardDescription>Total Tags</CardDescription>
              <CardTitle className="text-3xl text-purple-400">{new Set(prompts.flatMap((p) => p.tags)).size}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Form or List */}
        {isCreating ? (
          <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm py-6">
            <CardHeader>
              <CardTitle>{editingPrompt ? "Edit Prompt" : "Create New Prompt"}</CardTitle>
              <CardDescription>
                {editingPrompt ? "Update the prompt details below" : "Fill in the details to create a new prompt"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PromptForm prompt={editingPrompt} userId={userId} onSuccess={handleSuccess} onCancel={handleCancel} />
            </CardContent>
          </Card>
        ) : (
          <PromptList prompts={prompts} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}
