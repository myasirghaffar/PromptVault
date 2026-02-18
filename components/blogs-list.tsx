"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Eye } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

interface Blog {
  id: string;
  title: string;
  slug: string;
  status: string;
  created_at: string;
  profiles?: { username: string; is_admin: boolean };
}

export function BlogsList({ blogs: initialBlogs }: { blogs: Blog[] }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    setIsDeleting(id);
    try {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Failed to delete blog:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  if (blogs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No blogs yet. Create your first blog post!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-background/50 border border-purple-500/10 rounded-lg hover:border-purple-500/20 transition gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h3 className="font-medium text-base sm:text-lg truncate">
                {blog.title}
              </h3>
              <Badge
                variant={blog.status === "published" ? "default" : "secondary"}
                className="w-fit"
              >
                {blog.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                by {blog.profiles?.username || "Unknown"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 truncate">
              /{blog.slug}
            </p>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Link href={`/blog/${blog.slug}`} target="_blank">
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                aria-label="View blog"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/admin/blogs/${blog.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                aria-label="Edit blog"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(blog.id)}
              disabled={isDeleting === blog.id}
              className="cursor-pointer text-red-400 hover:text-red-300"
              aria-label="Delete blog"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
