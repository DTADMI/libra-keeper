-- 005_return_flow_and_media.rollback.sql
-- Retire le suivi d'etat au retour et les medias d'article.
-- ATTENTION : condition_history, item_images et notifications sont supprimees,
-- donc images et historique deja enregistres sont perdus. Inherent au retour en
-- arriere. Les colonnes ajoutees a loans sont retirees dans le meme mouvement.
DROP TABLE IF EXISTS public.notifications;
DROP TABLE IF EXISTS public.item_images;
DROP TABLE IF EXISTS public.condition_history;
ALTER TABLE public.loans DROP COLUMN IF EXISTS return_condition;
ALTER TABLE public.loans DROP COLUMN IF EXISTS return_notes;

ALTER TABLE public.loans DROP CONSTRAINT IF EXISTS loans_status_check;
ALTER TABLE public.loans ADD CONSTRAINT loans_status_check
  CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'RETURNED', 'OVERDUE', 'LOST'));
