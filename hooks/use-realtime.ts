// hooks/use-realtime.ts
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { createBrowserClient } from "@/lib/supabase/client";

export function useRealtimeItem(itemId: string) {
  const queryClient = useQueryClient();
  const supabaseRef = useRef(createBrowserClient());

  useEffect(() => {
    const supabase = supabaseRef.current;
    const channel = supabase
      .channel(`item-${itemId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "loans", filter: `item_id=eq.${itemId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["item", itemId] });
          queryClient.invalidateQueries({ queryKey: ["loans"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "loans", filter: `item_id=eq.${itemId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["item", itemId] });
          queryClient.invalidateQueries({ queryKey: ["loans"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `item_id=eq.${itemId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["comments", itemId] });
          queryClient.invalidateQueries({ queryKey: ["item", itemId] });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "likes", filter: `item_id=eq.${itemId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["likes", itemId] });
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "likes", filter: `item_id=eq.${itemId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["likes", itemId] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [itemId, queryClient]);
}

export function useRealtimeActivity() {
  const queryClient = useQueryClient();
  const supabaseRef = useRef(createBrowserClient());

  useEffect(() => {
    const supabase = supabaseRef.current;
    const channel = supabase
      .channel("activity-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "loans" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["activity"] });
          queryClient.invalidateQueries({ queryKey: ["loans"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "loans" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["activity"] });
          queryClient.invalidateQueries({ queryKey: ["loans"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["activity"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
