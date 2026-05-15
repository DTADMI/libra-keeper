"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { createBrowserClient } from "@/lib/supabase/client"

export function useRealtimeItem(itemId: string) {
  const queryClient = useQueryClient()
  const supabase = createBrowserClient()

  useEffect(() => {
    const channel = supabase
      .channel(`item-${itemId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "loans", filter: `item_id=eq.${itemId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["item", itemId] })
          queryClient.invalidateQueries({ queryKey: ["loans"] })
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "loans", filter: `item_id=eq.${itemId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["item", itemId] })
          queryClient.invalidateQueries({ queryKey: ["loans"] })
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `item_id=eq.${itemId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["comments", itemId] })
          queryClient.invalidateQueries({ queryKey: ["item", itemId] })
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "likes", filter: `item_id=eq.${itemId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["likes", itemId] })
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "likes", filter: `item_id=eq.${itemId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["likes", itemId] })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [itemId, supabase, queryClient])
}

export function useRealtimeActivity() {
  const queryClient = useQueryClient()
  const supabase = createBrowserClient()

  useEffect(() => {
    const channel = supabase
      .channel("activity-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "loans" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["activity"] })
          queryClient.invalidateQueries({ queryKey: ["loans"] })
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "loans" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["activity"] })
          queryClient.invalidateQueries({ queryKey: ["loans"] })
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["activity"] })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, queryClient])
}
