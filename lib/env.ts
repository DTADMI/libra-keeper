import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional().default("LibraKeeper <noreply@librakeeper.app>"),
  KV_REST_API_URL: z.string().optional(),
  KV_REST_API_TOKEN: z.string().optional(),
  REDIS_URL: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsed.error.flatten().fieldErrors, null, 2),
  );
  throw new Error("Invalid environment variables. Check .env file.");
}

export const env = parsed.data;

const envObj = env as Record<string, string | undefined>;
if (!envObj["NEXT_PUBLIC_SUPABASE_URL"]) {
  console.warn(
    "⚠️  NEXT_PUBLIC_SUPABASE_URL is not set. Supabase features will not work.",
  );
}
if (!envObj["NEXT_PUBLIC_SUPABASE_ANON_KEY"]) {
  console.warn(
    "⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Supabase auth will not work.",
  );
}
