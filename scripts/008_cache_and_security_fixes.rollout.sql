-- 008_cache_and_security_fixes.rollout.sql
-- Run: psql "$DATABASE_URL" -f scripts/008_cache_and_security_fixes.rollout.sql
-- Applies the full 008 migration.

\i ../supabase/migrations/008_cache_and_security_fixes.sql

-- Verify critical objects exist
SELECT to_regprocedure('public.check_rate_limit(text,text,integer,integer)') AS check_rate_limit_fn;
SELECT to_regclass('public.app_cache') AS app_cache_table;
SELECT to_regclass('public.rate_limits') AS rate_limits_table;

-- Verify RLS is enabled on new tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('app_cache', 'rate_limits') AND EXISTS (SELECT 1 FROM pg_class WHERE relname = tablename AND relrowsecurity = true);
