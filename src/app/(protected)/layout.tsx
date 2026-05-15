// src/app/(protected)/layout.tsx
import { redirect } from "next/navigation"

import { createServerClient } from "@/lib/supabase/server"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    redirect("/auth/signin")
  }

  return <>{children}</>
}
