// hooks/use-admin.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
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

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => apiClient<User[]>("/api/admin/users"),
    staleTime: 30_000,
  });
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      apiClient<User>("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      }),
    onError: (_err) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useAdminFlags() {
  return useQuery({
    queryKey: ["admin", "flags"],
    queryFn: () => apiClient<FeatureFlag[]>("/api/admin/flags"),
    staleTime: 30_000,
  });
}

export function useUpdateFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flag: { name: string; isEnabled: boolean; description?: string }) =>
      apiClient<FeatureFlag>("/api/admin/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flag),
      }),
    onError: (_err) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "flags"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "flags"] });
      queryClient.invalidateQueries({ queryKey: ["feature-flags"] });
    },
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => apiClient<AppSetting[]>("/api/admin/settings"),
    staleTime: 30_000,
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (setting: { key: string; value: string; type: string }) =>
      apiClient<AppSetting>("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setting),
      }),
    onError: (_err) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
  });
}

export function useAdminExport() {
  return useQuery({
    queryKey: ["admin", "export"],
    queryFn: () => apiClient<ExportData>("/api/admin/export"),
    enabled: false,
  });
}
