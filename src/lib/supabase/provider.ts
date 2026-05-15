import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

export interface SupabaseProvider {
  readonly name: "supabase"
  createBrowserClient(): SupabaseClient<Database>
  createServerClient(): Promise<SupabaseClient<Database>>
  createAdminClient(): SupabaseClient<Database>
}
