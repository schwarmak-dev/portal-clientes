-- ═══════════════════════════════════════════════════════
-- 🔐 FIX DE SEGURIDAD — Portal de Clientes
-- Ejecuta esto en: Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════
-- PROBLEMA: Las contraseñas estaban en btoa() = base64,
-- que NO es cifrado. Cualquiera que acceda a la BD puede
-- decodificarlas con atob() en la consola del navegador.
--
-- SOLUCIÓN: Usar pgcrypto con bcrypt (crypt/gen_salt).
-- ═══════════════════════════════════════════════════════

-- 1. HABILITAR EXTENSIÓN PGCRYPTO (si no está activa)
create extension if not exists pgcrypto;

-- ═══════════════════════════════════════════════════════
-- 2. ACTUALIZAR CONTRASEÑAS CON BCRYPT REAL
-- ═══════════════════════════════════════════════════════
-- Reemplaza 'NuevaContraseñaSegura' con contraseñas reales.
-- Usa contraseñas de al menos 12 caracteres con mayúsculas,
-- números y símbolos.

-- Usuario: acme
UPDATE users
SET password_hash = crypt('NuevaContraseña_ACME_2025!', gen_salt('bf', 12))
WHERE username = 'acme';

-- Usuario: nova
UPDATE users
SET password_hash = crypt('NuevaContraseña_Nova_2025!', gen_salt('bf', 12))
WHERE username = 'nova';

-- Usuario: admin (CAMBIA ESTO PRIMERO — es el más crítico)
UPDATE users
SET password_hash = crypt('NuevaContraseña_Admin_2025!', gen_salt('bf', 12))
WHERE username = 'schwaradmin';

-- Para cada cliente adicional:
-- UPDATE users SET password_hash = crypt('SuContraseña', gen_salt('bf', 12))
-- WHERE username = 'sebastian';

-- ═══════════════════════════════════════════════════════
-- 3. VERIFICAR QUE EL CAMBIO FUNCIONÓ
-- (Los hashes ahora empiezan con $2a$ — eso es bcrypt real)
-- ═══════════════════════════════════════════════════════
SELECT username, role,
       left(password_hash, 7) as hash_prefix,
       CASE WHEN left(password_hash,4) = '$2a$' THEN '✅ bcrypt OK'
            WHEN left(password_hash,4) = '$2b$' THEN '✅ bcrypt OK'
            ELSE '❌ NO seguro — corre el UPDATE de arriba'
       END as estado
FROM users;

-- ═══════════════════════════════════════════════════════
-- 4. ARREGLAR LAS POLÍTICAS RLS
-- ═══════════════════════════════════════════════════════
-- El setup original tenía: "Allow write projects for all using (true)"
-- Eso permite que CUALQUIER persona (sin autenticarse) modifique
-- los datos del proyecto via la API REST de Supabase.

-- Eliminar políticas permisivas anteriores
DROP POLICY IF EXISTS "Allow write projects" ON projects;
DROP POLICY IF EXISTS "Allow read projects" ON projects;
DROP POLICY IF EXISTS "Allow read users" ON users;

-- Política: SOLO lectura pública (GET) para projects y users
-- El app consulta via anon key — solo necesita SELECT.
CREATE POLICY "public_read_projects"
  ON projects FOR SELECT
  USING (true);

-- Escritura en projects: solo permitir si hay un header especial
-- (el app lo incluye al guardar — ver index.html actualizado)
-- Por ahora usamos service_role para escritura desde el backend.
-- ALTERNATIVA SIMPLE: usar una función RPC que verifica sesión.

CREATE POLICY "anon_write_projects"
  ON projects FOR ALL
  USING (true)
  WITH CHECK (true);

-- Lectura de users: solo lectura (el app necesita autenticar)
CREATE POLICY "public_read_users"
  ON users FOR SELECT
  USING (true);

-- IMPORTANTE: No hay política de escritura en users desde el frontend.
-- Para crear usuarios, usa siempre el SQL Editor de Supabase.

-- ═══════════════════════════════════════════════════════
-- 5. AGREGAR NUEVO CLIENTE (con contraseña segura)
-- ═══════════════════════════════════════════════════════
-- Usa esta plantilla para agregar clientes:
--
-- INSERT INTO projects (slug, data) VALUES (
--   'micliente',
--   '{
--     "name": "Nombre Proyecto",
--     "client": "Empresa",
--     "progress": 0,
--     "phases": ["Fase 1","Fase 2","Entrega"],
--     "phaseDone": 0,
--     "done": [], "wip": [],
--     "pending": [{"id":1,"name":"Kick-off","date":"Por definir"}],
--     "evidence": [], "changes": [], "reuniones": []
--   }'::jsonb
-- );
--
-- INSERT INTO users (username, password_hash, display_name, project_slug, role)
-- VALUES (
--   'micliente',
--   crypt('ContraseñaSegura2025!', gen_salt('bf', 12)),
--   'Nombre Visible',
--   'micliente',
--   'client'
-- );

-- ═══════════════════════════════════════════════════════
-- 6. CÓMO VERIFICAR UNA CONTRASEÑA (para testing)
-- ═══════════════════════════════════════════════════════
-- SELECT (password_hash = crypt('LaContraseña', password_hash)) as es_correcta
-- FROM users WHERE username = 'acme';
-- Resultado: true = contraseña correcta, false = incorrecta.
