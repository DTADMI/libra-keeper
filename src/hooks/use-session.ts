"use client"

import { useAuth } from "@/hooks/use-auth"

export function useSession() {
  const { user, profile, session, status, refreshProfile } = useAuth()

  const augmentedUser = user
    ? {
        id: user.id,
        email: user.email ?? "",
        name: profile?.name ?? (user.user_metadata?.name as string | null),
        role: profile?.role ?? "USER",
        image: profile?.avatar_url ?? (user.user_metadata?.avatar_url as string | null),
      }
    : null

  const update = async (_data?: Record<string, unknown>) => {
    await refreshProfile()
  }

  return {
    data: augmentedUser ? { user: augmentedUser } : null,
    status: status as "loading" | "authenticated" | "unauthenticated",
    update,
  }
}
