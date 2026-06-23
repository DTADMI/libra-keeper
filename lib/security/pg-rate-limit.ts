import "server-only";

import { createServerClient } from "@/lib/supabase/server";

type PgRateLimitRow = { allowed: boolean; remaining: number; resetAt: number };
type SupabaseRpcClient = {
  rpc: (
    functionName: "check_rate_limit",
    params: Record<string, unknown>,
  ) => Promise<{ data: PgRateLimitRow | null; error: unknown }>;
};

function rpcClient(client: unknown): SupabaseRpcClient {
  return client as SupabaseRpcClient;
}

export async function checkPgRateLimit(identifier: string, maxRequests: number, windowSeconds: number, route = "default"): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  try {
    const supabase = await createServerClient();
    const { data } = await rpcClient(supabase).rpc("check_rate_limit", { p_identifier: identifier, p_route: route, p_max_requests: maxRequests, p_window_seconds: windowSeconds });
    if (!data) {return { allowed: true, remaining: maxRequests - 1, resetAt: Math.floor(Date.now() / 1000) + windowSeconds };}
    return data;
  } catch { return { allowed: true, remaining: maxRequests - 1, resetAt: Math.floor(Date.now() / 1000) + windowSeconds }; }
}
