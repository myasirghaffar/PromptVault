"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Upload, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface Prompt {
  id: string
  title: string
  description: string | null
  prompt_text: string
  category: string
  tags: string[]
  image_url: string | null
}

interface PromptFormProps {
  prompt?: Prompt | null
  userId?: string
  onSuccess?: (prompt: Prompt) => void
  onCancel?: () => void
  isUserSubmission?: boolean
}

export function PromptForm({ prompt, userId, onSuccess, onCancel, isUserSubmission = false }: PromptFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(prompt?.title || "")
  const [description, setDescription] = useState(prompt?.description || "")
  const [promptText, setPromptText] = useState(prompt?.prompt_text || "")
  const [category, setCategory] = useState(prompt?.category || "")
  const [tags, setTags] = useState(prompt?.tags.join(", ") || "")
  const [imageUrl, setImageUrl] = useState(prompt?.image_url || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(prompt?.image_url || null)

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("prompts").select("category")

      if (data) {
        const uniqueCategories = Array.from(new Set(data.map((p) => p.category).filter(Boolean)))
        setCategories(uniqueCategories)
      }
    }
    fetchCategories()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return imageUrl

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", imageFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      return data.url
    } catch (err) {
      throw new Error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageUrl("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    const supabase = createClient()
    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t)

    const finalCategory = showNewCategory ? newCategory : category

    try {
      let currentUserId = userId
      if (!currentUserId) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("User not authenticated")
        currentUserId = user.id
      }

      let finalImageUrl = imageUrl
      if (imageFile) {
        finalImageUrl = await uploadImage()
      }

      if (prompt) {
        const { data, error } = await supabase
          .from("prompts")
          .update({
            title,
            description: description || null,
            prompt_text: promptText,
            category: finalCategory,
            tags: tagsArray,
            image_url: finalImageUrl || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", prompt.id)
          .select("*, profiles:created_by(username,is_admin)")
          .single()

        if (error) throw error
        if (onSuccess) onSuccess(data)
      } else {
        const { data, error } = await supabase
          .from("prompts")
          .insert({
            title,
            description: description || null,
            prompt_text: promptText,
            category: finalCategory,
            tags: tagsArray,
            image_url: finalImageUrl || null,
            created_by: currentUserId,
            status: isUserSubmission ? "pending" : "approved",
          })
          .select("*, profiles:created_by(username,is_admin)")
          .single()

        if (error) throw error

        if (isUserSubmission) {
          setSuccessMessage("Prompt submitted successfully! It will be reviewed by our team.")
          // Reset form
          setTitle("")
          setDescription("")
          setPromptText("")
          setCategory("")
          setTags("")
          setImageUrl("")
          setImageFile(null)
          setImagePreview(null)
          setShowNewCategory(false)
          setNewCategory("")
          // Redirect to my prompts after 2 seconds
          setTimeout(() => {
            router.push("/dashboard/my-prompts")
          }, 2000)
        } else if (onSuccess) {
          onSuccess(data)
        }
      }
    } catch (err) {
      console.error("[v0] Prompt submission error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (isUserSubmission) {
      router.push("/dashboard")
    } else if (onCancel) {
      onCancel()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter prompt title"
            className="border-purple-500/20 focus:border-purple-500"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the prompt"
            rows={2}
            className="border-purple-500/20 focus:border-purple-500"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="prompt">Prompt Text *</Label>
          <Textarea
            id="prompt"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            required
            placeholder="Enter the full prompt text"
            rows={6}
            className="border-purple-500/20 focus:border-purple-500 font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category *</Label>
            {!showNewCategory ? (
              <div className="space-y-2">
                <Select
                  value={category}
                  onValueChange={(value) => {
                    if (value === "__new__") {
                      setShowNewCategory(true)
                    } else {
                      setCategory(value)
                    }
                  }}
                >
                  <SelectTrigger className="border-purple-500/20 focus:border-purple-500">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="__new__" className="text-purple-400 font-medium">
                      + Add New Category
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category"
                  className="border-purple-500/20 focus:border-purple-500"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setShowNewCategory(false)
                    setNewCategory("")
                  }}
                  className="border-purple-500/30 hover:bg-purple-500/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., cyberpunk, neon, futuristic"
              className="border-purple-500/20 focus:border-purple-500"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="image">Image</Label>
          <div className="space-y-3">
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-purple-500/20">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={clearImage}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border-purple-500/20 focus:border-purple-500 cursor-pointer"
                />
                <Upload className="h-5 w-5 text-purple-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-green-500">{successMessage}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isLoading || uploading}
          className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
        >
          {(isLoading || uploading) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {uploading
            ? "Uploading..."
            : prompt
              ? "Update Prompt"
              : isUserSubmission
                ? "Submit for Review"
                : "Create Prompt"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading || uploading}
          className="border-purple-500/30 hover:bg-purple-500/10 bg-transparent"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
