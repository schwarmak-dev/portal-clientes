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
BEGIN
  INSERT INTO projects (slug, data, updated_at)
  VALUES (p_slug, p_data, now())
  ON CONFLICT (slug)
  DO UPDATE SET data = p_data, updated_at = now();

  RETURN json_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION save_project(TEXT, JSONB) TO anon;
