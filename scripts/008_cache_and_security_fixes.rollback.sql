-- 008_cache_and_security_fixes.rollback.sql
-- Run: psql "$DATABASE_URL" -f scripts/008_cache_and_security_fixes.rollback.sql
-- Reverts the 008 migration changes.

-- Restore original RLS policies (permissive versions from before hardening)
DROP POLICY IF EXISTS "Anyone can view items" ON public.items;
CREATE POLICY "Anyone can view items" ON public.items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read settings" ON public.app_settings;
CREATE POLICY "Anyone can read settings" ON public.app_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Revert FTS back to English-only
CREATE OR REPLACE FUNCTION public.items_search_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.author, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.publisher, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.isbn, '')), 'C');
  RETURN NEW;
END;
$$;

-- Drop the added objects
DROP TABLE IF EXISTS public.rate_limits CASCADE;
DROP TABLE IF EXISTS public.app_cache CASCADE;
DROP FUNCTION IF EXISTS public.check_rate_limit(text,text,integer,integer);
