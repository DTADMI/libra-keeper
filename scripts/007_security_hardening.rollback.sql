-- 007_security_hardening.rollback.sql
-- Restaure les droits d'execution anterieurs sur les fonctions reservees aux
-- declencheurs. C'est le retour en arriere exact du durcissement.
DO $$
DECLARE
  fn_signature TEXT;
BEGIN
  FOREACH fn_signature IN ARRAY ARRAY['public.handle_new_user()']
  LOOP
    IF to_regprocedure(fn_signature) IS NULL THEN
      CONTINUE;
    END IF;
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO PUBLIC', fn_signature);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO anon', fn_signature);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', fn_signature);
  END LOOP;
END $$;
