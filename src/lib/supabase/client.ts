"use client"

import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

const globalForSupabase = globalThis as unknown as {
  supabase: SupabaseClient<Database> | undefined
}

export function createBrowserClient() {
  if (globalForSupabase.supabase) return globalForSupabase.supabase

  globalForSupabase.supabase = createSupabaseBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  return globalForSupabase.supabase
}
