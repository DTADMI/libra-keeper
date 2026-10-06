-- 004_add_clothes_type.rollback.sql
-- Retire CLOTHES de la contrainte de type.
-- ATTENTION : si des articles de type CLOTHES existent, la contrainte restaurée
-- les refuse. Ils sont donc d'abord ramenes a 'OTHER' pour que la migration soit
-- reversible sans erreur, et ce deplacement est reporte ci-dessous.
DO $$
DECLARE
  moved INTEGER;
BEGIN
  SELECT count(*) INTO moved FROM public.items WHERE type = 'CLOTHES';
  IF moved > 0 THEN
    RAISE NOTICE 'rollback 004 : % article(s) CLOTHES deplaces vers OTHER', moved;
    UPDATE public.items SET type = 'OTHER' WHERE type = 'CLOTHES';
  END IF;
END $$;

ALTER TABLE public.items DROP CONSTRAINT IF EXISTS items_type_check;
ALTER TABLE public.items ADD CONSTRAINT items_type_check
  CHECK (type IN ('BOOK', 'MUSIC', 'MOVIE', 'GAME', 'TOY', 'OTHER'));
