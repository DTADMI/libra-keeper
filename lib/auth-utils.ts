import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

import { createServerClient } from "@/lib/supabase/server";

type AuthenticatedUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  image: string | null;
};

type AuthSession = { user: AuthenticatedUser } | { user: null };

async function getProfileRole(supabase: SupabaseClient, userId: string): Promise<string> {
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();

  if (data && typeof data === "object" && "role" in data) {
    return (data as { role: string }).role;
  }
  return "USER";
}

export const getServerAuth = cache(async (): Promise<AuthSession> => {
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {return { user: null };}

  const role = await getProfileRole(supabase as unknown as SupabaseClient, data.user.id);

  return {
    user: {
      id: data.user.id,
      email: data.user.email ?? "",
      name: (data.user.user_metadata?.name as string) ?? null,
      role,
      image: (data.user.user_metadata?.avatar_url as string) ?? null,
    },
  };
});

export const getCurrentUser = cache(async () => {
  const session = await getServerAuth();
  return session.user;
});

export const requireAuth = cache(async () => {
  const user = await getCurrentUser();
  if (!user) {throw new Error("Not authenticated");}
  return user;
});

export const requireAdmin = cache(async () => {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {throw new Error("Not authorized");}
  return user;
});
