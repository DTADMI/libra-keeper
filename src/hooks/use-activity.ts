"use client"

import { useQuery } from "@tanstack/react-query"

interface Activity {
  id: string
  type: string
  message: string
  createdAt: string
  user?: { id: string; name: string | null }
  item?: { id: string; title: string }
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export function useActivity() {
  return useQuery({
    queryKey: ["activity"],
    queryFn: () => fetchJSON<Activity[]>("/api/activity"),
    refetchInterval: 30000,
  })
}
