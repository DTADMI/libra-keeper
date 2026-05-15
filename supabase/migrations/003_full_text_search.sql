-- 003_full_text_search.sql
-- Adds PostgreSQL full-text search to items table.
-- Replaces the basic ILIKE search with tsvector-based ranking.

-- Add tsvector column
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_items_search_vector ON public.items USING GIN (search_vector);

-- Function to update the search vector
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

-- Trigger to keep search_vector updated on INSERT and UPDATE
DROP TRIGGER IF EXISTS trg_items_search_vector ON public.items;
CREATE TRIGGER trg_items_search_vector
  BEFORE INSERT OR UPDATE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.items_search_update();

-- Backfill existing records
UPDATE public.items SET search_vector =
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(author, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(publisher, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(isbn, '')), 'C');
