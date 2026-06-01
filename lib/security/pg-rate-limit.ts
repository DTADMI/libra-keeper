import "server-only";
import { createServerClient } from "@/lib/supabase/server";

export async function checkPgRateLimit(identifier: string, maxRequests: number, windowSeconds: number, route = "default"): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  try {
    const supabase = await createServerClient();
    const { data } = await (supabase as any).rpc("check_rate_limit", { p_identifier: identifier, p_route: route, p_max_requests: maxRequests, p_window_seconds: windowSeconds }) as { data: { allowed: boolean; remaining: number; resetAt: number } | null; error: unknown };
    if (!data) return { allowed: true, remaining: maxRequests - 1, resetAt: Math.floor(Date.now() / 1000) + windowSeconds };
    return data;
  } catch { return { allowed: true, remaining: maxRequests - 1, resetAt: Math.floor(Date.now() / 1000) + windowSeconds }; }
}
