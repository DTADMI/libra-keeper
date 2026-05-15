"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface User {
  id: string
  name: string | null
  email: string
  role: string
}

interface FeatureFlag {
  id: string
  name: string
  description: string | null
  isEnabled: boolean
}

interface AppSetting {
  id: string
  key: string
  value: string
  type: string
}

interface ExportData {
  items: unknown[]
  loans: unknown[]
  users: unknown[]
}

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => fetchJSON<User[]>("/api/admin/users"),
  })
}

export function useChangeUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      fetchJSON<User>(`/api/admin/users`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}

export function useAdminFlags() {
  return useQuery({
    queryKey: ["admin", "flags"],
    queryFn: () => fetchJSON<FeatureFlag[]>("/api/admin/flags"),
  })
}

export function useUpdateFlag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (flag: { name: string; isEnabled: boolean; description?: string }) =>
      fetchJSON<FeatureFlag>("/api/admin/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flag),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "flags"] })
      queryClient.invalidateQueries({ queryKey: ["feature-flags"] })
    },
  })
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => fetchJSON<AppSetting[]>("/api/admin/settings"),
  })
}

export function useUpdateSetting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (setting: { key: string; value: string; type: string }) =>
      fetchJSON<AppSetting>("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setting),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] })
    },
  })
}

export function useAdminExport() {
  return useQuery({
    queryKey: ["admin", "export"],
    queryFn: () => fetchJSON<ExportData>("/api/admin/export"),
    enabled: false,
  })
}
