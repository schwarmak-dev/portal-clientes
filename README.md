# Portal de Clientes

Una aplicación web completa para gestión de proyectos y portal de clientes, diseñada para freelancers y agencias que necesitan mantener a sus clientes informados sobre el progreso de sus proyectos.

## Features

- **Panel de Cliente** — Vista del cliente con progreso, roadmap, evidencias, reuniones y solicitudes
- **Panel de Administración** — Control total para gestionar proyectos, tareas y clientes
- **Autenticación Segura** — Login con Supabase y verificación bcrypt en servidor
- **Drag & Drop Roadmap** — Mueve tareas entre columnas arrastrando tarjetas
- **Calendario de Reuniones** — Reserva y gestiona reuniones con recordatorios automáticos
- **Gestión de Evidencias** — Sube y organiza capturas de avance del proyecto
- **Solicitudes de Cambio** — Los clientes pueden pedir ajustes y recibir respuestas
- **Modo Offline** — Funciona con datos de demo cuando Supabase no está configurado
- **Sesión Segura** — Cierre automático por inactividad (30 minutos)
- **Notificaciones** — Alertas en tiempo real para reuniones y cambios

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript vanilla
- **Backend:** Supabase (PostgreSQL + Auth + REST API)
- **Fonts:** Syne, DM Sans, DM Mono (Google Fonts)
- **Deploy:** Netlify (arrastrando archivos)

## Project Structure

```
portal/
├── index.html              # Estructura principal
├── app.js                  # Lógica de la aplicación
├── styles.css              # Estilos CSS
├── paso1_fix_seguridad.sql # Script de migración de seguridad
├── paso2_funcion_rpc.sql   # Función RPC de verificación
└── leeme_pasos.md          # Guía de configuración de seguridad
```

## Quick Start

### Opción 1: Modo Demo (sin Supabase)

1. Abre `index.html` en tu navegador
2. Usa las credenciales demo:
   - **Admin:** `schwaradmin` / `admin123`
   - **Cliente:** `acme` / `acme123`

### Opción 2: Con Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta los scripts SQL en el SQL Editor:
   - `paso1_fix_seguridad.sql` — Configura bcrypt y RLS
   - `paso2_funcion_rpc.sql` — Crea la función de autenticación
3. Actualiza las credenciales en `app.js`:
   ```javascript
   const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
   const SUPABASE_ANON_KEY = 'tu-anon-key-aqui';
   ```
4. Despliega en Netlify

## Database Schema

### Tabla `users`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| username | text | Nombre de usuario (PK) |
| password_hash | text | Hash bcrypt de la contraseña |
| display_name | text | Nombre visible |
| project_slug | text | Slug del proyecto asociado |
| role | text | `client` o `admin` |

### Tabla `projects`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| slug | text | Identificador único (PK) |
| data | jsonb | Datos completos del proyecto |
| updated_at | timestamp | Última actualización |

## Security

- Contraseñas hasheadas con bcrypt (no base64)
- Verificación en servidor vía RPC (el hash nunca sale de la BD)
- Row Level Security (RLS) habilitado
- Sesiones con timeout de inactividad

Para más detalles, consulta [leeme_pasos.md](leeme_pasos.md).

## Customization

### Agregar un nuevo cliente

1. Ejecuta en Supabase SQL Editor:
   ```sql
   INSERT INTO projects (slug, data) VALUES (
     'micliente',
     '{
       "name": "Nombre Proyecto",
       "client": "Empresa",
       "progress": 0,
       "phases": ["Fase 1","Fase 2","Entrega"],
       "phaseDone": 0,
       "done": [], "wip": [],
       "pending": [{"id":1,"name":"Kick-off","date":"Por definir"}],
       "evidence": [], "changes": [], "reuniones": []
     }'::jsonb
   );

   INSERT INTO users (username, password_hash, display_name, project_slug, role)
   VALUES (
     'micliente',
     crypt('ContraseñaSegura!', gen_salt('bf', 12)),
     'Nombre Visible',
     'micliente',
     'client'
   );
   ```

### Cambiar colores

Edita las variables CSS en `styles.css`:
```css
:root {
  --gold: #f59e0b;
  --blue: #60a5fa;
  --green: #4ade80;
  /* ... */
}
```

## Security Audit

Agradecimientos especiales a **Camilo Martinez** por su revisión de ciberseguridad y asesoría en las mejores prácticas de autenticación y protección de datos.

## License

MIT

## Author

**Matias Schwarzmuller** — [scharmak.dev@gmail.com](mailto:scharmak.dev@gmail.com)

---

Desarrollado con ? para freelancers y agencias que valoran la transparencia con sus clientes.
