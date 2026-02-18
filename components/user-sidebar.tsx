"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  LogOut,
  Shield,
  Settings,
  Users,
  FileCheck,
  PenTool,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

// Regular user navigation
const userNavItems = [
  {
    title: "Dashboard",
    href: "/user/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Prompts",
    href: "/user/my-prompts",
    icon: FileText,
  },
  {
    title: "Submit Prompt",
    href: "/user/submit",
    icon: PlusCircle,
  },
  {
    title: "Profile",
    href: "/user/profile",
    icon: User,
  },
];

// Admin navigation
const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "All Prompts",
    href: "/admin/prompts",
    icon: PenTool,
  },
  {
    title: "Prompt Approvals",
    href: "/admin/approvals",
    icon: FileCheck,
  },
  {
    title: "All Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Blog Management",
    href: "/admin/blogs",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Profile",
    href: "/admin/profile",
    icon: User,
  },
];

interface UserSidebarProps {
  isAdmin?: boolean;
}

export function UserSidebar({ isAdmin = false }: UserSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <aside
      className="fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] border-r border-purple-500/20 bg-card/95 backdrop-blur-xl transition-transform duration-300 overflow-y-auto -translate-x-full md:translate-x-0"
      id="sidebar"
    >
      <div className="p-6 space-y-6">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
                  isActive
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "text-muted-foreground hover:bg-purple-500/10 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="pt-4 border-t border-purple-500/20">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-purple-500/10 cursor-pointer"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
