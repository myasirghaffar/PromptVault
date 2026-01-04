import { createBrowserClient } from "@supabase/ssr"

/**
 * Creates a Supabase client for client-side operations
 * Validates environment variables before creating the client
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing required Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
