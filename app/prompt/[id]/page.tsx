import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import { PromptDetail } from "@/components/prompt-detail";

interface PromptPageProps {
  params: Promise<{ id: string }>;
}

export default async function PromptPage({ params }: PromptPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user is admin
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.is_admin || false;
  }

  // Get prompt with user info
  const { data: prompt, error } = await supabase
    .from("prompts")
    .select("*, profiles:created_by(username, is_admin)")
    .eq("id", id)
    .single();

  if (error || !prompt) {
    notFound();
  }

  // Get prompt creator username
  const promptCreatorUsername = Array.isArray(prompt.profiles)
    ? prompt.profiles[0]?.username
    : prompt.profiles?.username;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-purple-800/10 flex flex-col">
      <Header user={user} isAdmin={isAdmin} username={promptCreatorUsername} />
      <main className="flex-1">
        <PromptDetail prompt={prompt} />
      </main>
      <Footer />
    </div>
  );
}
