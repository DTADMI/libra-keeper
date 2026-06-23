import { createServerClient } from "@/lib/supabase/server";

type LockoutRpcResult = { locked: boolean; remainingAttempts: number };
type SupabaseRpcClient = {
  rpc: (
    functionName: string,
    params: Record<string, unknown>,
  ) => Promise<{ data: LockoutRpcResult | null; error: unknown }>;
};

function rpcClient(client: unknown): SupabaseRpcClient {
  return client as SupabaseRpcClient;
}

export async function checkPgLockout(email: string): Promise<{
  locked: boolean; remainingAttempts: number;
}> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await rpcClient(supabase).rpc("check_account_lockout", {
      p_email: email.toLowerCase().trim(),
    });
    if (error || !data) {return { locked: false, remainingAttempts: 5 };}
    return {
      locked: (data as { locked: boolean }).locked,
      remainingAttempts: (data as { remainingAttempts: number }).remainingAttempts,
    };
  } catch { return { locked: false, remainingAttempts: 5 }; }
}

export async function recordPgFailedAttempt(email: string): Promise<void> {
  try {
    const supabase = await createServerClient();
    await rpcClient(supabase).rpc("record_failed_attempt", { p_email: email.toLowerCase().trim() });
  } catch (err) { console.error("[account-lockout-pg] record error:", err); }
}

export async function resetPgLockout(email: string): Promise<void> {
  try {
    const supabase = await createServerClient();
    await rpcClient(supabase).rpc("reset_account_lockout", { p_email: email.toLowerCase().trim() });
  } catch (err) { console.error("[account-lockout-pg] reset error:", err); }
}
