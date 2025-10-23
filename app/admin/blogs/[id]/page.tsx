import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { BlogForm } from "@/components/blog-form"
import { notFound } from "next/navigation"

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  if (params.id === "create") {
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

  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      },
    },
  })

  const { data: blog } = await supabase.from("blogs").select("*").eq("id", params.id).single()

  if (!blog) {
    notFound()
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Edit Blog
          </h1>
          <p className="text-muted-foreground mt-2">Update your blog post</p>
        </div>
        <BlogForm blog={blog} />
      </div>
    </div>
  )
}
