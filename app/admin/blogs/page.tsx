import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { BlogsList } from "@/components/blogs-list"

export default async function AdminBlogsPage() {
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

  const { data: blogs } = await supabase
    .from("blogs")
    .select("*, profiles:author_id(username,is_admin)")
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Blogs
            </h1>
            <p className="text-muted-foreground mt-2">Manage your blog posts</p>
          </div>
        <Link href="/admin/blogs/create">
          <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Blog
          </Button>
        </Link>
      </div>

        <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>All Blogs</CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <BlogsList blogs={blogs || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
