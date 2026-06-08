# 🔐 Guía de arreglo de seguridad — Portal de Clientes

Tiempo estimado: **20–30 minutos**. No necesitas React para esto.

---

## Por qué el problema es grave

Tu app actual hace esto al hacer login:

```
1. Descarga el hash de la contraseña de Supabase al navegador
2. Compara: hash_descargado === btoa(password_ingresada)
```

El problema:
- `btoa()` es base64, no cifrado. `atob('YWNtZTEyMw==')` → `acme123`
- Cualquier persona puede abrir la consola del navegador y decodificar todos los hashes
- Alguien con la API key puede consultar la tabla `users` y ver todos los hashes

---

## La solución en 3 pasos

### PASO 1 — Actualizar contraseñas a bcrypt real

1. Abre **Supabase Dashboard → SQL Editor → New query**
2. Abre `PASO1_fix_seguridad.sql`, **edita las contraseñas** (líneas marcadas)
3. Pega y ejecuta → deberías ver `✅ bcrypt OK` para cada usuario

**Contraseñas a cambiar en el archivo antes de correrlo:**
| Línea | Usuario | Busca esto | Reemplaza con |
|-------|---------|-----------|---------------|
| ~24 | acme | `NuevaContraseña_ACME_2025!` | Tu contraseña real |
| ~28 | nova | `NuevaContraseña_Nova_2025!` | Tu contraseña real |
| ~32 | admin | `NuevaContraseña_Admin_2025!` | Tu contraseña más segura |

---

### PASO 2 — Crear la función RPC de verificación

1. **Nuevo query** en Supabase SQL Editor
2. Pega `PASO2_funcion_rpc.sql` completo y ejecuta
3. Verifica con la query de prueba al final del archivo

---

### PASO 3 — Actualizar el HTML

1. Reemplaza tu `index.html` actual con `index_seguro.html`
2. Sube el archivo actualizado a Netlify (arrastrando)

El nuevo `index_seguro.html` ya tiene la función de autenticación corregida. En vez de:
```
✗ Descarga hash al cliente → compara con btoa()
```
Ahora hace:
```
✅ Llama a función RPC en Supabase → el servidor verifica con bcrypt → retorna solo ok/false
```

---

## Qué cambia para tus clientes

**Nada.** El login funciona exactamente igual para ellos.
La diferencia es solo interna: la contraseña se verifica en el servidor, no en el navegador.

---

## Sobre React

Tu amigo tiene razón en que un framework como React mejora la estructura del código, pero **no resuelve el problema de seguridad actual** — React también corre en el navegador y tiene acceso a las mismas keys.

Lo que sí resuelve el problema es lo que hiciste ahora:
- Bcrypt en lugar de btoa ✅
- Verificación en servidor vía RPC ✅
- RLS habilitado en Supabase ✅

Si en el futuro quieres migrar a React, tiene sentido hacerlo cuando el proyecto crezca y necesites componentes reutilizables. Pero no es urgente ni necesario para la seguridad.

---

## Soporte

¿Problemas al ejecutar el SQL? Revisa:
- Que la extensión `pgcrypto` esté activa (el PASO 1 la activa automáticamente)
- Que los nombres de usuario en los UPDATE coincidan exactamente con los de tu tabla
- En Supabase Dashboard → Table Editor → users, verifica que los hashes ahora empiecen con `$2a$`
