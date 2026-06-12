<div align="center">

# 🚀 PORTAL DE CLIENTES

### La app que tus clientes no sabían que necesitaban

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

---

**Un portal de clientes que hace que tu negocio freelance se vea 10x más profesional.**

🌐 **Probar ahora:** [https://schwarmak-dev.github.io/portal-clientes/](https://schwarmak-dev.github.io/portal-clientes/)

Olvídate de los emails interminables y las llamadas de "¿cómo va el proyecto?".
Tus clientes se logean, ven su progreso, y tú te ahorras tiempo.

[🚀 Demo Rápida](#-quick-start) · [ Instalación](#-quick-start) · [️ Personalizar](#-personalizar) 

---

</div>

## ✨ ¿Por qué te va a encantar?

<table>
<tr>
<td width="50%" valign="top">

### 🎯 Para ti (el dev)

- **Zero frameworks** — Vanilla JS puro, sin dependencias raras
- **Supabase** — Base de datos + auth en 5 minutos
- **Drag & Drop** — Roadmap interactivo con un solo drag
- **Modo offline** — Funciona sin servidor para testing
- **100% customizable** — Cambia colores, logos, lo que quieras

</td>
<td width="50%" valign="top">

### 👨‍💼 Para tus clientes

- **Panel intuitivo** — Ven el progreso sin preguntarte
- **Evidencias** — Capturas y avances en tiempo real
- **Reuniones** — Reservan slots y tú confirmas
- **Solicitudes** — Piden cambios sin romper nada
- **Notificaciones** — Recordatorios automáticos

</td>
</tr>
</table>

---

## 🔥 Features

| Feature | Descripción |
|---------|-------------|
| 🔐 **Auth Seguro** | Bcrypt + verificación en servidor (nada de base64) |
| 📊 **Dashboard** | Vista completa del progreso con stats en tiempo real |
| 🗂️ **Roadmap Drag & Drop** | Mueve tareas entre columnas como un Kanban |
| 📸 **Evidencias** | Sube capturas, screenshots, diseños |
| 📅 **Calendario** | Reserva de reuniones con recordatorios |
| 💬 **Solicitudes** | Los clientes piden cambios, tú respondes |
| ⏱️ **Auto-logout** | Sesión segura por inactividad |
| 🌙 **Modo Demo** | Prueba sin configurar nada |

---

## 🚀 Quick Start

### Opción 1: Modo Demo (0 config)

```bash
git clone https://github.com/schwarmak-dev/portal-clientes.git
cd portal-clientes
open index.html  # ¡Listo! Abre en tu navegador
```

**Credenciales demo:**
| Rol | Usuario | Contraseña |
|-----|---------|------------|
| 👑 Admin | `admin` | `admin.123` |
| 👤 Cliente | `acme` | `acme.123` |
| 👤 Cliente | `nova` | `nova.123` |

### Opción 2: Con Supabase (producción)

```bash
# 1. Clonar
git clone https://github.com/schwarmak-dev/portal-clientes.git
cd portal-clientes

# 2. Crear proyecto en Supabase (gratis)

# 3. Ejecutar SQLs en Supabase Dashboard > SQL Editor
#    - paso1_fix_seguridad.sql
#    - paso2_funcion_rpc.sql

# 4. Editar app.js con tus credenciales
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'tu-anon-key';

# 5. Deploy a Netlify (arrastra la carpeta)
```

---

## 📁 Estructura

```
portal/
├── 📄 index.html              # Entry point
├── ⚡ app.js                  # Toda la lógica ( vanilla 🍦 )
├── 🎨 styles.css              # Dark theme included
├── 🔒 paso1_fix_seguridad.sql # bcrypt migration
├── 🔑 paso2_funcion_rpc.sql   # Auth RPC function
└── 📖 leeme_pasos.md          # Security guide
```

---

## 🗄️ Database Schema

### `users`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `username` | `text` | PK — login |
| `password_hash` | `text` | bcrypt hash 🔒 |
| `display_name` | `text` | Nombre visible |
| `project_slug` | `text` | FK → projects |
| `role` | `text` | `client` \| `admin` |

### `projects`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `slug` | `text` | PK — identificador único |
| `data` | `jsonb` | Todo el proyecto en JSON |
| `updated_at` | `timestamp` | Última actualización |

---

## 🛡️ Security

```
❌ ANTES:  btoa(password) = base64 = cualquiera lo lee
✅ AHORA:  SHA-256 (demo) / bcrypt + RPC (producción) = hash nunca se expone
```

- ✅ Hash unidireccional (SHA-256 en demo, bcrypt en producción)
- ✅ Verificación server-side via Supabase RPC (producción)
- ✅ Row Level Security (RLS) habilitado
- ✅ Auto-logout por inactividad (30 min)
- ✅ Rate limiting en login (5 intentos → 30s lockout)
- ✅ Sanitización de URLs (previene XSS via javascript:)
- ✅ Sesiones en sessionStorage (no persisten entre tabs)
- ✅ Cuota de localStorage protegida (4.5MB max)

> 📖 Ver guía completa: [leeme_pasos.md](leeme_pasos.md)

---

## 🎨 Personalizar

### Cambiar colores

```css
:root {
  --gold: #f59e0b;    /* Color principal */
  --blue: #60a5fa;    /* Admin accent */
  --green: #4ade80;   /* Success */
  --red: #f87171;     /* Danger */
  /* ... solo cambia estas variables */
}
```

### Agregar cliente

```sql
-- En Supabase SQL Editor:
INSERT INTO projects (slug, data) VALUES (
  'nuevo-cliente',
  '{
    "name": "Proyecto Increíble",
    "client": "Empresa S.A.",
    "progress": 0,
    "phases": ["Discovery", "Build", "Launch"],
    "phaseDone": 0,
    "done": [], "wip": [],
    "pending": [{"id":1,"name":"Kick-off","date":"TBD"}],
    "evidence": [], "changes": [], "reuniones": []
  }'::jsonb
);
```

---

## 👥 Credits

### Autor

**Schwarmak** — [@schwarmak-dev](https://github.com/schwarmak-dev)

[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:schwarmak.dev@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/schwarmak-dev)

### Security Audit

🛡️ **[Camilo Martinez](https://github.com/camilo-martinez)** — Auditoría de seguridad, detección y corrección de 33 vulnerabilidades críticas

---

## 📜 License

MIT © 2025 Schwarmak

---

## ️ Security Audit

> **Auditoría de seguridad realizada por [Camilo Martinez](https://github.com/camilo-martinez)** — El que dirigió la seguridad en el proyecto

Este proyecto fue auditado exhaustivamente y se corrigieron **33 vulnerabilidades** identificadas:

| Severidad | Cantidad | Ejemplos |
|-----------|----------|----------|
| 🔴 Crítica | 5 | Credenciales expuestas, SQL sin autenticación |
| 🟠 Alta | 8 | XSS, memory leaks, race conditions |
| 🟡 Media | 12 | Code quality, RLS policies, session management |
|  Baja | 8 | Accesibilidad, performance, UX |

### Contribución de Camilo Martinez

 **Detección de vulnerabilidades** — Identificó problemas críticos de seguridad incluyendo:
- Credenciales hardcodeadas en código cliente
- Funciones SQL sin autorización (cualquiera podía modificar datos)
- XSS via URLs maliciosas
- Memory leaks y race conditions

🛠️ **Corrección y mejores prácticas** — Guió la implementación de:
- Hash SHA-256 para contraseñas (demo) / bcrypt (producción)
- Row Level Security (RLS) en Supabase
- Rate limiting en login
- Sanitización de URLs y inputs
- Gestión segura de sesiones

---

<div align="center">

**¿Te gustó?** Dale una ⭐ al repo

**¿Necesitas ayuda?** [Ábre un issue](https://github.com/schwarmak-dev/portal-clientes/issues)

---

*Hecho con cariño mi gente, ocupenlo, es todo para ustedes, aprovechenlo, para que puedan seguir con su camino ninja*

</div>
