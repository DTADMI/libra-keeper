-- 003_full_text_search.rollback.sql
-- Defait la recherche plein texte : le vecteur et son index sont des donnees
-- derivees, donc les supprimer ne perd aucune donnee saisie par un utilisateur.
DROP TRIGGER IF EXISTS trg_items_search_vector ON public.items;
DROP FUNCTION IF EXISTS public.items_search_update();
DROP INDEX IF EXISTS public.idx_items_search_vector;
ALTER TABLE public.items DROP COLUMN IF EXISTS search_vector;
