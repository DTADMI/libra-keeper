import "server-only";
import { createServerClient } from "@/lib/supabase/server";

const flagCache = new Map<string, boolean>(); let lastRefresh = 0; const CACHE_MS = 2_000;

export async function isPgFlagEnabled(flagName: string): Promise<boolean> {
  try {
    if (Date.now() - lastRefresh < CACHE_MS && flagCache.has(flagName)) return flagCache.get(flagName)!;
    const supabase = await createServerClient();
    const { data } = await (supabase as any).from("feature_flags").select("enabled").eq("name", flagName).maybeSingle();
    const enabled = data?.enabled ?? false; flagCache.set(flagName, enabled); lastRefresh = Date.now();
    return enabled;
  } catch { return false; }
}

export async function setPgFeatureFlag(name: string, enabled: boolean, value?: unknown): Promise<void> {
  const supabase = await createServerClient();
  await (supabase as any).from("feature_flags").upsert({ name, enabled, value: value ?? enabled, updated_at: new Date().toISOString() }, { onConflict: "name" });
  flagCache.delete(name); lastRefresh = 0;
}

export async function refreshPgFlagsCache(): Promise<void> {
  flagCache.clear(); lastRefresh = 0;
  const supabase = await createServerClient();
  const { data } = await (supabase as any).from("feature_flags").select("name,enabled");
  if (data) { for (const f of data as Array<{ name: string; enabled: boolean }>) flagCache.set(f.name, f.enabled); lastRefresh = Date.now(); }
}
