"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserClient } from "@supabase/ssr"
import { Loader2, Upload, Bold, Italic, List, LinkIcon } from "lucide-react"
import Image from "next/image"

interface BlogFormProps {
  blog?: any
  onSuccess?: () => void
  onCancel?: () => void
}

export function BlogForm({ blog, onSuccess, onCancel }: BlogFormProps) {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const [userId, setUserId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: blog?.title || "",
    slug: blog?.slug || "",
    description: blog?.description || "",
    keywords: blog?.keywords?.join(", ") || "",
    content: blog?.content || "",
    featured_image: blog?.featured_image || "",
    status: blog?.status || "draft",
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(blog?.featured_image || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getCurrentUser()
  }, [supabase.auth])

  useEffect(() => {
    if (formData.title && !blog) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }, [formData.title, blog])

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

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const data = await response.json()
    return data.url
  }

  const insertFormatting = (before: string, after = "") => {
    const textarea = document.getElementById("content-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = formData.content.substring(start, end)
    const newContent =
      formData.content.substring(0, start) + before + selectedText + after + formData.content.substring(end)

    setFormData((prev) => ({ ...prev, content: newContent }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!userId) {
        throw new Error("User not authenticated")
      }

      let imageUrl = formData.featured_image

      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const keywords = formData.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k)

      const blogData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        keywords,
        content: formData.content,
        featured_image: imageUrl,
        status: formData.status,
        author_id: userId,
      }

      if (blog) {
        const { error: updateError } = await supabase
          .from("blogs")
          .update(blogData)
          .eq("id", blog.id)
          .select("*, profiles:author_id(username,is_admin)")
          .single()

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from("blogs")
          .insert([blogData])
          .select("*, profiles:author_id(username,is_admin)")
          .single()

        if (insertError) throw insertError
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/admin/blogs")
      }
    } catch (err: any) {
      setError(err.message || "Failed to save blog")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="border-purple-500/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>{blog ? "Edit Blog" : "Create New Blog"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">{error}</div>
            )}

            {/* Featured Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Featured Image</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-input"
                  />
                  <label
                    htmlFor="image-input"
                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-purple-500/30 rounded-lg cursor-pointer hover:border-purple-500/50 transition"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">Click to upload image</span>
                  </label>
                </div>
                {imagePreview && (
                  <div className="w-32 h-32 rounded-lg overflow-hidden border border-purple-500/20">
                    <Image
                      src={imagePreview || "/icons/icon-512x512.svg"}
                      alt={`${formData.title || "Blog"} featured image preview`}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      unoptimized={imagePreview.startsWith("data:")}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Blog Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter blog title"
                required
                className="bg-background/50 border-purple-500/20"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-sm font-medium">URL Slug *</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="auto-generated-slug"
                required
                className="bg-background/50 border-purple-500/20"
              />
            </div>

            {/* Description (Meta Description) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Description (SEO) *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description for search engines (150-160 characters)"
                maxLength={160}
                required
                className="w-full p-2 bg-background/50 border border-purple-500/20 rounded text-sm resize-none"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">{formData.description.length}/160 characters</p>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Keywords (SEO)</label>
              <Input
                value={formData.keywords}
                onChange={(e) => setFormData((prev) => ({ ...prev, keywords: e.target.value }))}
                placeholder="keyword1, keyword2, keyword3"
                className="bg-background/50 border-purple-500/20"
              />
              <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Blog Content *</label>
              <div className="bg-background/50 border border-purple-500/20 rounded-lg overflow-hidden">
                {/* Formatting Toolbar */}
                <div className="flex gap-1 p-2 border-b border-purple-500/20 bg-background/30 flex-wrap">
                  <button
                    type="button"
                    onClick={() => insertFormatting("<strong>", "</strong>")}
                    className="p-2 hover:bg-purple-500/20 rounded transition"
                    title="Bold"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("<em>", "</em>")}
                    className="p-2 hover:bg-purple-500/20 rounded transition"
                    title="Italic"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("<h2>", "</h2>")}
                    className="p-2 hover:bg-purple-500/20 rounded transition text-sm font-bold"
                    title="Heading"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("<ul>\n<li>", "</li>\n</ul>")}
                    className="p-2 hover:bg-purple-500/20 rounded transition"
                    title="List"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('<a href="', '">link</a>')}
                    className="p-2 hover:bg-purple-500/20 rounded transition"
                    title="Link"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("<p>", "</p>")}
                    className="p-2 hover:bg-purple-500/20 rounded transition text-sm"
                    title="Paragraph"
                  >
                    P
                  </button>
                </div>
                <textarea
                  id="content-editor"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog content here... You can use HTML tags for formatting."
                  required
                  className="w-full p-4 bg-transparent border-0 resize-none focus:outline-none text-sm"
                  rows={12}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Supports HTML formatting. Use the toolbar buttons or type HTML tags directly.
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full p-2 bg-background/50 border border-purple-500/20 rounded text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 py-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : blog ? (
                  "Update Blog"
                ) : (
                  "Create Blog"
                )}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
