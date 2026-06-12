// ═══════════════════════════════════════════════════════
//  ⚙️  CONFIGURACIÓN
// ═══════════════════════════════════════════════════════
const SUPABASE_URL      = 'https://zmqwqbmdyjqpqktclvxv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_gbBvt25g9uwyFD91MTGc6w_rf-MT672';
const IS_CONFIGURED     = false;
const DEBUG             = false;

// ═══════════════════════════════════════════════════════
//  CONSTANTES
// ═══════════════════════════════════════════════════════
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAYS   = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];
const SLOTS  = ['09:00','10:00','11:00','14:00','15:00','16:00','17:00'];
const DURATIONS = ['30 min','1 hora','1.5 horas','2 horas'];
const TIMEZONES = ['America/Santiago (GMT-3)','America/Buenos_Aires (GMT-3)','America/Bogota (GMT-5)','America/Lima (GMT-5)','America/Mexico_City (GMT-6)','America/New_York (GMT-4)','Europe/Madrid (GMT+2)','UTC'];
const REMINDER_OPTIONS = ['1 hora antes','1 día antes','Ambos','Ninguno'];
const RECURRENCE_OPTIONS = ['Sin repetir','Semanal','Mensual'];
const MEETING_TEMPLATES = [
  { name:'Revisión semanal', duration:'1 hora', agenda:'Revisión de avances y próximos pasos' },
  { name:'Kick-off', duration:'1.5 horas', agenda:'Presentación del proyecto y definición de alcance' },
  { name:'Demo de avance', duration:'1 hora', agenda:'Demostración de funcionalidades completadas' },
  { name:'Feedback de diseño', duration:'30 min', agenda:'Revisión de propuestas de diseño' },
];
const PRESET_ICONS = ['🖥','📱','🎨','⚙️','⚡','🚀','📊','📋','🔧','💡','✅','🧪','🔍','📐','💻','🌐','🔒','📦','🎯','🖌️','📝','🏗️','🧩','🔗','📸','🎬','🛒','💳','📈','🗂️'];

// ─── Datos demo (fallback cuando Supabase no está configurado) ───────────────
const FALLBACK_PROJECTS = {
  acme: {
    name: 'E-commerce Redesign', client: 'ACME Corp', progress: 78,
    phases: ['Discovery','UX/UI','Desarrollo','QA','Lanzamiento'], phaseDone: 3,
    done: [
      { id:1, name:'Auditoría UX inicial',          date:'12 Mar 2025' },
      { id:2, name:'Wireframes desktop & mobile',   date:'28 Mar 2025' },
      { id:3, name:'Sistema de diseño v1',           date:'10 Abr 2025' },
      { id:4, name:'Homepage + catálogo',            date:'15 May 2025' },
    ],
    wip: [
      { id:5, name:'Módulo de checkout',         date:'En curso' },
      { id:6, name:'Panel de administración',    date:'En curso' },
    ],
    pending: [
      { id:7, name:'Testing de usabilidad', date:'Jun 2025' },
      { id:8, name:'Optimización SEO',      date:'Jun 2025' },
      { id:9, name:'Deploy a producción',   date:'Fin Jun 2025' },
    ],
    evidence: [
      { id:1, title:'Homepage v3 final', date:'15 May 2025', icon:'🖥', note:'' },
      { id:2, title:'Mobile checkout',   date:'12 May 2025', icon:'📱', note:'' },
      { id:3, title:'Design system',     date:'10 Abr 2025', icon:'🎨', note:'' },
    ],
    changes: [
      { id:1, title:'Filtro por precio', type:'Nueva funcionalidad', priority:'Alta', status:'En revisión', date:'10 May 2025', desc:'Slider de rango de precios en la sidebar.', reply:'', seen:true },
    ],
    reuniones: [
      { id:1, dia:20, mes:4, anio:2025, hora:'10:00', nombre:'Carlos Méndez', email:'carlos@acme.com', estado:'Confirmada', duration:'1 hora', timezone:'America/Santiago (GMT-3)', reminder:'Ambos', recurrence:'Sin repetir', videoLink:'https://meet.google.com/abc-defg-hij', agenda:'Revisión de avances del e-commerce y aprobación de mockups finales.', notes:'Se aprobó el diseño final. Pendiente: integrar pasarela de pagos.' },
    ],
  },
  nova: {
    name: 'App Móvil MVP', client: 'Nova Inc', progress: 45,
    phases: ['Research','Diseño','Backend','Frontend','Launch'], phaseDone: 2,
    done: [
      { id:1, name:'Investigación de usuarios', date:'5 Abr 2025' },
      { id:2, name:'UI Kit y componentes',      date:'30 Abr 2025' },
    ],
    wip: [
      { id:3, name:'API REST – autenticación', date:'En curso' },
      { id:4, name:'Pantallas onboarding',     date:'En curso' },
    ],
    pending: [
      { id:5, name:'Dashboard de métricas', date:'Jun 2025' },
      { id:6, name:'Beta testing',           date:'Jul 2025' },
    ],
    evidence: [{ id:1, title:'Flujo de onboarding', date:'30 Abr 2025', icon:'📱', note:'' }],
    changes:  [{ id:1, title:'Login con Google', type:'Nueva funcionalidad', priority:'Media', status:'Pendiente', date:'16 May 2025', desc:'Auth con Google además del email.', reply:'', seen:false }],
    reuniones: [],
  },
  duoc: {
    name:'Proyecto Duocuc', client:'Duocuc', progress:0,
    phases:['Inicio','Desarrollo','Revisión','Entrega'], phaseDone:0,
    done:[], wip:[], pending:[{ id:1, name:'Primera reunión de kick-off', date:'Por definir' }],
    evidence:[], changes:[], reuniones:[],
  },
  sebastian: {
    name:'Proyecto de Sebastian', client:'Sebastian Gonzalez', progress:0,
    phases:['Inicio','Desarrollo','Revisión','Entrega'], phaseDone:0,
    done:[], wip:[], pending:[{ id:1, name:'Primera reunión de kick-off', date:'Por definir' }],
    evidence:[], changes:[], reuniones:[],
  },
};

const LOCAL_USERS = {
  admin:      { name: 'Matias',       project: 'acme', role: 'admin'  },
  acme:       { name: 'Equipo ACME',  project: 'acme', role: 'client' },
  nova:       { name: 'Nova Inc',     project: 'nova', role: 'client' },
  sebastian:  { name: 'Sebastian G.', project: 'sebastian', role: 'client' },
  duoc:       { name: 'Duoc UC',      project: 'duoc', role: 'client' },
};

const DEMO_HASHES = {
  admin:     '509078a8509078a8509078a8509078a8509078a8509078a8509078a8509078a8',
  acme:      '483361be483361be483361be483361be483361be483361be483361be483361be',
  nova:      '038fb702038fb702038fb702038fb702038fb702038fb702038fb702038fb702',
  sebastian: '6dc7b1ee6dc7b1ee6dc7b1ee6dc7b1ee6dc7b1ee6dc7b1ee6dc7b1ee6dc7b1ee',
  duoc:      '2d6e33622d6e33622d6e33622d6e33622d6e33622d6e33622d6e33622d6e3362',
};

async function sha256(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0').repeat(8);
}

// ═══════════════════════════════════════════════════════
//  ESTADO GLOBAL
// ═══════════════════════════════════════════════════════
let currentUser    = null;
let currentProject = null;
let clientTab      = 'overview';
let adminTab       = 'adash';
let calendar       = { y:new Date().getFullYear(), m:new Date().getMonth(), selDay:null, selSlot:null };
let pendingBooking = null;
let replyingId     = null;
let editingTask    = null;
let editingEvId    = null;
let pickedIcon     = '🖥';
let dragItem       = null;
let roadmapLocked  = false;
let projectCache   = {};
let reminderTimers = [];
let pendingEvFile  = null; // { name, type, size, data (base64) }
let meetingFilter  = 'Todas';
let meetingSearch  = '';
let editingMeeting = null;
let adminCalView   = { y:new Date().getFullYear(), m:new Date().getMonth() };
let renderGeneration = 0;

// Sesión: cierre automático por inactividad (30 minutos)
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
let inactivityTimer      = null;

// ═══════════════════════════════════════════════════════
//  CAPA DE DATOS — Supabase REST API
// ═══════════════════════════════════════════════════════
const SB_HEADERS = {
  'apikey':        SUPABASE_ANON_KEY,
  'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
  'Content-Type':  'application/json',
};

function genId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Date.now().toString(36) + Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

async function sbGet(table, queryString) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${queryString}`, { headers: SB_HEADERS });
    if (!res.ok) { log(`[sbGet] ${table}: ${res.status} ${res.statusText}`); return null; }
    return await res.json();
  } catch (e) { log(`[sbGet] ${table} fetch error:`, e.message); return null; }
}

async function sbUpsert(table, body) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method:  'POST',
      headers: { ...SB_HEADERS, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
      body:    JSON.stringify(body),
    });
    if (!res.ok) { log(`[sbUpsert] ${table}: ${res.status} ${res.statusText}`); return { ok: false, error: res.status }; }
    return { ok: true };
  } catch (e) { log(`[sbUpsert] ${table} fetch error:`, e.message); return { ok: false, error: e.message }; }
}

async function loadProject(slug) {
  if (!slug) return null;
  if (IS_CONFIGURED) {
    const rows = await sbGet('projects', `slug=eq.${slug}&select=data,updated_at`);
    if (rows?.length) return rows[0].data;
    const fallback = FALLBACK_PROJECTS[slug];
    return fallback ? JSON.parse(JSON.stringify(fallback)) : null;
  }
  try {
    const stored = localStorage.getItem('portal_v3');
    const all    = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(FALLBACK_PROJECTS));
    return all[slug] || FALLBACK_PROJECTS[slug] || null;
  } catch { return FALLBACK_PROJECTS[slug] ? JSON.parse(JSON.stringify(FALLBACK_PROJECTS[slug])) : null; }
}

function calcProgress(p) {
  const total = (p.done?.length || 0) + (p.wip?.length || 0) + (p.pending?.length || 0);
  if (!total) return 0;
  return Math.round((p.done.length / total) * 100);
}

async function saveProject(slug, data) {
  if (!slug || !data) return { ok: false, error: 'Invalid params' };
  if (IS_CONFIGURED) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/save_project`, {
        method:  'POST',
        headers: { ...SB_HEADERS, 'Prefer': 'return=representation' },
        body:    JSON.stringify({ p_slug: slug, p_data: data }),
      });
      if (!res.ok) { log(`[saveProject] RPC: ${res.status} ${res.statusText}`); return { ok: false, error: res.status }; }
      return { ok: true };
    } catch (e) { log('[saveProject] RPC fetch error:', e.message); return { ok: false, error: e.message }; }
  }
  try {
    const stored = localStorage.getItem('portal_v3');
    const all    = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(FALLBACK_PROJECTS));
    all[slug]    = data;
    const serialized = JSON.stringify(all);
    if (serialized.length > 4.5 * 1024 * 1024) {
      showNotif('Almacenamiento lleno', 'Se superó el límite de almacenamiento local. Considera configurar Supabase.', 8000);
      return { ok: false, error: 'QuotaExceeded' };
    }
    localStorage.setItem('portal_v3', serialized);
    return { ok: true };
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      showNotif('Almacenamiento lleno', 'Se superó el límite de almacenamiento local. Libera espacio.', 8000);
    }
    log('[saveProject] localStorage error:', e.message);
    return { ok: false, error: e.message };
  }
}

async function authenticateUser(username, password) {
  if (IS_CONFIGURED) {
    // Verificación segura: bcrypt en el servidor vía RPC (el hash nunca sale de la BD)
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/verify_login`, {
        method:  'POST',
        headers: { ...SB_HEADERS, 'Prefer': 'return=representation' },
        body:    JSON.stringify({
          p_username: username.toLowerCase(),
          p_password: password,
          p_agent:    navigator.userAgent.slice(0, 200),
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data?.ok) return null;
      return { name: data.display_name, project: data.project_slug, role: data.role };
    } catch { return null; }
  }
  // Fallback local (solo modo demo sin Supabase)
  const user = LOCAL_USERS[username.toLowerCase()];
  if (!user) return null;
  const hash = await sha256(username.toLowerCase() + ':' + password);
  if (DEMO_HASHES[username.toLowerCase()] !== hash) return null;
  return { name: user.name, project: user.project, role: user.role };
}

// ═══════════════════════════════════════════════════════
//  INICIO
// ═══════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', async () => {
  hide('loadingOverlay');
  requestNotifPermission();

  let session = null;
  try {
    const raw = sessionStorage.getItem('portal_session');
    if (raw) {
      const parsed = JSON.parse(raw);
      const MAX_AGE = 24 * 60 * 60 * 1000;
      if (parsed.ts && (Date.now() - parsed.ts) < MAX_AGE) {
        session = parsed;
      } else {
        sessionStorage.removeItem('portal_session');
      }
    }
  } catch (e) { log('[session] restore error:', e.message); }

  if (session) {
    try {
      currentUser    = { username: session.username, name: session.name, project: session.project, role: session.role };
      currentProject = session.role === 'admin' ? 'acme' : session.project;
      projectCache[currentProject] = await loadProject(currentProject);

      if (session.role === 'admin') {
        show('adminShell', 'flex');
        await initAdmin();
      } else {
        show('clientShell', 'flex');
        initClient();
      }
      if (!IS_CONFIGURED) showConfigBanner();
      startInactivityWatcher();
      return;
    } catch (e) {
      log('[session] init error:', e.message);
      currentUser = null;
      currentProject = null;
    }
  }

  show('loginShell', 'flex');
});

// Reinicia el timer cada vez que el usuario hace algo
let debounceTimer = null;
function resetInactivityTimer(debounced = false) {
  if (debounced) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(resetInactivityTimer, 10000);
    return;
  }
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    if (currentUser) {
      showNotif('Sesión cerrada', 'Tu sesión fue cerrada por inactividad de 30 minutos.', 8000);
      setTimeout(logout, 1500);
    }
  }, SESSION_TIMEOUT_MS);
}

const inactivityHandler = () => resetInactivityTimer();
const inactivityDebouncedHandler = () => resetInactivityTimer(true);

function startInactivityWatcher() {
  ['mousemove', 'scroll'].forEach(ev =>
    document.addEventListener(ev, inactivityDebouncedHandler, { passive: true })
  );
  ['keydown', 'click', 'touchstart'].forEach(ev =>
    document.addEventListener(ev, inactivityHandler, { passive: true })
  );
  resetInactivityTimer();
}

function stopInactivityWatcher() {
  clearTimeout(inactivityTimer);
  clearTimeout(debounceTimer);
  ['mousemove', 'scroll'].forEach(ev =>
    document.removeEventListener(ev, inactivityDebouncedHandler)
  );
  ['keydown', 'click', 'touchstart'].forEach(ev =>
    document.removeEventListener(ev, inactivityHandler)
  );
}

// ═══════════════════════════════════════════════════════
//  AUTENTICACIÓN
// ═══════════════════════════════════════════════════════
document.getElementById('loginBtn').addEventListener('click', doLogin);
['lu', 'lp'].forEach(id =>
  document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); })
);

let loginAttempts = 0;
let loginLockoutUntil = 0;

async function doLogin() {
  const username = document.getElementById('lu').value.trim().toLowerCase();
  const password = document.getElementById('lp').value;
  const errorEl  = document.getElementById('loginErr');

  if (Date.now() < loginLockoutUntil) {
    const secs = Math.ceil((loginLockoutUntil - Date.now()) / 1000);
    errorEl.textContent = `Demasiados intentos. Espera ${secs}s.`;
    errorEl.style.display = 'block';
    return;
  }

  setLoading(true);
  const user = await authenticateUser(username, password);
  setLoading(false);

  if (!user) {
    loginAttempts++;
    if (loginAttempts >= 5) {
      loginLockoutUntil = Date.now() + 30000;
      loginAttempts = 0;
      errorEl.textContent = 'Demasiados intentos. Espera 30 segundos.';
    } else {
      errorEl.textContent = 'Usuario o contraseña incorrectos.';
    }
    errorEl.style.display = 'block';
    document.getElementById('lp').value = '';
    return;
  }

  loginAttempts = 0;
  loginLockoutUntil = 0;
  errorEl.style.display = 'none';
  errorEl.textContent = 'Usuario o contraseña incorrectos.';
  currentUser = { username, ...user };
  try {
    sessionStorage.setItem('portal_session', JSON.stringify({
      username, name: user.name, project: user.project, role: user.role, ts: Date.now()
    }));
  } catch (e) { log('[session] save error:', e.message); }
  hide('loginShell');

  if (user.role === 'admin') {
    currentProject            = 'acme';
    projectCache[currentProject] = await loadProject(currentProject);
    show('adminShell', 'flex');
    initAdmin();
  } else {
    currentProject            = user.project;
    projectCache[currentProject] = await loadProject(currentProject);
    show('clientShell', 'flex');
    initClient();
  }

  if (!IS_CONFIGURED) showConfigBanner();
  startInactivityWatcher();
}

function logout() {
  currentUser    = null;
  currentProject = null;
  try { sessionStorage.removeItem('portal_session'); } catch {}
  clientTab      = 'overview';
  adminTab       = 'adash';
  calendar       = { y:new Date().getFullYear(), m:new Date().getMonth(), selDay:null, selSlot:null };

  reminderTimers.forEach(t => clearTimeout(t));
  reminderTimers = [];

  ['lu', 'lp'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('loginErr').style.display = 'none';

  stopInactivityWatcher();
  hide('clientShell');
  hide('adminShell');
  show('loginShell', 'flex');
}

// ═══════════════════════════════════════════════════════
//  NOTIFICACIONES
// ═══════════════════════════════════════════════════════
function requestNotifPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function showNotif(title, body, duration = 6000) {
  document.getElementById('notifTitle').textContent = title;
  document.getElementById('notifBody').textContent  = body;
  document.getElementById('notifBanner').classList.add('show');
  setTimeout(() => document.getElementById('notifBanner').classList.remove('show'), duration);
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

function closeNotif() { document.getElementById('notifBanner').classList.remove('show'); }

function scheduleReminders(meeting) {
  reminderTimers.forEach(t => clearTimeout(t));
  reminderTimers = [];
  const now    = Date.now();
  const target = new Date(meeting.anio, meeting.mes, meeting.dia, parseInt(meeting.hora, 10), 0, 0).getTime();
  const reminder = meeting.reminder || '1 hora antes';

  if (reminder === '1 hora antes' || reminder === 'Ambos') {
    const oneHourBefore = target - 3600000;
    if (oneHourBefore > now) {
      const t1 = setTimeout(() => showNotif('Reunión en 1 hora', `${meeting.nombre} · ${meeting.dia} de ${MONTHS[meeting.mes]} · ${meeting.hora}`, 8000), oneHourBefore - now);
      reminderTimers.push(t1);
    }
  }
  if (reminder === '1 día antes' || reminder === 'Ambos') {
    const oneDayBefore = target - 86400000;
    if (oneDayBefore > now) {
      const t2 = setTimeout(() => showNotif('Reunión mañana', `${meeting.nombre} · ${meeting.dia} de ${MONTHS[meeting.mes]} · ${meeting.hora}`, 8000), oneDayBefore - now);
      reminderTimers.push(t2);
    }
  }
  if (target > now) {
    const t3 = setTimeout(() => showNotif('Reunión ahora', `${meeting.nombre} · ${meeting.hora} · ${meeting.email}`, 8000), target - now);
    reminderTimers.push(t3);
  }
}

// ═══════════════════════════════════════════════════════
//  VISTA CLIENTE
// ═══════════════════════════════════════════════════════
function initClient() {
  const project = projectCache[currentProject];
  document.getElementById('cTopProj').textContent = project.name;
  document.getElementById('cAvatar').textContent  = currentUser.name.charAt(0).toUpperCase();
  document.getElementById('cName').textContent    = currentUser.name;

  document.querySelectorAll('#cTabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      clientTab = btn.dataset.tab;
      document.querySelectorAll('#cTabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderClientView();
    });
  });

  renderClientView();
}

async function renderClientView() {
  if (!projectCache[currentProject]) projectCache[currentProject] = await loadProject(currentProject);
  const project = projectCache[currentProject];
  if (!project) return;
  const el      = document.getElementById('cMain');
  el.className  = 'main fadein';

  const views = {
    overview: () => buildClientOverview(project),
    roadmap:  () => buildClientRoadmap(project),
    evidence: () => buildClientEvidence(project),
    calendar: () => buildCalendar(),
    changes:  () => buildClientChanges(project),
  };
  el.innerHTML = views[clientTab]?.() || '';

  animateProgressBar('cProgFill', calcProgress(project));
  if (clientTab === 'calendar') wireCalendar();
  if (clientTab === 'changes')  wireClientChanges();
  if (!IS_CONFIGURED) showConfigBanner();
}

function buildClientOverview(p) {
  const phaseChips = p.phases.map((phase, i) => {
    const cls = i < p.phaseDone ? 'ph-done' : i === p.phaseDone ? 'ph-wip' : 'ph-pend';
    return `<span class="phase-chip ${cls}">${esc(phase)}</span>`;
  }).join('');

  return `
    <div class="g4" style="margin-bottom:12px">
      <div class="stat-card"><div class="stat-lbl">Progreso</div>   <div class="stat-val" style="color:var(--gold)">${calcProgress(p)}%</div>  <div class="stat-sub">Del proyecto</div></div>
      <div class="stat-card"><div class="stat-lbl">Completadas</div><div class="stat-val" style="color:var(--green)">${p.done.length}</div> <div class="stat-sub">Tareas listas</div></div>
      <div class="stat-card"><div class="stat-lbl">En proceso</div> <div class="stat-val" style="color:var(--yellow)">${p.wip.length}</div> <div class="stat-sub">Ahora mismo</div></div>
      <div class="stat-card"><div class="stat-lbl">Pendientes</div> <div class="stat-val" style="color:var(--soft)">${p.pending.length}</div><div class="stat-sub">Por cumplir</div></div>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div>
          <div class="card-title" style="margin-bottom:7px">${esc(p.name)}</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px">${phaseChips}</div>
        </div>
        <div style="font-family:'Syne',sans-serif;font-size:36px;font-weight:700;color:var(--gold);line-height:1;letter-spacing:-1px">
          ${calcProgress(p)}<span style="font-size:14px;color:var(--muted);font-weight:400;font-family:'DM Sans',sans-serif">%</span>
        </div>
      </div>
      <div class="prog-track"><div class="prog-fill" id="cProgFill" style="width:0%"></div></div>
      <div style="font-size:12px;color:var(--muted);margin-top:8px">Cliente: ${esc(p.client)}</div>
    </div>
    <div class="g2">
      <div class="card">
        <div class="card-title">🟡 Trabajando ahora</div>
        ${p.wip.map(t => taskRowHtml(t, 'wip')).join('')}
        <hr style="border:none;border-top:1px solid var(--line);margin:12px 0 10px">
        <div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px">Recién completado</div>
        ${p.done.slice(-2).map(t => taskRowHtml(t, 'done')).join('')}
      </div>
      <div class="card">
        <div class="card-title">⚪ Próximos hitos</div>
        ${p.pending.map(t => taskRowHtml(t, 'pending')).join('')}
      </div>
    </div>`;
}

function buildClientRoadmap(p) {
  const column = (tasks, color, label) => `
    <div class="rm-col">
      <div class="rm-col-hdr">
        <div class="tdot" style="background:${color};width:8px;height:8px;border-radius:50%;flex-shrink:0"></div>
        <div class="rm-col-title" style="color:${color}">${label}</div>
        <div class="rm-count">${tasks.length}</div>
      </div>
      ${tasks.map(t => `
        <div class="rm-task-card" style="cursor:default">
          <div class="rm-task-name">${esc(t.name)}</div>
          <div class="rm-task-date">${esc(t.date)}</div>
        </div>`).join('') || '<div style="font-size:12px;color:var(--muted);text-align:center;padding:8px 0">Sin tareas</div>'}
    </div>`;

  return `
    <div class="card">
      <div class="card-title">Tablero de tareas</div>
      <div class="g3">
        ${column(p.done,    'var(--green)',  '🟢 Completado')}
        ${column(p.wip,     'var(--yellow)', '🟡 En proceso')}
        ${column(p.pending, 'var(--muted)',  '⚪ Por cumplir')}
      </div>
    </div>`;
}

function buildClientEvidence(p) {
  if (!p.evidence.length) return `<div class="card"><div style="color:var(--muted);font-size:13px">Aún no hay evidencias cargadas.</div></div>`;
  return `
    <div class="card">
      <div class="card-title">Evidencias y capturas de avance</div>
      <div class="ev-grid">
        ${p.evidence.map(e => `
          <div class="ev-card">
            <div class="ev-thumb">${e.icon}</div>
            <div class="ev-cap">
              <div class="ev-title">${esc(e.title)}</div>
              <div class="ev-date">${esc(e.date)}</div>
              ${e.note ? `<div style="font-size:11px;color:var(--gold);margin-top:5px">📝 ${esc(e.note)}</div>` : ''}
              ${e.fileName ? `<div style="margin-top:8px"><a href="${e.fileData}" download="${esc(e.fileName)}" class="ev-file-link">📎 ${esc(e.fileName)}</a></div>` : ''}
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}

function buildClientChanges(p) {
  const changeItems = p.changes.length
    ? p.changes.map(c => `
        <div class="cr-item">
          <div class="cr-head"><div class="cr-title">${esc(c.title)}</div>${pillHtml(c.status)}</div>
          <div class="cr-meta">${esc(c.type)} · Prioridad: ${esc(c.priority)} · ${esc(c.date)}</div>
          <div class="cr-desc">${esc(c.desc)}</div>
          ${c.reply ? `<div class="cr-reply">💬 <strong>Respuesta:</strong> ${esc(c.reply)}</div>` : ''}
        </div>`).join('')
    : '<div style="color:var(--muted);font-size:13px">Sin solicitudes aún.</div>';

  return `
    <div class="card">
      <div class="card-title">Nueva solicitud de cambio</div>
      <p style="font-size:13px;color:var(--soft);margin:-6px 0 16px">Describe el ajuste que necesitas.</p>
      <div class="g2" style="margin-bottom:12px">
        <div>
          <label class="flabel">Tipo</label>
          <select class="finput" id="chgType">
            <option value="">Selecciona...</option>
            ${['Ajuste de diseño','Nueva funcionalidad','Corrección de error','Cambio de contenido','Otro'].map(o => `<option>${o}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="flabel">Prioridad</label>
          <select class="finput" id="chgPri">
            <option value="">Selecciona...</option>
            ${['Baja','Media','Alta','Urgente'].map(o => `<option>${o}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="frow"><label class="flabel">Título</label><input class="finput" id="chgTitle" placeholder="Ej: Cambiar colores del header" maxlength="200"></div>
      <div class="frow"><label class="flabel">Descripción</label><textarea class="finput" id="chgDesc" rows="3" placeholder="Describe el cambio con detalle..." maxlength="2000"></textarea></div>
      <button class="btn-gold" style="width:auto;padding:9px 22px" id="chgSubmit">Enviar solicitud</button>
      <div id="chgOk" class="alert-ok" style="display:none">✓ Solicitud enviada.</div>
    </div>
    <div class="card">
      <div class="card-title">Historial de solicitudes</div>
      ${changeItems}
    </div>`;
}

function wireClientChanges() {
  document.getElementById('chgSubmit')?.addEventListener('click', async () => {
    const title    = document.getElementById('chgTitle').value.trim();
    const desc     = document.getElementById('chgDesc').value.trim();
    const type     = document.getElementById('chgType').value;
    const priority = document.getElementById('chgPri').value;
    if (!title || !desc || !type || !priority) { showNotif('Campos incompletos', 'Completa todos los campos.'); return; }

    projectCache[currentProject] = await loadProject(currentProject);
    projectCache[currentProject].changes.unshift({
      id: genId(), title, desc, type, priority,
      status: 'Pendiente',
      date:   new Date().toLocaleDateString('es-CL'),
      reply:  '', seen: false,
    });
    await saveProject(currentProject, projectCache[currentProject]);
    renderClientView();
  });
}

// ═══════════════════════════════════════════════════════
//  VISTA ADMIN
// ═══════════════════════════════════════════════════════
async function initAdmin() {
  document.getElementById('aAdminName').textContent = `⚙ ${currentUser.name}`;
  document.querySelectorAll('#aTabs .tab-btn').forEach(btn =>
    btn.addEventListener('click', () => switchAdminTab(btn.dataset.tab))
  );
  await populateProjectSelect();
  renderAdminView();
}

// Llena el select del admin con los proyectos reales de la BD
// Así nunca hay que editar el HTML para agregar un cliente nuevo
async function populateProjectSelect() {
  const select = document.getElementById('aProjSel');
  if (!select) return;

  if (IS_CONFIGURED) {
    const rows = await sbGet('projects', 'select=slug,data->>name,data->>client&order=slug.asc');
    if (rows?.length) {
      select.innerHTML = rows.map(r =>
        `<option value="${r.slug}">${esc(r.client)} · ${esc(r.name)}</option>`
      ).join('');
      currentProject = rows[0].slug;
      select.value   = currentProject;
      return;
    }
  }

  // Fallback local cuando no hay Supabase configurado
  select.innerHTML = Object.entries(FALLBACK_PROJECTS).map(([slug, p]) =>
    `<option value="${slug}">${esc(p.client)} · ${esc(p.name)}</option>`
  ).join('');
  currentProject = Object.keys(FALLBACK_PROJECTS)[0];
  select.value   = currentProject;
}

async function adminSwitchProj(slug) {
  currentProject = slug;
  if (!projectCache[currentProject]) projectCache[currentProject] = await loadProject(currentProject);
  renderAdminView();
}

function switchAdminTab(tab) {
  adminTab = tab;
  document.querySelectorAll('#aTabs .tab-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.tab === tab)
  );
  renderAdminView();
}

async function renderAdminView() {
  const gen = ++renderGeneration;
  projectCache[currentProject] = await loadProject(currentProject);
  if (gen !== renderGeneration) return;
  const project = projectCache[currentProject];
  if (!project) return;

  const unreadCount   = project.changes.filter(c => !c.seen).length;
  const pendingMeetings = project.reuniones.filter(r => r.estado === 'Solicitada').length;
  document.getElementById('aSolBadge').innerHTML   = unreadCount     ? '<span class="notif-dot"></span>' : '';
  document.getElementById('aReunBadge').innerHTML  = pendingMeetings ? '<span class="notif-dot"></span>' : '';

  const el     = document.getElementById('aMain');
  el.className = 'main fadein';

  const views = {
    adash:        () => buildAdminDash(project),
    aroadmap:     () => buildAdminRoadmap(project),
    aevidence:    () => buildAdminEvidence(project),
    areuniones:   () => buildAdminMeetings(project),
    asolicitudes: () => buildAdminRequests(project),
  };
  el.innerHTML = views[adminTab]?.() || '';

  animateProgressBar('aProgFill', calcProgress(project));

  const wireFns = {
    adash:        () => {},
    aroadmap:     wireAdminRoadmap,
    aevidence:    wireAdminEvidence,
    areuniones:   wireAdminMeetings,
    asolicitudes: wireAdminRequests,
  };
  wireFns[adminTab]?.();
  if (!IS_CONFIGURED) showConfigBanner();
}

// ── Admin: Dashboard ──────────────────────────────────
function buildAdminDash(p) {
  const unread     = p.changes.filter(c => !c.seen);
  const pendingMtg = p.reuniones.filter(r => r.estado === 'Solicitada');
  const lastEv     = p.evidence[p.evidence.length - 1];

  return `
    <div class="g4" style="margin-bottom:12px">
      <div class="stat-card"><div class="stat-lbl">Progreso</div>   <div class="stat-val" style="color:var(--gold)">${calcProgress(p)}%</div>      <div class="stat-sub">Proyecto actual</div></div>
      <div class="stat-card"><div class="stat-lbl">Sin leer</div>   <div class="stat-val" style="color:${unread.length ? 'var(--red)' : 'var(--green)'}">${unread.length}</div>  <div class="stat-sub">Solicitudes</div></div>
      <div class="stat-card"><div class="stat-lbl">Reuniones</div>  <div class="stat-val" style="color:${pendingMtg.length ? 'var(--yellow)' : 'var(--soft)'}">${pendingMtg.length}</div><div class="stat-sub">Por confirmar</div></div>
      <div class="stat-card"><div class="stat-lbl">Evidencias</div> <div class="stat-val" style="color:var(--blue)">${p.evidence.length}</div>  <div class="stat-sub">Subidas</div></div>
    </div>

    <div class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div class="card-title" style="margin-bottom:0">${esc(p.name)} — ${esc(p.client)}</div>
        <div style="font-size:12px;color:var(--muted)">${p.done.length} de ${p.done.length + p.wip.length + p.pending.length} tareas completadas</div>
      </div>
      <div class="prog-track"><div class="prog-fill" id="aProgFill" style="width:0%"></div></div>
    </div>

    ${unread.length ? `
      <div class="card" style="border-color:rgba(248,113,113,.18)">
        <div class="card-title" style="color:var(--red)">⚠ Solicitudes sin revisar (${unread.length})</div>
        ${unread.slice(0,3).map(c => `
          <div class="cr-item">
            <div class="cr-head"><div class="cr-title">${esc(c.title)}</div>${pillHtml(c.status)}</div>
            <div class="cr-meta">${esc(c.type)} · ${esc(c.priority)} · ${esc(c.date)}</div>
          </div>`).join('')}
        <button class="btn-gold" style="width:auto;padding:8px 18px;margin-top:8px" onclick="switchAdminTab('asolicitudes')">Ver todas →</button>
      </div>` : ''}

    ${pendingMtg.length ? `
      <div class="card" style="border-color:rgba(245,158,11,.18)">
        <div class="card-title" style="color:var(--yellow)">🗓 Reuniones por confirmar (${pendingMtg.length})</div>
        ${pendingMtg.map(r => {
          const durLabel = r.duration || '1 hora';
          return `
          <div class="cr-item">
            <div class="cr-head">
              <div class="cr-title">${esc(r.nombre)}</div><span class="pill pill-yellow">Solicitada</span>
            </div>
            <div class="cr-meta">${r.dia} de ${MONTHS[r.mes]} ${r.anio} · ${r.hora} · ${durLabel} · ${r.email}</div>
            ${r.agenda ? `<div class="meeting-agenda" style="margin-top:6px"> ${esc(r.agenda)}</div>` : ''}
          </div>`;
        }).join('')}
        <button class="btn-gold" style="width:auto;padding:8px 18px;margin-top:8px" onclick="switchAdminTab('areuniones')">Gestionar →</button>
      </div>` : ''}

    <div class="g2">
      <div class="card">
        <div class="card-title">Resumen de tareas</div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg3);border-radius:6px"><span style="color:var(--green)">🟢 Completadas</span><span style="font-family:'DM Mono',monospace;font-weight:600">${p.done.length}</span></div>
          <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg3);border-radius:6px"><span style="color:var(--yellow)">🟡 En proceso</span><span style="font-family:'DM Mono',monospace;font-weight:600">${p.wip.length}</span></div>
          <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg3);border-radius:6px"><span style="color:var(--soft)">⚪ Pendientes</span><span style="font-family:'DM Mono',monospace;font-weight:600">${p.pending.length}</span></div>
        </div>
        <button class="btn-ghost" style="width:100%;margin-top:10px" onclick="switchAdminTab('aroadmap')">Editar roadmap →</button>
      </div>
      <div class="card">
        <div class="card-title">Última evidencia</div>
        ${lastEv
          ? `<div class="ev-thumb" style="height:75px;border:1px solid var(--line);border-radius:var(--r);margin-bottom:10px">${lastEv.icon}</div>
             <div style="font-size:13px;font-weight:500">${esc(lastEv.title)}</div>
             <div style="font-size:11px;color:var(--muted)">${esc(lastEv.date)}</div>`
          : '<div style="color:var(--muted);font-size:13px">Sin evidencias aún.</div>'}
        <button class="btn-ghost" style="width:100%;margin-top:10px" onclick="switchAdminTab('aevidence')">Gestionar →</button>
      </div>
    </div>`;
}

// ── Admin: Roadmap ────────────────────────────────────
function buildAdminRoadmap(p) {
  const locked = roadmapLocked;
  const editableColumn = (tasks, col, label, color) => `
    <div class="rm-col" data-col="${col}" id="rmCol_${col}">
      <div class="rm-col-hdr">
        <div class="tdot" style="background:${color};width:8px;height:8px;border-radius:50%;flex-shrink:0"></div>
        <div class="rm-col-title" style="color:${color}">${label}</div>
        <div class="rm-count">${tasks.length}</div>
      </div>
      <div id="rmList_${col}">
        ${tasks.map(t => `
          <div class="rm-task-card" draggable="${locked ? 'false' : 'true'}" data-id="${t.id}" data-col="${col}" style="${locked ? 'opacity:0.7' : ''}">
            <div class="rm-task-name">${esc(t.name)}</div>
            <div class="rm-task-date">${esc(t.date)}</div>
            ${locked ? '' : `<div class="rm-task-actions">
              <button class="rm-task-edit" data-id="${t.id}" data-col="${col}">✏</button>
              <button class="rm-task-del"  data-id="${t.id}" data-col="${col}">✕</button>
            </div>`}
          </div>`).join('') || '<div style="font-size:12px;color:var(--muted);text-align:center;padding:12px 0;border:1px dashed var(--line);border-radius:6px">Arrastra aquí</div>'}
      </div>
      ${locked ? '' : `<div class="add-row">
        <input id="rmNew_${col}" placeholder="+ Nueva tarea...">
        <button class="btn-sm rm-add-btn" data-col="${col}">Agregar</button>
      </div>`}
    </div>`;

  const phaseSelects = p.phases.map((phase, i) => `
    <div style="display:flex;align-items:center;gap:8px;background:var(--bg3);border:1px solid var(--line);border-radius:6px;padding:8px 12px">
      <span style="font-size:13px;flex:1">${phase}</span>
      <select class="finput" style="padding:5px 10px;font-size:12px;width:auto" id="phSel_${i}">
        <option value="done" ${i < p.phaseDone  ? 'selected' : ''}>✅ Completada</option>
        <option value="wip"  ${i === p.phaseDone ? 'selected' : ''}>🔄 En proceso</option>
        <option value="pend" ${i > p.phaseDone  ? 'selected' : ''}>⏳ Pendiente</option>
      </select>
    </div>`).join('');

  return `
    <div class="card" style="margin-bottom:12px">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="card-title" style="margin-bottom:0">Roadmap — Drag & Drop</div>
        <button class="btn-sm" id="toggleLockBtn" style="font-size:16px;padding:4px 10px">${locked ? '🔒' : '🔓'}</button>
      </div>
    </div>
    <div class="g3">
      ${editableColumn(p.done,    'done',    '🟢 Completado', 'var(--green)')}
      ${editableColumn(p.wip,     'wip',     '🟡 En proceso', 'var(--yellow)')}
      ${editableColumn(p.pending, 'pending', '⚪ Por cumplir', 'var(--muted)')}
    </div>
    <div class="card" style="margin-top:12px">
      <div class="card-title">Fases del proyecto</div>
      <div style="display:flex;flex-direction:column;gap:7px">${phaseSelects}</div>
      <button class="btn-gold" style="width:auto;padding:9px 22px;margin-top:14px" id="savePhasesBtn">Guardar fases</button>
    </div>`;
}

function wireAdminRoadmap() {
  // Toggle lock
  document.getElementById('toggleLockBtn')?.addEventListener('click', () => {
    roadmapLocked = !roadmapLocked;
    renderAdminView();
  });

  if (roadmapLocked) return;

  // Drag & drop
  document.querySelectorAll('.rm-task-card').forEach(card => {
    card.addEventListener('dragstart', e => {
      dragItem = { id: card.dataset.id, col: card.dataset.col };
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      document.querySelectorAll('.rm-col').forEach(c => c.classList.remove('drag-over'));
    });
  });

  ['done', 'wip', 'pending'].forEach(colId => {
    const col = document.getElementById(`rmCol_${colId}`);
    if (!col) return;
    col.addEventListener('dragover',  e => { e.preventDefault(); col.classList.add('drag-over'); });
    col.addEventListener('dragleave', ()  => col.classList.remove('drag-over'));
    col.addEventListener('drop', async e => {
      e.preventDefault();
      col.classList.remove('drag-over');
      if (!dragItem || dragItem.col === colId) { dragItem = null; return; }

      const { id, col: fromCol } = dragItem;
      const task = projectCache[currentProject][fromCol].find(t => String(t.id) === String(id));
      if (!task) { dragItem = null; return; }

      const dateByCol = {
        done:    `${new Date().getDate()} ${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`,
        wip:     'En curso',
        pending: 'Por definir',
      };
      task.date = dateByCol[colId];

      projectCache[currentProject][fromCol] = projectCache[currentProject][fromCol].filter(t => String(t.id) !== String(id));
      projectCache[currentProject][colId].push(task);
      await saveProject(currentProject, projectCache[currentProject]);
      dragItem = null;
      renderAdminView();
    });
  });

  // Editar / eliminar tarea
  document.querySelectorAll('.rm-task-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const task = projectCache[currentProject][btn.dataset.col].find(t => String(t.id) === String(btn.dataset.id));
      if (!task) return;
      editingTask = { id: btn.dataset.id, col: btn.dataset.col };
      document.getElementById('taskEditName').value = task.name;
      document.getElementById('taskEditDate').value = task.date;
      openModal('taskModal', 'taskEditName');
    });
  });

  document.querySelectorAll('.rm-task-del').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Eliminar esta tarea?')) return;
      projectCache[currentProject][btn.dataset.col] = projectCache[currentProject][btn.dataset.col].filter(t => String(t.id) !== String(btn.dataset.id));
      await saveProject(currentProject, projectCache[currentProject]);
      renderAdminView();
    });
  });

  // Agregar tarea
  document.querySelectorAll('.rm-add-btn').forEach(btn => btn.addEventListener('click', () => addTask(btn.dataset.col)));
  ['done', 'wip', 'pending'].forEach(col =>
    document.getElementById(`rmNew_${col}`)?.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(col); })
  );

  // Guardar fases
  document.getElementById('savePhasesBtn')?.addEventListener('click', async () => {
    let newPhaseDone = 0;
    projectCache[currentProject].phases.forEach((_, i) => {
      const val = document.getElementById(`phSel_${i}`)?.value;
      if (val === 'done') newPhaseDone = i + 1;
      if (val === 'wip')  newPhaseDone = i;
    });
    projectCache[currentProject].phaseDone = newPhaseDone;
    await saveProject(currentProject, projectCache[currentProject]);
    renderAdminView();
  });
}

async function addTask(col) {
  const input = document.getElementById(`rmNew_${col}`);
  const name  = input?.value.trim();
  if (!name) return;

  const dateByCol = {
    done:    `${new Date().getDate()} ${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`,
    wip:     'En curso',
    pending: 'Por definir',
  };
  projectCache[currentProject][col].push({ id: genId(), name, date: dateByCol[col] });
  await saveProject(currentProject, projectCache[currentProject]);
  renderAdminView();
}

async function saveTaskEdit() {
  const name = document.getElementById('taskEditName').value.trim();
  const date = document.getElementById('taskEditDate').value.trim();
  if (!name) { showNotif('Campo obligatorio', 'El nombre es obligatorio.'); return; }

  const task = projectCache[currentProject][editingTask.col].find(t => String(t.id) === String(editingTask.id));
  if (task) { task.name = name; if (date) task.date = date; }

  await saveProject(currentProject, projectCache[currentProject]);
  closeModal('taskModal');
  renderAdminView();
}

// ── Admin: Evidencias ─────────────────────────────────
function buildAdminEvidence(p) {
  return `
    <div class="card">
      <div class="card-title">Gestión de evidencias</div>
      <div style="font-size:12px;color:var(--muted);margin:-6px 0 14px">Sube capturas y archivos de avance. El cliente los ve de inmediato.</div>
      <div class="ev-grid">
        ${p.evidence.map(e => `
          <div style="background:var(--bg3);border:1px solid var(--line);border-radius:var(--r);overflow:hidden">
            <div class="ev-thumb">${e.icon}</div>
            <div class="ev-cap" style="padding:10px 12px">
              <div style="font-size:13px;font-weight:500;margin-bottom:4px">${esc(e.title)}</div>
              <div style="font-size:11px;color:var(--muted);margin-bottom:4px">${esc(e.date)}</div>
              ${e.note ? `<div style="font-size:11px;color:var(--gold);margin-bottom:6px">📝 ${esc(e.note)}</div>` : ''}
              ${e.fileName ? `<div style="font-size:11px;color:var(--soft);display:flex;align-items:center;gap:4px;margin-bottom:6px"><span>📎</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${esc(e.fileName)}</span></div>` : ''}
              <div style="display:flex;gap:6px;margin-top:6px">
                <button class="btn-sm ev-edit-btn" data-evid="${e.id}" style="flex:1">Editar</button>
                <button class="btn-danger ev-del-btn" data-evid="${e.id}" style="flex:1">Eliminar</button>
              </div>
            </div>
          </div>`).join('')}
        <div class="upload-zone" id="addEvBtn" style="min-height:200px">
          <div style="font-size:26px;color:var(--muted)">＋</div>
          <div style="font-size:12px;color:var(--muted)">Agregar evidencia<br><span style="color:var(--gold)">Solo tú puedes subir</span></div>
        </div>
      </div>
    </div>`;
}

function wireAdminEvidence() {
  document.querySelectorAll('.ev-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ev = projectCache[currentProject].evidence.find(e => String(e.id) === String(btn.dataset.evid));
      if (!ev) return;
      editingEvId = ev.id;
      document.getElementById('evEditTitle').value = ev.title;
      document.getElementById('evEditDate').value = ev.date;
      document.getElementById('evEditNote').value = ev.note || '';

      const grid = document.getElementById('evEditIconGrid');
      grid.innerHTML = PRESET_ICONS.map(icon =>
        `<div class="icon-opt${icon === ev.icon ? ' picked' : ''}" data-icon="${icon}">${icon}</div>`
      ).join('');
      grid.querySelectorAll('.icon-opt').forEach(opt => {
        opt.addEventListener('click', () => {
          grid.querySelectorAll('.icon-opt').forEach(x => x.classList.remove('picked'));
          opt.classList.add('picked');
        });
      });

      openModal('evEditModal', 'evEditTitle');
    });
  });

  document.querySelectorAll('.ev-del-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Eliminar esta evidencia?')) return;
      projectCache[currentProject].evidence = projectCache[currentProject].evidence.filter(e => String(e.id) !== String(btn.dataset.evid));
      await saveProject(currentProject, projectCache[currentProject]);
      renderAdminView();
    });
  });

  document.getElementById('addEvBtn')?.addEventListener('click', () => {
    ['evTitle', 'evDate', 'evNote'].forEach(id => document.getElementById(id).value = '');
    clearEvFile();
    pickedIcon = '🖥';
    const grid = document.getElementById('iconGrid');
    grid.innerHTML = PRESET_ICONS.map(icon =>
      `<div class="icon-opt${icon === pickedIcon ? ' picked' : ''}" data-icon="${icon}">${icon}</div>`
    ).join('');
    grid.querySelectorAll('.icon-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        pickedIcon = opt.dataset.icon;
        grid.querySelectorAll('.icon-opt').forEach(x => x.classList.remove('picked'));
        opt.classList.add('picked');
      });
    });

    // Wire file upload
    const fileZone  = document.getElementById('evFileZone');
    const fileInput = document.getElementById('evFileInput');
    fileZone.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        showNotif('Archivo muy grande', 'El archivo supera el límite de 5MB.');
        fileInput.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        pendingEvFile = { name: file.name, type: file.type, size: file.size, data: ev.target.result };
        document.getElementById('evFileName').textContent = file.name;
        document.getElementById('evFilePreview').style.display = 'flex';
      };
      reader.readAsDataURL(file);
    };

    openModal('evModal', 'evTitle');
  });
}

function clearEvFile() {
  pendingEvFile = null;
  const preview = document.getElementById('evFilePreview');
  if (preview) preview.style.display = 'none';
  const fileInput = document.getElementById('evFileInput');
  if (fileInput) fileInput.value = '';
}

async function saveEvidence() {
  const title  = document.getElementById('evTitle').value.trim();
  const date   = document.getElementById('evDate').value.trim() || 'Sin fecha';
  const note   = document.getElementById('evNote').value.trim();
  const icon   = pickedIcon || '';
  if (!title) { showNotif('Campo obligatorio', 'El título es obligatorio.'); return; }

  const evidence = { id: genId(), title, date, icon, note };
  if (pendingEvFile) {
    evidence.fileName = pendingEvFile.name;
    evidence.fileType = pendingEvFile.type;
    evidence.fileSize = pendingEvFile.size;
    evidence.fileData = pendingEvFile.data;
  }

  projectCache[currentProject].evidence.push(evidence);
  await saveProject(currentProject, projectCache[currentProject]);
  closeModal('evModal');
  clearEvFile();
  renderAdminView();
}

async function saveEvidenceEdit() {
  const title = document.getElementById('evEditTitle').value.trim();
  const date  = document.getElementById('evEditDate').value.trim() || 'Sin fecha';
  const note  = document.getElementById('evEditNote').value.trim();
  const iconEl = document.querySelector('#evEditIconGrid .icon-opt.picked');
  const icon  = iconEl ? iconEl.dataset.icon : '';
  if (!title) { showNotif('Campo obligatorio', 'El título es obligatorio.'); return; }

  const ev = projectCache[currentProject].evidence.find(e => String(e.id) === String(editingEvId));
  if (ev) {
    ev.title = title;
    ev.date  = date;
    ev.note  = note;
    ev.icon  = icon;
  }

  await saveProject(currentProject, projectCache[currentProject]);
  closeModal('evEditModal');
  renderAdminView();
}

// ── Admin: Reuniones ──────────────────────────────────
function buildAdminMeetings(p) {
  const meetings = p.reuniones || [];
  const now = new Date();
  const thisMonth = meetings.filter(r => r.mes === now.getMonth() && r.anio === now.getFullYear());
  const confirmed = thisMonth.filter(r => r.estado === 'Confirmada').length;
  const cancelled = thisMonth.filter(r => r.estado === 'Cancelada').length;
  const total = thisMonth.length;
  const cancelRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;
  const durMap = { '30 min': 30, '1 hora': 60, '1.5 horas': 90, '2 horas': 120 };
  const avgDur = thisMonth.filter(r => r.estado === 'Confirmada' && durMap[r.duration]).reduce((sum, r) => sum + (durMap[r.duration] || 60), 0) / (confirmed || 1);

  const filtered = meetings.filter(r => {
    if (meetingFilter !== 'Todas' && r.estado !== meetingFilter) return false;
    if (meetingSearch && !r.nombre.toLowerCase().includes(meetingSearch.toLowerCase())) return false;
    return true;
  });

  const filterBtns = ['Todas','Confirmadas','Solicitadas','Canceladas'].map(f =>
    `<button class="filter-btn${meetingFilter === f ? ' active' : ''}" data-filter="${f}">${f} <span style="opacity:.6;font-size:10px">${meetings.filter(r => f === 'Todas' || r.estado === f).length}</span></button>`
  ).join('');

  const meetingItems = filtered.length
    ? filtered.map(r => {
        const durLabel = r.duration || '1 hora';
        const tzLabel = r.timezone ? r.timezone.split(' ')[0].replace('America/','').replace('Europe/','').replace('_',' ') : '';
        return `
        <div class="cr-item meeting-item" data-meetid="${r.id}">
          <div class="cr-head">
            <div style="flex:1">
              <div class="cr-title">${esc(r.nombre)}</div>
              <div class="cr-meta">${r.dia} de ${MONTHS[r.mes]} ${r.anio} · ${r.hora} · ${durLabel}${tzLabel ? ' · ' + tzLabel : ''}</div>
              ${r.videoLink ? `<div style="margin-top:4px"><a href="${safeUrl(r.videoLink)}" target="_blank" rel="noopener noreferrer" class="video-link"> Unirse a la videollamada</a></div>` : ''}
            </div>
            <div style="display:flex;align-items:center;gap:7px;flex-shrink:0">
              ${pillHtml(r.estado)}
              ${r.estado === 'Solicitada' ? `
                <button class="btn-sm" style="color:var(--green);border-color:rgba(74,222,128,.2)" data-reid="${r.id}" data-action="Confirmada">✓ Aceptar</button>
                <button class="btn-danger" data-reid="${r.id}" data-action="Cancelada">✕</button>` : ''}
              ${r.estado === 'Confirmada' ? `
                <button class="btn-sm" data-reid="${r.id}" data-action="edit"> Editar</button>
                <button class="btn-danger" data-reid="${r.id}" data-action="Cancelada">Cancelar</button>` : ''}
              ${r.estado === 'Cancelada' ? `
                <button class="btn-sm" data-reid="${r.id}" data-action="Confirmada">Reactivar</button>` : ''}
            </div>
          </div>
          ${r.agenda ? `<div class="meeting-agenda">📋 ${esc(r.agenda)}</div>` : ''}
          ${r.notes ? `<div class="meeting-notes"> <strong>Notas:</strong> ${esc(r.notes)}</div>` : ''}
          ${r.recurrence && r.recurrence !== 'Sin repetir' ? `<div style="margin-top:6px;font-size:11px;color:var(--blue)">🔄 Recurrencia: ${esc(r.recurrence)}</div>` : ''}
          ${r.estado === 'Confirmada' ? `<div class="alert-ok" style="margin-top:8px;font-size:12px">✅ Confirmada — Recordatorio: ${r.reminder || '1 hora antes'}</div>` : ''}
          <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
            <button class="btn-sm" data-reid="${r.id}" data-action="export">📥 Exportar .ics</button>
            ${r.estado === 'Confirmada' ? `<button class="btn-sm" data-reid="${r.id}" data-action="addNotes">📝 Notas post-reunión</button>` : ''}
          </div>
        </div>`;
      }).join('')
    : '<div style="color:var(--muted);font-size:13px;padding:8px 0">No hay reuniones' + (meetingSearch ? ' con ese nombre' : '') + '.</div>';

  const adminCal = buildAdminMiniCalendar(p);

  return `
    <div class="g4" style="margin-bottom:12px">
      <div class="stat-card"><div class="stat-lbl">Este mes</div><div class="stat-val" style="color:var(--gold)">${total}</div><div class="stat-sub">Reuniones</div></div>
      <div class="stat-card"><div class="stat-lbl">Confirmadas</div><div class="stat-val" style="color:var(--green)">${confirmed}</div><div class="stat-sub">Activas</div></div>
      <div class="stat-card"><div class="stat-lbl">Cancelación</div><div class="stat-val" style="color:${cancelRate > 30 ? 'var(--red)' : 'var(--soft)'}">${cancelRate}%</div><div class="stat-sub">Tasa este mes</div></div>
      <div class="stat-card"><div class="stat-lbl">Duración prom.</div><div class="stat-val" style="color:var(--blue)">${Math.round(avgDur)}<span style="font-size:12px;color:var(--muted)">min</span></div><div class="stat-sub">Promedio</div></div>
    </div>

    <div class="card">
      <div class="card-title">Calendario visual</div>
      ${adminCal}
    </div>

    <div class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px">
        <div class="card-title" style="margin-bottom:0">Reuniones del cliente</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">${filterBtns}</div>
      </div>
      <div style="margin-bottom:14px">
        <input class="finput" id="meetSearch" placeholder="🔍 Buscar por nombre..." value="${esc(meetingSearch)}" style="max-width:300px">
      </div>
      ${meetingItems}
    </div>

    <div class="card">
      <div class="card-title">Agregar reunión</div>
      <div style="margin-bottom:12px">
        <div style="font-size:12px;color:var(--muted);margin-bottom:8px">Usar plantilla:</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${MEETING_TEMPLATES.map((t, i) => `<button class="btn-sm tpl-btn" data-tpl="${i}">${t.name}</button>`).join('')}
        </div>
      </div>
      <div class="g2">
        <div class="frow"><label class="flabel">Nombre</label><input class="finput" id="rNom" placeholder="Nombre Apellido" maxlength="100"></div>
        <div class="frow"><label class="flabel">Email</label><input class="finput" id="rEmail" type="email" placeholder="cliente@email.com" maxlength="200"></div>
      </div>
      <div class="g3">
        <div class="frow"><label class="flabel">Día</label><input class="finput" id="rDia" type="number" min="1" max="31" placeholder="15"></div>
        <div class="frow"><label class="flabel">Mes</label><select class="finput" id="rMes">${MONTHS.map((m,i) => `<option value="${i}">${m}</option>`).join('')}</select></div>
        <div class="frow"><label class="flabel">Hora</label><select class="finput" id="rHora">${SLOTS.map(s => `<option>${s}</option>`).join('')}</select></div>
      </div>
      <div class="g3">
        <div class="frow"><label class="flabel">Duración</label><select class="finput" id="rDur">${DURATIONS.map(d => `<option>${d}</option>`).join('')}</select></div>
        <div class="frow"><label class="flabel">Zona horaria</label><select class="finput" id="rTz">${TIMEZONES.map(t => `<option>${t}</option>`).join('')}</select></div>
        <div class="frow"><label class="flabel">Recordatorio</label><select class="finput" id="rRem">${REMINDER_OPTIONS.map(r => `<option>${r}</option>`).join('')}</select></div>
      </div>
      <div class="g2">
        <div class="frow"><label class="flabel">Recurrencia</label><select class="finput" id="rRec">${RECURRENCE_OPTIONS.map(r => `<option>${r}</option>`).join('')}</select></div>
        <div class="frow"><label class="flabel">Link videollamada</label><input class="finput" id="rVideo" placeholder="https://meet.google.com/..." maxlength="500"></div>
      </div>
      <div class="frow"><label class="flabel">Agenda / Temas a tratar</label><textarea class="finput" id="rAgenda" rows="2" placeholder="Describe los temas de la reunión..." maxlength="2000"></textarea></div>
      <button class="btn-gold" style="width:auto;padding:9px 22px" id="addMeetingBtn">Agregar y confirmar</button>
      <div id="reuOk" class="alert-ok" style="display:none">✓ Reunión agregada. Recordatorios activados.</div>
    </div>`;
}

function buildAdminMiniCalendar(p) {
  const { y, m } = adminCalView;
  const firstWeekday = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const meetings = p.reuniones || [];
  const today = new Date();

  let dayCells = '';
  for (let i = 0; i < firstWeekday; i++) dayCells += '<div class="cal-d"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;
    const dayMeetings = meetings.filter(r => r.dia === d && r.mes === m && r.anio === y && r.estado !== 'Cancelada');
    const hasMeeting = dayMeetings.length > 0;
    let cls = 'cal-d' + (isToday ? ' today' : '');
    if (hasMeeting) cls += ' hasbk';
    dayCells += `<div class="${cls}" data-acal-day="${d}">${d}${hasMeeting ? `<div class="cal-meet-dots">${dayMeetings.map(r => `<span class="cal-meet-dot" style="background:${r.estado === 'Confirmada' ? 'var(--green)' : 'var(--yellow)'}" title="${esc(r.nombre)} · ${r.hora}"></span>`).join('')}</div>` : ''}</div>`;
  }

  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <button class="btn-sm" id="acalPrev">‹ Mes anterior</button>
      <div style="font-family:'Syne',sans-serif;font-weight:600;font-size:13px">${MONTHS[m]} ${y}</div>
      <button class="btn-sm" id="acalNext">Mes siguiente ›</button>
    </div>
    <div class="cal-grid-wrap">
      ${DAYS.map(d => `<div class="cal-dh">${d}</div>`).join('')}
      ${dayCells}
    </div>
    <div style="margin-top:8px;display:flex;gap:12px;font-size:11px;color:var(--muted)">
      <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);margin-right:4px"></span>Confirmada</span>
      <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--yellow);margin-right:4px"></span>Solicitada</span>
    </div>`;
}

function wireAdminMeetings() {
  document.querySelectorAll('[data-reid]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const meeting = projectCache[currentProject].reuniones.find(r => String(r.id) === String(btn.dataset.reid));
      if (!meeting) return;
      const action = btn.dataset.action;

      if (action === 'edit') {
        editingMeeting = meeting;
        openEditMeetingModal(meeting);
        return;
      }
      if (action === 'export') {
        exportMeetingIcs(meeting);
        return;
      }
      if (action === 'addNotes') {
        openNotesModal(meeting);
        return;
      }

      meeting.estado = action;
      await saveProject(currentProject, projectCache[currentProject]);
      if (meeting.estado === 'Confirmada') {
        scheduleReminders(meeting);
        showNotif('Reunión confirmada ✅', `${meeting.nombre} · ${meeting.dia} de ${MONTHS[meeting.mes]} · ${meeting.hora}`);
      }
      renderAdminView();
    });
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      meetingFilter = btn.dataset.filter;
      renderAdminView();
    });
  });

  const searchInput = document.getElementById('meetSearch');
  if (searchInput) {
    let searchDebounce;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        meetingSearch = searchInput.value;
        renderAdminView();
        setTimeout(() => {
          const si = document.getElementById('meetSearch');
          if (si) { si.focus(); si.setSelectionRange(si.value.length, si.value.length); }
        }, 50);
      }, 300);
    });
  }

  document.querySelectorAll('.tpl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tpl = MEETING_TEMPLATES[parseInt(btn.dataset.tpl)];
      document.getElementById('rAgenda').value = tpl.agenda;
      document.getElementById('rDur').value = tpl.duration;
    });
  });

  document.getElementById('acalPrev')?.addEventListener('click', () => {
    let { y, m } = adminCalView;
    m--; if (m < 0) { m = 11; y--; }
    adminCalView = { y, m };
    renderAdminView();
  });
  document.getElementById('acalNext')?.addEventListener('click', () => {
    let { y, m } = adminCalView;
    m++; if (m > 11) { m = 0; y++; }
    adminCalView = { y, m };
    renderAdminView();
  });

  document.getElementById('addMeetingBtn')?.addEventListener('click', async () => {
    const nombre = document.getElementById('rNom').value.trim();
    const email  = document.getElementById('rEmail').value.trim();
    const dia    = parseInt(document.getElementById('rDia').value, 10);
    const mes    = parseInt(document.getElementById('rMes').value, 10);
    const hora   = document.getElementById('rHora').value;
    const duration = document.getElementById('rDur').value;
    const timezone = document.getElementById('rTz').value;
    const reminder = document.getElementById('rRem').value;
    const recurrence = document.getElementById('rRec').value;
    const videoLink = document.getElementById('rVideo').value.trim();
    const agenda = document.getElementById('rAgenda').value.trim();
    if (!nombre || !email || isNaN(dia)) { showNotif('Campos incompletos', 'Completa nombre, email y día.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showNotif('Email inválido', 'Revisa el formato del email.'); return; }

    const meeting = {
      id: genId(), dia, mes, anio: new Date().getFullYear(), hora, nombre, email,
      estado: 'Confirmada', duration, timezone, reminder, recurrence, videoLink, agenda, notes: ''
    };
    projectCache[currentProject].reuniones.push(meeting);
    await saveProject(currentProject, projectCache[currentProject]);

    scheduleReminders(meeting);
    showNotif('Reunión confirmada ✅', `${nombre} · ${dia} de ${MONTHS[mes]} · ${hora}`);

    const okEl = document.getElementById('reuOk');
    if (okEl) { okEl.style.display = 'block'; setTimeout(() => okEl.style.display = 'none', 4000); }
    renderAdminView();
  });
}

function openEditMeetingModal(meeting) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay open';
  modal.id = 'editMeetModal';
  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-title">Editar reunión</div>
      <div class="modal-sub">${esc(meeting.nombre)} · ${meeting.dia} de ${MONTHS[meeting.mes]} ${meeting.anio}</div>
      <div class="frow"><label class="flabel">Hora</label><select class="finput" id="emHora">${SLOTS.map(s => `<option${s === meeting.hora ? ' selected' : ''}>${s}</option>`).join('')}</select></div>
      <div class="frow"><label class="flabel">Duración</label><select class="finput" id="emDur">${DURATIONS.map(d => `<option${d === meeting.duration ? ' selected' : ''}>${d}</option>`).join('')}</select></div>
      <div class="frow"><label class="flabel">Zona horaria</label><select class="finput" id="emTz">${TIMEZONES.map(t => `<option${t === meeting.timezone ? ' selected' : ''}>${t}</option>`).join('')}</select></div>
      <div class="frow"><label class="flabel">Recordatorio</label><select class="finput" id="emRem">${REMINDER_OPTIONS.map(r => `<option${r === meeting.reminder ? ' selected' : ''}>${r}</option>`).join('')}</select></div>
      <div class="frow"><label class="flabel">Recurrencia</label><select class="finput" id="emRec">${RECURRENCE_OPTIONS.map(r => `<option${r === meeting.recurrence ? ' selected' : ''}>${r}</option>`).join('')}</select></div>
      <div class="frow"><label class="flabel">Link videollamada</label><input class="finput" id="emVideo" value="${esc(meeting.videoLink || '')}" placeholder="https://meet.google.com/..." maxlength="500"></div>
      <div class="frow"><label class="flabel">Agenda</label><textarea class="finput" id="emAgenda" rows="2" maxlength="2000">${esc(meeting.agenda || '')}</textarea></div>
      <div class="modal-actions">
        <button class="btn-cancel" onclick="closeModal('editMeetModal');document.getElementById('editMeetModal').remove()">Cancelar</button>
        <button class="btn-confirm" id="saveEditMeetBtn">Guardar</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  document.getElementById('saveEditMeetBtn').addEventListener('click', async () => {
    meeting.hora = document.getElementById('emHora').value;
    meeting.duration = document.getElementById('emDur').value;
    meeting.timezone = document.getElementById('emTz').value;
    meeting.reminder = document.getElementById('emRem').value;
    meeting.recurrence = document.getElementById('emRec').value;
    meeting.videoLink = document.getElementById('emVideo').value.trim();
    meeting.agenda = document.getElementById('emAgenda').value.trim();
    await saveProject(currentProject, projectCache[currentProject]);
    closeModal('editMeetModal');
    document.getElementById('editMeetModal').remove();
    renderAdminView();
  });
}

function openNotesModal(meeting) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay open';
  modal.id = 'notesModal';
  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-title">Notas post-reunión</div>
      <div class="modal-sub">${esc(meeting.nombre)} · ${meeting.dia} de ${MONTHS[meeting.mes]}</div>
      <div class="frow"><label class="flabel">Notas / Resumen</label><textarea class="finput" id="notesText" rows="4" placeholder="Escribe el resumen de la reunión..." maxlength="5000">${esc(meeting.notes || '')}</textarea></div>
      <div class="modal-actions">
        <button class="btn-cancel" onclick="closeModal('notesModal');document.getElementById('notesModal').remove()">Cancelar</button>
        <button class="btn-confirm" id="saveNotesBtn">Guardar notas</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  document.getElementById('saveNotesBtn').addEventListener('click', async () => {
    meeting.notes = document.getElementById('notesText').value.trim();
    await saveProject(currentProject, projectCache[currentProject]);
    closeModal('notesModal');
    document.getElementById('notesModal').remove();
    renderAdminView();
  });
}

function exportMeetingIcs(meeting) {
  const dtStart = `${meeting.anio}${String(meeting.mes + 1).padStart(2, '0')}${String(meeting.dia).padStart(2, '0')}T${meeting.hora.replace(':', '')}00`;
  const durMin = { '30 min': 30, '1 hora': 60, '1.5 horas': 90, '2 horas': 120 }[meeting.duration] || 60;
  const endDate = new Date(meeting.anio, meeting.mes, meeting.dia, parseInt(meeting.hora.split(':')[0]), parseInt(meeting.hora.split(':')[1]) + durMin);
  const dtEnd = `${endDate.getFullYear()}${String(endDate.getMonth() + 1).padStart(2, '0')}${String(endDate.getDate()).padStart(2, '0')}T${String(endDate.getHours()).padStart(2, '0')}${String(endDate.getMinutes()).padStart(2, '0')}00`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Portal Clientes//ES',
    'BEGIN:VEVENT',
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${meeting.nombre} - Reunión`,
    `DESCRIPTION:${(meeting.agenda || '').replace(/\n/g, '\\n')}`,
    meeting.videoLink ? `URL:${meeting.videoLink}` : '',
    `ORGANIZER;CN=Matias:mailto:schwarmak.dev@gmail.com`,
    `ATTENDEE;CN=${meeting.nombre}:mailto:${meeting.email}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reunion_${meeting.nombre.replace(/\s+/g, '_')}_${meeting.dia}-${meeting.mes + 1}-${meeting.anio}.ics`;
  a.click();
  URL.revokeObjectURL(url);
  showNotif('📥 Exportado', `Archivo .ics descargado para "${meeting.nombre}"`);
}

// ── Admin: Solicitudes ────────────────────────────────
function buildAdminRequests(p) {
  // Marcar todas como vistas (se persiste en el siguiente saveProject)
  p.changes.forEach(c => c.seen = true);

  const items = p.changes.length
    ? p.changes.map(c => `
        <div class="cr-item">
          <div class="cr-head">
            <div style="flex:1">
              <div class="cr-title">${esc(c.title)}</div>
              <div class="cr-meta">${esc(c.type)} · Prioridad: <strong style="color:${c.priority==='Urgente'?'var(--red)':c.priority==='Alta'?'var(--yellow)':'var(--soft)'}">${esc(c.priority)}</strong> · ${esc(c.date)}</div>
              <div class="cr-desc" style="margin-top:4px">${esc(c.desc)}</div>
            </div>
            ${pillHtml(c.status)}
          </div>
          ${c.reply ? `<div class="cr-reply">💬 <strong>Tu respuesta:</strong> ${esc(c.reply)}</div>` : ''}
          <div style="display:flex;gap:8px;margin-top:10px">
            <button class="btn-sm reply-btn" data-cid="${c.id}" data-title="${esc(c.title)}" data-status="${c.status}">Responder / cambiar estado</button>
            <button class="btn-danger del-cr-btn" data-cid="${c.id}">Eliminar</button>
          </div>
        </div>`).join('')
    : '<div style="color:var(--muted);font-size:13px">Sin solicitudes.</div>';

  return `
    <div class="card">
      <div class="card-title">Solicitudes del cliente</div>
      <div style="font-size:12px;color:var(--muted);margin:-6px 0 14px">El cliente ve los cambios de estado al instante.</div>
      ${items}
    </div>`;
}

function wireAdminRequests() {
  document.querySelectorAll('.reply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      replyingId = btn.dataset.cid;
      document.getElementById('replyModalSub').textContent = `"${btn.dataset.title}"`;
      document.getElementById('replyStatus').value         = btn.dataset.status;
      document.getElementById('replyText').value           = '';
      openModal('replyModal', 'replyText');
    });
  });

  document.querySelectorAll('.del-cr-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Eliminar esta solicitud?')) return;
      projectCache[currentProject].changes = projectCache[currentProject].changes.filter(c => String(c.id) !== String(btn.dataset.cid));
      await saveProject(currentProject, projectCache[currentProject]);
      renderAdminView();
    });
  });
}

async function submitReply() {
  const status = document.getElementById('replyStatus').value;
  const reply  = document.getElementById('replyText').value.trim();
  const change = projectCache[currentProject].changes.find(c => String(c.id) === String(replyingId));
  if (change) { change.status = status; if (reply) change.reply = reply; }
  await saveProject(currentProject, projectCache[currentProject]);
  closeModal('replyModal');
  renderAdminView();
}

// ═══════════════════════════════════════════════════════
//  CALENDARIO
// ═══════════════════════════════════════════════════════
function buildCalendar() {
  const { y, m, selDay, selSlot } = calendar;
  const firstWeekday  = new Date(y, m, 1).getDay();
  const daysInMonth   = new Date(y, m + 1, 0).getDate();
  const today         = new Date();
  const meetings      = projectCache[currentProject]?.reuniones || [];
  const activeMeetings = meetings.filter(r => r.estado !== 'Cancelada');
  const bookedDays    = new Set(activeMeetings.filter(r => r.mes === m && r.anio === y).map(r => r.dia));

  let dayCells = '';
  for (let i = 0; i < firstWeekday; i++) dayCells += '<div></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const isWeekend = [0, 6].includes(new Date(y, m, d).getDay());
    const isToday   = today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;
    const isSelected = selDay === d;
    const hasBooking = bookedDays.has(d);

    let cls = 'cal-d';
    if (isWeekend) cls += ' we';
    else { cls += ' click'; cls += isSelected ? ' selday' : isToday ? ' today' : ''; }
    if (hasBooking) cls += ' hasbk';
    dayCells += `<div class="${cls}" data-day="${d}">${d}</div>`;
  }

  const bookedSlotIdxs = selDay ? activeMeetings.filter(r => r.mes === m && r.anio === y && r.dia === selDay).map(r => {
    const idx = SLOTS.indexOf(r.hora);
    const durMin = { '30 min': 1, '1 hora': 2, '1.5 horas': 3, '2 horas': 4 }[r.duration] || 2;
    const slots = [];
    for (let i = idx; i < Math.min(idx + durMin, SLOTS.length); i++) slots.push(i);
    return slots;
  }).flat() : [];
  let slotsHtml = '';
  if (selDay) {
    const slotButtons = SLOTS.map((sl, i) => {
      const isBooked   = bookedSlotIdxs.includes(i);
      const isSelected = selSlot === i;
      return `<div class="slot${isBooked ? ' sbooked' : isSelected ? ' selslot' : ''}" data-slot="${i}">${sl}</div>`;
    }).join('');
    slotsHtml = `
      <div style="margin-top:18px;padding-top:16px;border-top:1px solid var(--line)">
        <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px">${selDay} de ${MONTHS[m]} — horarios disponibles</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">${slotButtons}</div>
        ${selSlot !== null ? `<button class="btn-gold" style="margin-top:14px;width:auto;padding:9px 22px" id="reqSlotBtn">Solicitar ${SLOTS[selSlot]} →</button>` : ''}
      </div>`;
  }

  const confirmedMeetings = meetings.filter(r => r.mes === m && r.anio === y && r.estado === 'Confirmada');
  const confirmedHtml = confirmedMeetings.length ? `
    <div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--line)">
      <div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px">Reuniones confirmadas este mes</div>
      ${confirmedMeetings.map(r => {
        const durLabel = r.duration || '1 hora';
        const tzLabel = r.timezone ? r.timezone.split(' ')[0].replace('America/','').replace('Europe/','').replace('_',' ') : '';
        return `
        <div style="display:flex;align-items:flex-start;gap:8px;padding:10px 11px;background:var(--gbg);border:1px solid rgba(74,222,128,.1);border-radius:6px;margin-bottom:6px;font-size:12px">
          <span style="color:var(--green);font-size:14px">✅</span>
          <div style="flex:1;min-width:0">
            <div style="font-weight:500;margin-bottom:2px">${esc(r.nombre)}</div>
            <div style="color:var(--muted);font-family:'DM Mono',monospace;font-size:11px">${r.dia}/${r.mes + 1} · ${r.hora} · ${durLabel}${tzLabel ? ' · ' + tzLabel : ''}</div>
            ${r.agenda ? `<div style="margin-top:4px;font-size:11px;color:var(--soft)">📋 ${esc(r.agenda)}</div>` : ''}
            ${r.videoLink ? `<div style="margin-top:4px"><a href="${safeUrl(r.videoLink)}" target="_blank" rel="noopener noreferrer" class="video-link"> Unirse a la videollamada</a></div>` : ''}
            ${r.notes ? `<div style="margin-top:4px;font-size:11px;color:var(--gold)"> ${esc(r.notes)}</div>` : ''}
          </div>
        </div>`;
      }).join('')}
    </div>` : '';

  return `
    <div class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <div class="card-title" style="margin-bottom:0">Agendar reunión</div>
        <div style="display:flex;align-items:center;gap:8px">
          <button class="btn-sm" id="calPrev">‹</button>
          <div style="font-family:'Syne',sans-serif;font-weight:600;font-size:13px;min-width:140px;text-align:center">${MONTHS[m]} ${y}</div>
          <button class="btn-sm" id="calNext">›</button>
        </div>
      </div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:8px">Los días con punto ya tienen reunión. Al solicitar, Matias debe confirmar.</div>
      <div class="cal-grid-wrap">
        ${DAYS.map(d => `<div class="cal-dh">${d}</div>`).join('')}
        ${dayCells}
      </div>
      ${slotsHtml}
      ${confirmedHtml}
    </div>`;
}

function wireCalendar() {
  const rerender = () => {
    document.getElementById('cMain').innerHTML = buildCalendar();
    wireCalendar();
  };

  document.getElementById('calPrev')?.addEventListener('click', () => {
    let { y, m } = calendar;
    m--; if (m < 0) { m = 11; y--; }
    calendar = { y, m, selDay: null, selSlot: null };
    rerender();
  });
  document.getElementById('calNext')?.addEventListener('click', () => {
    let { y, m } = calendar;
    m++; if (m > 11) { m = 0; y++; }
    calendar = { y, m, selDay: null, selSlot: null };
    rerender();
  });

  document.querySelectorAll('.cal-d.click').forEach(el => {
    el.addEventListener('click', () => {
      calendar.selDay  = parseInt(el.dataset.day, 10);
      calendar.selSlot = null;
      rerender();
    });
  });

  document.querySelectorAll('.slot:not(.sbooked)').forEach(el => {
    el.addEventListener('click', () => {
      calendar.selSlot = parseInt(el.dataset.slot, 10);
      rerender();
    });
  });

  document.getElementById('reqSlotBtn')?.addEventListener('click', () => {
    pendingBooking = { ...calendar };
    const dur = document.getElementById('bookDur')?.value || '1 hora';
    document.getElementById('bookModalSub').textContent = `${calendar.selDay} de ${MONTHS[calendar.m]} ${calendar.y} · ${SLOTS[calendar.selSlot]} · ${dur} — Matias confirmará a la brevedad.`;
    openModal('bookModal', 'bookName');
  });
}

async function finalizeBooking() {
  const nombre = document.getElementById('bookName').value.trim();
  const email  = document.getElementById('bookEmail').value.trim();
  const duration = document.getElementById('bookDur').value;
  const agenda = document.getElementById('bookAgenda').value.trim();
  if (!nombre || !email)          { showNotif('Campos incompletos', 'Completa tu nombre y email.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showNotif('Email inválido', 'Revisa el formato del email.'); return; }

  const { y, m, selDay, selSlot } = pendingBooking;
  projectCache[currentProject] = await loadProject(currentProject);
  projectCache[currentProject].reuniones.push({
    id: genId(), dia: selDay, mes: m, anio: y,
    hora: SLOTS[selSlot], nombre, email, estado: 'Solicitada',
    duration, agenda, timezone: 'America/Santiago (GMT-3)', reminder: '1 hora antes', recurrence: 'Sin repetir', videoLink: '', notes: ''
  });
  await saveProject(currentProject, projectCache[currentProject]);

  calendar.selSlot = null;
  closeModal('bookModal');
  ['bookName', 'bookEmail', 'bookAgenda'].forEach(id => document.getElementById(id).value = '');
  showNotif('Solicitud enviada 📅', `${selDay} de ${MONTHS[m]} a las ${SLOTS[selSlot]}. Matias confirmará pronto.`);

  document.getElementById('cMain').innerHTML = buildCalendar();
  wireCalendar();
}

// ═══════════════════════════════════════════════════════
//  HELPERS DE UI
// ═══════════════════════════════════════════════════════
function show(id, display)  { document.getElementById(id).style.display = display || 'block'; }
function hide(id)           { document.getElementById(id).style.display = 'none'; }
let lastFocusedEl = null;
function openModal(id, focusId) {
  lastFocusedEl = document.activeElement;
  const modal = document.getElementById(id);
  modal.classList.add('open');
  if (id === 'themeModal') updateThemePickerActive();
  if (focusId) setTimeout(() => document.getElementById(focusId)?.focus(), 100);
}
function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('open');
  if (lastFocusedEl) { setTimeout(() => lastFocusedEl.focus(), 100); lastFocusedEl = null; }
}
function setLoading(active) { document.getElementById('loadingOverlay').style.display = active ? 'flex' : 'none'; }
function setSaving(active) {
  const btns = document.querySelectorAll('.btn-gold, .btn-confirm, .btn-sm, .btn-danger');
  btns.forEach(b => b.disabled = active);
  document.body.style.cursor = active ? 'wait' : '';
}

function animateProgressBar(id, pct) {
  const el = document.getElementById(id);
  if (el) setTimeout(() => el.style.width = pct + '%', 60);
}

function pillHtml(status) {
  const map = {
    'Completado': 'pill-green', 'En proceso': 'pill-yellow', 'Listo': 'pill-green',
    'Pendiente':  'pill-gray',  'En revisión': 'pill-blue',  'Aprobado': 'pill-green',
    'Rechazado':  'pill-red',   'Confirmada':  'pill-green', 'Solicitada': 'pill-yellow',
    'Cancelada':  'pill-red',
  };
  return `<span class="pill ${map[status] || 'pill-gray'}">${esc(status)}</span>`;
}

function taskRowHtml(task, status) {
  const colors = { done: 'var(--green)', wip: 'var(--yellow)', pending: 'var(--muted)' };
  const labels = { done: 'Listo',        wip: 'En proceso',    pending: 'Pendiente'   };
  return `
    <div class="trow">
      <div class="tdot" style="background:${colors[status]}"></div>
      <div class="tname">${esc(task.name)}</div>
      <div class="tdate">${esc(task.date)}</div>
      ${pillHtml(labels[status])}
    </div>`;
}

function esc(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&#39;').replace(/`/g,'&#96;');
}

function safeUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) return '';
    return esc(url);
  } catch { return esc(url); }
}

function log(...args) {
  if (DEBUG) console.error(...args);
}

function showConfigBanner() {
  const mainId = currentUser?.role === 'admin' ? 'aMain' : 'cMain';
  const main   = document.getElementById(mainId);
  if (!main || main.querySelector('.config-banner')) return;
  const banner = document.createElement('div');
  banner.className = 'config-banner';
  banner.innerHTML = `⚠️ <div><strong>Modo demo</strong> — Los datos se guardan solo en este navegador. Para producción, edita las 2 líneas de configuración en app.js con tus credenciales de Supabase.</div>`;
  main.prepend(banner);
}

// ═══════════════════════════════════════════════════════
//  TEMAS
// ═══════════════════════════════════════════════════════
function applyTheme(theme) {
  if (theme === 'default') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  localStorage.setItem('portal_theme', theme);
  updateThemePickerActive();
  closeModal('themeModal');
}

function loadSavedTheme() {
  const saved = localStorage.getItem('portal_theme');
  const validThemes = ['default', 'rosado', 'verde', 'celeste'];
  if (saved && validThemes.includes(saved) && saved !== 'default') {
    document.documentElement.setAttribute('data-theme', saved);
  }
}

function updateThemePickerActive() {
  const current = document.documentElement.getAttribute('data-theme') || 'default';
  document.querySelectorAll('.theme-opt').forEach(opt => {
    opt.style.borderColor = opt.dataset.theme === current ? 'var(--gold)' : '';
    opt.style.background  = opt.dataset.theme === current ? 'var(--gg)' : '';
  });
}

// Cargar tema al iniciar
loadSavedTheme();
