-- ═══════════════════════════════════════════════════════
-- 🔐 PASO 3 — Función RPC para guardar proyectos
-- Ejecutá esto en: Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════
-- PROBLEMA: El frontend usaba el anon key para escribir en
-- projects, lo cual es inseguro (cualquiera puede escribir).
-- SOLUCIÓN: RPC con SECURITY DEFINER para guardar de forma
-- controlada desde el frontend.
-- ═══════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION save_project(p_slug TEXT, p_data JSONB)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_caller_uid TEXT;
  v_is_admin   BOOLEAN := false;
BEGIN
  v_caller_uid := (SELECT auth.jwt() ->> 'sub');

  IF v_caller_uid IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM users
      WHERE username = (SELECT auth.jwt() ->> 'email')
      AND role = 'admin'
    ) INTO v_is_admin;
  END IF;

  IF NOT v_is_admin THEN
    SELECT EXISTS (
      SELECT 1 FROM users
      WHERE role = 'admin'
      AND lower(username) = lower(COALESCE(
        (SELECT auth.jwt() -> 'user_metadata' ->> 'username'),
        (SELECT auth.jwt() ->> 'email'),
        ''
      ))
    ) INTO v_is_admin;
  END IF;

  IF NOT v_is_admin THEN
    RETURN json_build_object('ok', false, 'error', 'unauthorized');
  END IF;

  INSERT INTO projects (slug, data, updated_at)
  VALUES (p_slug, p_data, now())
  ON CONFLICT (slug)
  DO UPDATE SET data = p_data, updated_at = now();

  RETURN json_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION save_project(TEXT, JSONB) TO anon;
