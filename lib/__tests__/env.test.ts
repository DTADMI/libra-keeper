import { env } from "@/lib/env";

describe("env", () => {
  test("env object exists", () => {
    expect(env).toBeDefined();
  });

  test("env has required fields", () => {
    expect(env).toHaveProperty("DATABASE_URL");
    expect(env).toHaveProperty("NEXT_PUBLIC_SUPABASE_URL");
    expect(env).toHaveProperty("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  });
});
