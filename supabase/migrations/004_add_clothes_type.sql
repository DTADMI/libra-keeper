-- 004_add_clothes_type.sql
-- Adds CLOTHES to the ItemType validation and metadata fields for type-specific data.

-- Update the CHECK constraint on items.type
ALTER TABLE public.items DROP CONSTRAINT IF EXISTS items_type_check;
ALTER TABLE public.items ADD CONSTRAINT items_type_check
  CHECK (type IN ('BOOK', 'MUSIC', 'MOVIE', 'GAME', 'TOY', 'CLOTHES', 'OTHER'));
