"use client"

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Sparkles,
  LogOut,
  Shield,
  BookOpen,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  user: { id: string; email?: string } | null;
  isAdmin: boolean;
  username?: string;
}

export function Header({ user, isAdmin, username }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if user is on dashboard screens
  const isDashboardScreen =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/user") ||
    pathname?.startsWith("/admin");

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Redirect to home page after logout
    router.push("/");
    router.refresh();
  };

  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (sidebar && overlay) {
      sidebar.classList.toggle("-translate-x-full");
      overlay.classList.toggle("hidden");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {/* Hamburger menu for logged-in users on dashboard screens */}
            {user && isDashboardScreen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="md:hidden"
                aria-label="Toggle sidebar menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}

            <Link
              href="/"
              className="flex items-center gap-2 group cursor-pointer"
              aria-label="PromptVault - Home"
            >
              <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 p-2 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                PromptVault
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 md:gap-4" role="navigation" aria-label="Main navigation">
            {/* Blog Link */}
            <Button
              asChild
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-purple-500/10 cursor-pointer"
            >
              <Link href="/blog" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Blog</span>
              </Link>
            </Button>

            {user ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className={
                    isAdmin
                      ? "text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 cursor-pointer"
                      : "text-muted-foreground hover:text-foreground hover:bg-purple-500/10 cursor-pointer"
                  }
                >
                  <Link
                    href={isAdmin ? "/admin/dashboard" : "/user/dashboard"}
                    className="flex items-center gap-2"
                  >
                    {isAdmin ? (
                      <Shield className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span>
                      {username
                        ? `@${username}`
                        : isAdmin
                          ? "Admin"
                          : "Dashboard"}
                    </span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground hover:bg-purple-500/10 cursor-pointer"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Button
                asChild
                variant="ghost"
                className="hover:bg-purple-500/10 cursor-pointer"
              >
                <Link href="/auth/login" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
            )}
          </nav>

          {/* Mobile Username Display */}
          <div className="md:hidden">
            {user ? (
              <Link
                href={isAdmin ? "/admin/dashboard" : "/user/dashboard"}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <User className="h-4 w-4" />
                <span>{username ? `@${username}` : "User"}</span>
              </Link>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && !user && (
          <div className="md:hidden border-t border-purple-500/20 bg-background/95 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {/* Blog Link */}
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-purple-500/10 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/blog" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Blog</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full justify-start hover:bg-purple-500/10 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/auth/login" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
