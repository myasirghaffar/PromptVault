import { createClient } from "@/lib/supabase/server"

export default async function sitemap() {
  const supabase = await createClient()
  
  // Get all published prompts
  const { data: prompts } = await supabase
    .from("prompts")
    .select("id, updated_at")
    .eq("status", "approved")
    .order("updated_at", { ascending: false })

  // Get all published blogs
  const { data: blogs } = await supabase
    .from("blogs")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://promptvault.vercel.app'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3
    },
    {
      url: `${baseUrl}/documentation`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }
  ]

  // Dynamic prompt pages
  const promptPages = prompts?.map((prompt) => ({
    url: `${baseUrl}/prompt/${prompt.id}`,
    lastModified: new Date(prompt.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  })) || []

  // Dynamic blog pages
  const blogPages = blogs?.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7
  })) || []

  return [...staticPages, ...promptPages, ...blogPages]
}
