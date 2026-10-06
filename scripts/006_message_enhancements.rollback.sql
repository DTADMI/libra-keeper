-- 006_message_enhancements.rollback.sql
-- Retire les pieces jointes et la table d'amities.
-- ATTENTION : la table friendships est supprimee, donc les demandes d'amitie
-- enregistrees sont perdues. C'est inherent au retour en arriere de la migration
-- qui les a creees.
DROP TABLE IF EXISTS public.friendships;
ALTER TABLE public.messages DROP COLUMN IF EXISTS attachments;
