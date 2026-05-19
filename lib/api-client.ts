// lib/api-client.ts — Shared TanStack Query fetch wrapper
// Eliminates 8x duplicated fetchJSON across hook files.

export async function apiClient<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}
