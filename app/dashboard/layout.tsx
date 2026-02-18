import type React from "react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { UserSidebar } from "@/components/user-sidebar";
import { DashboardOverlay } from "@/components/dashboard-overlay";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, username")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-purple-800/10">
      <Header
        user={user}
        isAdmin={!!profile?.is_admin}
        username={profile?.username || undefined}
      />
      <div className="flex relative">
        <UserSidebar isAdmin={!!profile?.is_admin} />
        {/* Mobile overlay */}
        <DashboardOverlay />
        <main className="flex-1 ml-0 md:ml-64 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
