"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles, LogOut, Shield, BookOpen } from "lucide-react"

interface HeaderProps {
  user: { id: string; email?: string } | null
  isAdmin: boolean
  username?: string
}

export function Header({ user, isAdmin, username }: HeaderProps) {
  const router = useRouter()
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 p-2 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            PromptVault
          </span>
        </Link>

        <nav className="flex items-center gap-2 md:gap-4">
          <Button
            asChild
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hover:bg-purple-500/10 cursor-pointer hidden md:flex"
          >
            <Link href="/blog" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Blog</span>
            </Link>
          </Button>

          {user ? (
            <>
              {isAdmin ? (
                <Button
                  asChild
                  variant="ghost"
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 cursor-pointer"
                >
                  <Link href="/admin">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="">{username ? `@${username}` : "Admin"}</span>
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hover:bg-purple-500/10 cursor-pointer"
                >
                  <Link href="/dashboard">{username ? `@${username}` : "Dashboard"}</Link>
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground hover:bg-purple-500/10 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden md:block"> Logout </span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="hover:bg-purple-500/10 cursor-pointer">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 cursor-pointer"
              >
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
