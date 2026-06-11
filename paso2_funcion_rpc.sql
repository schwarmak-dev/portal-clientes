-- ═══════════════════════════════════════════════════════
-- 🔐 PASO 2 — Función RPC para verificar contraseñas
-- Ejecuta esto en: Supabase Dashboard > SQL Editor
-- (Después de correr PASO1_fix_seguridad.sql)
-- ═══════════════════════════════════════════════════════
-- POR QUÉ ESTO ES IMPORTANTE:
-- Sin esta función, el app tiene que descargar el hash
-- al navegador y compararlo ahí → cualquiera puede interceptarlo.
-- Con esta función, la comparación ocurre en el servidor
-- de Supabase → el hash NUNCA sale de la base de datos.
-- ═══════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION verify_login(p_username TEXT, p_password TEXT, p_agent TEXT DEFAULT '')
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER  -- Se ejecuta con permisos del dueño, no del llamador
AS $$
DECLARE
  v_user users%ROWTYPE;
  v_ok   BOOLEAN := false;
BEGIN
  -- Buscar el usuario (case-insensitive)
  SELECT * INTO v_user
  FROM users
  WHERE lower(username) = lower(p_username)
  LIMIT 1;

  -- Si no existe el usuario, retornar fallo
  IF NOT FOUND THEN
    RETURN json_build_object('ok', false);
  END IF;

  -- Verificar contraseña con bcrypt (pgcrypto)
  -- crypt() con el hash existente rehashea la contraseña ingresada
  -- y compara — todo en el servidor, nunca sale el hash.
  v_ok := (v_user.password_hash = crypt(p_password, v_user.password_hash));

  IF NOT v_ok THEN
    RETURN json_build_object('ok', false);
  END IF;

  -- Retornar datos del usuario (SIN el hash)
  RETURN json_build_object(
    'ok',           true,
    'display_name', v_user.display_name,
    'project_slug', v_user.project_slug,
    'role',         v_user.role
  );
END;
$$;

-- Permitir que cualquier persona llame a esta función vía anon key
-- (necesario para el login público)
GRANT EXECUTE ON FUNCTION verify_login(TEXT, TEXT) TO anon;

-- ═══════════════════════════════════════════════════════
-- VERIFICAR QUE FUNCIONA (opcional)
-- ═══════════════════════════════════════════════════════
-- Corre esto reemplazando la contraseña real para testear:
--
-- SELECT verify_login('acme', 'NuevaContraseña_ACME_2025!');
-- Resultado esperado: {"ok":true,"display_name":"Equipo ACME",...}
--
-- SELECT verify_login('acme', 'contraseñaIncorrecta');
-- Resultado esperado: {"ok":false}
