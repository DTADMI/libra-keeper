"use client"

import { useEffect, useState, useCallback } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"
import type { Tables } from "@/types/database"

export type Profile = Tables<"profiles">
export type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  status: AuthStatus
}

let inFlightSession: Promise<Session | null> | null = null
let cachedProfile: { id: string; profile: Profile } | null = null

export function useAuth() {
  const supabase = createBrowserClient()
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    status: "loading",
  })

  const loadSession = useCallback(async () => {
    if (!inFlightSession) {
      inFlightSession = supabase.auth.getSession().then(({ data }) => {
        inFlightSession = null
        return data.session ?? null
      }).catch(() => {
        inFlightSession = null
        return null
      })
    }

    const session = await inFlightSession

    if (!session) {
      setState({ user: null, profile: null, session: null, status: "unauthenticated" })
      return
    }

    setState((prev) => ({
      ...prev,
      user: session.user,
      session,
      status: "authenticated",
    }))

    if (
      cachedProfile &&
      cachedProfile.id === session.user.id &&
      Date.now() - new Date(cachedProfile.profile.updated_at).getTime() < 30000
    ) {
      setState((prev) => ({ ...prev, profile: cachedProfile!.profile }))
      return
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle()

    if (profile) {
      cachedProfile = { id: session.user.id, profile }
      setState((prev) => ({ ...prev, profile }))
    }
  }, [supabase])

  useEffect(() => {
    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setState((prev) => ({
          ...prev,
          user: session?.user ?? null,
          session,
          status: "authenticated",
        }))
        if (session?.user) {
          supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle()
            .then(({ data }) => {
              if (data) {
                cachedProfile = { id: session.user.id, profile: data }
                setState((prev) => ({ ...prev, profile: data }))
              }
            })
        }
      } else if (event === "SIGNED_OUT") {
        cachedProfile = null
        setState({ user: null, profile: null, session: null, status: "unauthenticated" })
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, loadSession])

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data
    },
    [supabase],
  )

  const signUp = useCallback(
    async (email: string, password: string, name?: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      return data
    },
    [supabase],
  )

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    cachedProfile = null
  }, [supabase])

  const refreshProfile = useCallback(async () => {
    if (!state.user) return
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", state.user.id)
      .maybeSingle()
    if (data) {
      cachedProfile = { id: state.user.id, profile: data }
      setState((prev) => ({ ...prev, profile: data }))
    }
  }, [supabase, state.user])

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    isAdmin: state.profile?.role === "ADMIN",
  }
}
