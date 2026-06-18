-- 008_cache_and_security_fixes.sql
-- Adds: check_rate_limit function, app_cache table, French FTS support,
-- RLS policy hardening (tighten public reads, notifications insert).
-- All operations are idempotent.

-- =============================================================================
-- check_rate_limit — PostgreSQL sliding-window rate limiter
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  route TEXT NOT NULL DEFAULT 'default',
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  count INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup
  ON public.rate_limits (identifier, route, window_start);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF to_regprocedure('public.check_rate_limit(text,text,integer,integer)') IS NULL THEN
    CREATE OR REPLACE FUNCTION public.check_rate_limit(
      p_identifier TEXT,
      p_route TEXT DEFAULT 'default',
      p_max_requests INTEGER DEFAULT 100,
      p_window_seconds INTEGER DEFAULT 60
    )
    RETURNS JSONB
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = 'public'
    AS $func$
    DECLARE
      v_window_start TIMESTAMPTZ;
      v_count INTEGER;
      v_allowed BOOLEAN;
      v_reset_at BIGINT;
    BEGIN
      v_window_start := now() - (p_window_seconds || ' seconds')::INTERVAL;

      DELETE FROM public.rate_limits
      WHERE identifier = p_identifier
        AND route = p_route
        AND window_start < v_window_start;

      SELECT count(*) INTO v_count
      FROM public.rate_limits
      WHERE identifier = p_identifier AND route = p_route;

      v_allowed := v_count < p_max_requests;
      v_reset_at := EXTRACT(EPOCH FROM now())::BIGINT + p_window_seconds;

      IF v_allowed THEN
        INSERT INTO public.rate_limits (identifier, route, window_start, count)
        VALUES (p_identifier, p_route, now(), 1);
      END IF;

      RETURN jsonb_build_object(
        'allowed', v_allowed,
        'remaining', GREATEST(0, p_max_requests - v_count - CASE WHEN v_allowed THEN 1 ELSE 0 END),
        'resetAt', v_reset_at
      );
    END;
    $func$;

    REVOKE ALL ON FUNCTION public.check_rate_limit(text,text,integer,integer) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.check_rate_limit(text,text,integer,integer) FROM anon;
    REVOKE ALL ON FUNCTION public.check_rate_limit(text,text,integer,integer) FROM authenticated;
    GRANT EXECUTE ON FUNCTION public.check_rate_limit(text,text,integer,integer) TO service_role;
    GRANT EXECUTE ON FUNCTION public.check_rate_limit(text,text,integer,integer) TO authenticated;
    GRANT EXECUTE ON FUNCTION public.check_rate_limit(text,text,integer,integer) TO anon;
  END IF;
END $$;

-- =============================================================================
-- app_cache — PostgreSQL L2 cache tier
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.app_cache (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE public.app_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage cache" ON public.app_cache;
CREATE POLICY "Service role can manage cache" ON public.app_cache
  FOR ALL USING (true);

CREATE INDEX IF NOT EXISTS idx_app_cache_expires ON public.app_cache (expires_at);

-- =============================================================================
-- RLS Policy Hardening — Fix overly-permissive policies
-- =============================================================================

-- items: restrict public read to authenticated-only
-- (public_collection feature flag gates unauthenticated browsing at app level)
DROP POLICY IF EXISTS "Anyone can view items" ON public.items;
CREATE POLICY "Anyone can view items" ON public.items
  FOR SELECT USING (auth.role() = 'authenticated');

-- app_settings: restrict read to authenticated-only
DROP POLICY IF EXISTS "Anyone can read settings" ON public.app_settings;
CREATE POLICY "Anyone can read settings" ON public.app_settings
  FOR SELECT USING (auth.role() = 'authenticated');

-- notifications: restrict insert to prevent spoofing
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =============================================================================
-- French Full-Text Search Support
-- =============================================================================
DO $$
BEGIN
  IF to_regprocedure('public.items_search_update()') IS NOT NULL THEN
    CREATE OR REPLACE FUNCTION public.items_search_update()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $_$
    BEGIN
      NEW.search_vector :=
        setweight(to_tsvector('french', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('french', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('french', COALESCE(NEW.author, '')), 'B') ||
        setweight(to_tsvector('french', COALESCE(NEW.publisher, '')), 'C') ||
        setweight(to_tsvector('simple', COALESCE(NEW.isbn, '')), 'C');
      RETURN NEW;
    END;
    $_$;
  END IF;
END $$;

-- Backfill existing records with French tsvector
UPDATE public.items
SET search_vector =
  setweight(to_tsvector('french', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('french', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('french', COALESCE(author, '')), 'B') ||
  setweight(to_tsvector('french', COALESCE(publisher, '')), 'C') ||
  setweight(to_tsvector('simple', COALESCE(isbn, '')), 'C');
