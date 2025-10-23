import { BlogForm } from "@/components/blog-form"

export default function CreateBlogPage() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Create New Blog
          </h1>
          <p className="text-muted-foreground mt-2">Write and publish a new blog post</p>
        </div>
        <BlogForm />
      </div>
    </div>
  )
}
