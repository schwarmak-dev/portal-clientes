// ═══════════════════════════════════════════════════════
//  ⚙️  CONFIGURACIÓN
// ═══════════════════════════════════════════════════════
const SUPABASE_URL      = 'https://zmqwqbmdyjqpqktclvxv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_gbBvt25g9uwyFD91MTGc6w_rf-MT672';
const IS_CONFIGURED     = !SUPABASE_URL.includes('TU_PROJECT_ID');

// ═══════════════════════════════════════════════════════
//  CONSTANTES
// ═══════════════════════════════════════════════════════
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAYS   = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];
const SLOTS  = ['09:00','10:00','11:00','14:00','15:00','16:00','17:00'];
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
      { id:1, dia:20, mes:4, anio:2025, hora:'10:00', nombre:'Carlos Méndez', email:'carlos@acme.com', estado:'Confirmada' },
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

const LOCAL_USERS = {}; // Solo Supabase en producción — no exponer contraseñas aquí

// ═══════════════════════════════════════════════════════
//  ESTADO GLOBAL
// ═══════════════════════════════════════════════════════
let currentUser    = null;
let currentProject = null;
let clientTab      = 'overview';
let adminTab       = 'adash';
let calendar       = { y:2025, m:4, selDay:null, selSlot:null };
let pendingBooking = null;
let replyingId     = null;
let editingTask    = null;
let pickedIcon     = '🖥';
let dragItem       = null;
let projectCache   = {};
let reminderTimers = [];

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

async function sbGet(table, queryString) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${queryString}`, { headers: SB_HEADERS });
    return res.ok ? await res.json() : null;
  } catch { return null; }
}

async function sbUpsert(table, body) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method:  'POST',
      headers: { ...SB_HEADERS, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
      body:    JSON.stringify(body),
    });
  } catch {}
}

async function loadProject(slug) {
  if (IS_CONFIGURED) {
    const rows = await sbGet('projects', `slug=eq.${slug}&select=data`);
    if (rows?.length) return rows[0].data;
    return JSON.parse(JSON.stringify(FALLBACK_PROJECTS[slug]));
  }
  try {
    const stored = localStorage.getItem('portal_v3');
    const all    = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(FALLBACK_PROJECTS));
    return all[slug] || FALLBACK_PROJECTS[slug];
  } catch { return JSON.parse(JSON.stringify(FALLBACK_PROJECTS[slug])); }
}

async function saveProject(slug, data) {
  if (IS_CONFIGURED) {
    await sbUpsert('projects', { slug, data, updated_at: new Date().toISOString() });
    return;
  }
  try {
    const stored = localStorage.getItem('portal_v3');
    const all    = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(FALLBACK_PROJECTS));
    all[slug]    = data;
    localStorage.setItem('portal_v3', JSON.stringify(all));
  } catch {}
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
  if (!user || user.hash !== btoa(password)) return null;
  return { name: user.name, project: user.project, role: user.role };
}

// ═══════════════════════════════════════════════════════
//  INICIO
// ═══════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  hide('loadingOverlay');
  show('loginShell', 'flex');
  requestNotifPermission();
});

// Reinicia el timer cada vez que el usuario hace algo
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    if (currentUser) {
      showNotif('Sesión cerrada', 'Tu sesión fue cerrada por inactividad de 30 minutos.', 8000);
      setTimeout(logout, 1500);
    }
  }, SESSION_TIMEOUT_MS);
}

function startInactivityWatcher() {
  ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'].forEach(ev =>
    document.addEventListener(ev, resetInactivityTimer, { passive: true })
  );
  resetInactivityTimer();
}

function stopInactivityWatcher() {
  clearTimeout(inactivityTimer);
  ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'].forEach(ev =>
    document.removeEventListener(ev, resetInactivityTimer)
  );
}

// ═══════════════════════════════════════════════════════
//  AUTENTICACIÓN
// ═══════════════════════════════════════════════════════
document.getElementById('loginBtn').addEventListener('click', doLogin);
['lu', 'lp'].forEach(id =>
  document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); })
);

async function doLogin() {
  const username = document.getElementById('lu').value.trim().toLowerCase();
  const password = document.getElementById('lp').value;
  const errorEl  = document.getElementById('loginErr');

  setLoading(true);
  const user = await authenticateUser(username, password);
  setLoading(false);

  if (!user) {
    errorEl.style.display = 'block';
    document.getElementById('lp').value = '';
    return;
  }

  errorEl.style.display = 'none';
  currentUser = { username, ...user };
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
  clientTab      = 'overview';
  adminTab       = 'adash';
  calendar       = { y:2025, m:4, selDay:null, selSlot:null };

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
  const t1 = setTimeout(() => showNotif('📅 Reunión en 1 hora', `${meeting.nombre} · ${meeting.dia} de ${MONTHS[meeting.mes]} · ${meeting.hora}`, 8000), 5000);
  const t2 = setTimeout(() => showNotif('🔔 Reunión hoy',       `${meeting.nombre} · ${meeting.hora} · ${meeting.email}`, 8000), 12000);
  reminderTimers.push(t1, t2);
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

  animateProgressBar('cProgFill', project.progress);
  if (clientTab === 'calendar') wireCalendar();
  if (clientTab === 'changes')  wireClientChanges();
  if (!IS_CONFIGURED) showConfigBanner();
}

function buildClientOverview(p) {
  const phaseChips = p.phases.map((phase, i) => {
    const cls = i < p.phaseDone ? 'ph-done' : i === p.phaseDone ? 'ph-wip' : 'ph-pend';
    return `<span class="phase-chip ${cls}">${phase}</span>`;
  }).join('');

  return `
    <div class="g4" style="margin-bottom:12px">
      <div class="stat-card"><div class="stat-lbl">Progreso</div>   <div class="stat-val" style="color:var(--gold)">${p.progress}%</div>  <div class="stat-sub">Del proyecto</div></div>
      <div class="stat-card"><div class="stat-lbl">Completadas</div><div class="stat-val" style="color:var(--green)">${p.done.length}</div> <div class="stat-sub">Tareas listas</div></div>
      <div class="stat-card"><div class="stat-lbl">En proceso</div> <div class="stat-val" style="color:var(--yellow)">${p.wip.length}</div> <div class="stat-sub">Ahora mismo</div></div>
      <div class="stat-card"><div class="stat-lbl">Pendientes</div> <div class="stat-val" style="color:var(--soft)">${p.pending.length}</div><div class="stat-sub">Por cumplir</div></div>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div>
          <div class="card-title" style="margin-bottom:7px">${p.name}</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px">${phaseChips}</div>
        </div>
        <div style="font-family:'Syne',sans-serif;font-size:36px;font-weight:700;color:var(--gold);line-height:1;letter-spacing:-1px">
          ${p.progress}<span style="font-size:14px;color:var(--muted);font-weight:400;font-family:'DM Sans',sans-serif">%</span>
        </div>
      </div>
      <div class="prog-track"><div class="prog-fill" id="cProgFill" style="width:0%"></div></div>
      <div style="font-size:12px;color:var(--muted);margin-top:8px">Cliente: ${p.client}</div>
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
          <div class="rm-task-name">${t.name}</div>
          <div class="rm-task-date">${t.date}</div>
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
              <div class="ev-title">${e.title}</div>
              <div class="ev-date">${e.date}</div>
              ${e.note ? `<div style="font-size:11px;color:var(--gold);margin-top:5px">📝 ${e.note}</div>` : ''}
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}

function buildClientChanges(p) {
  const changeItems = p.changes.length
    ? p.changes.map(c => `
        <div class="cr-item">
          <div class="cr-head"><div class="cr-title">${c.title}</div>${pillHtml(c.status)}</div>
          <div class="cr-meta">${c.type} · Prioridad: ${c.priority} · ${c.date}</div>
          <div class="cr-desc">${c.desc}</div>
          ${c.reply ? `<div class="cr-reply">💬 <strong>Respuesta:</strong> ${c.reply}</div>` : ''}
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
      <div class="frow"><label class="flabel">Título</label><input class="finput" id="chgTitle" placeholder="Ej: Cambiar colores del header"></div>
      <div class="frow"><label class="flabel">Descripción</label><textarea class="finput" id="chgDesc" rows="3" placeholder="Describe el cambio con detalle..."></textarea></div>
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
    if (!title || !desc || !type || !priority) { alert('Completa todos los campos.'); return; }

    projectCache[currentProject] = await loadProject(currentProject);
    projectCache[currentProject].changes.unshift({
      id: Date.now(), title, desc, type, priority,
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
        `<option value="${r.slug}">${r.client} · ${r.name}</option>`
      ).join('');
      currentProject = rows[0].slug;
      select.value   = currentProject;
      return;
    }
  }

  // Fallback local cuando no hay Supabase configurado
  select.innerHTML = Object.entries(FALLBACK_PROJECTS).map(([slug, p]) =>
    `<option value="${slug}">${p.client} · ${p.name}</option>`
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
  // Siempre recarga para que el admin vea cambios del cliente en tiempo real
  projectCache[currentProject] = await loadProject(currentProject);
  const project = projectCache[currentProject];

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

  animateProgressBar('aProgFill', project.progress);

  const wireFns = {
    adash:        wireAdminDash,
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
      <div class="stat-card"><div class="stat-lbl">Progreso</div>   <div class="stat-val" style="color:var(--gold)">${p.progress}%</div>      <div class="stat-sub">Proyecto actual</div></div>
      <div class="stat-card"><div class="stat-lbl">Sin leer</div>   <div class="stat-val" style="color:${unread.length ? 'var(--red)' : 'var(--green)'}">${unread.length}</div>  <div class="stat-sub">Solicitudes</div></div>
      <div class="stat-card"><div class="stat-lbl">Reuniones</div>  <div class="stat-val" style="color:${pendingMtg.length ? 'var(--yellow)' : 'var(--soft)'}">${pendingMtg.length}</div><div class="stat-sub">Por confirmar</div></div>
      <div class="stat-card"><div class="stat-lbl">Evidencias</div> <div class="stat-val" style="color:var(--blue)">${p.evidence.length}</div>  <div class="stat-sub">Subidas</div></div>
    </div>

    <div class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div class="card-title" style="margin-bottom:0">${p.name} — ${p.client}</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:12px;color:var(--muted)">Progreso:</span>
          <input type="number" id="dashProg" value="${p.progress}" min="0" max="100"
            style="width:60px;background:var(--bg3);border:1px solid var(--line2);border-radius:6px;padding:5px 8px;color:var(--gold);font-size:13px;font-family:'DM Mono',monospace;outline:none;text-align:center">%
          <button class="btn-sm" id="saveProgBtn">Guardar</button>
        </div>
      </div>
      <div class="prog-track"><div class="prog-fill" id="aProgFill" style="width:0%"></div></div>
    </div>

    ${unread.length ? `
      <div class="card" style="border-color:rgba(248,113,113,.18)">
        <div class="card-title" style="color:var(--red)">⚠ Solicitudes sin revisar (${unread.length})</div>
        ${unread.slice(0,3).map(c => `
          <div class="cr-item">
            <div class="cr-head"><div class="cr-title">${c.title}</div>${pillHtml(c.status)}</div>
            <div class="cr-meta">${c.type} · ${c.priority} · ${c.date}</div>
          </div>`).join('')}
        <button class="btn-gold" style="width:auto;padding:8px 18px;margin-top:8px" onclick="switchAdminTab('asolicitudes')">Ver todas →</button>
      </div>` : ''}

    ${pendingMtg.length ? `
      <div class="card" style="border-color:rgba(245,158,11,.18)">
        <div class="card-title" style="color:var(--yellow)">🗓 Reuniones por confirmar (${pendingMtg.length})</div>
        ${pendingMtg.map(r => `
          <div class="cr-item">
            <div class="cr-head">
              <div class="cr-title">${r.nombre}</div><span class="pill pill-yellow">Solicitada</span>
            </div>
            <div class="cr-meta">${r.dia} de ${MONTHS[r.mes]} ${r.anio} · ${r.hora} · ${r.email}</div>
          </div>`).join('')}
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
             <div style="font-size:13px;font-weight:500">${lastEv.title}</div>
             <div style="font-size:11px;color:var(--muted)">${lastEv.date}</div>`
          : '<div style="color:var(--muted);font-size:13px">Sin evidencias aún.</div>'}
        <button class="btn-ghost" style="width:100%;margin-top:10px" onclick="switchAdminTab('aevidence')">Gestionar →</button>
      </div>
    </div>`;
}

function wireAdminDash() {
  document.getElementById('saveProgBtn')?.addEventListener('click', async () => {
    const value = parseInt(document.getElementById('dashProg').value);
    if (isNaN(value) || value < 0 || value > 100) { alert('Valor entre 0 y 100.'); return; }
    projectCache[currentProject].progress = value;
    await saveProject(currentProject, projectCache[currentProject]);
    renderAdminView();
  });
}

// ── Admin: Roadmap ────────────────────────────────────
function buildAdminRoadmap(p) {
  const editableColumn = (tasks, col, label, color) => `
    <div class="rm-col" data-col="${col}" id="rmCol_${col}">
      <div class="rm-col-hdr">
        <div class="tdot" style="background:${color};width:8px;height:8px;border-radius:50%;flex-shrink:0"></div>
        <div class="rm-col-title" style="color:${color}">${label}</div>
        <div class="rm-count">${tasks.length}</div>
      </div>
      <div id="rmList_${col}">
        ${tasks.map(t => `
          <div class="rm-task-card" draggable="true" data-id="${t.id}" data-col="${col}">
            <div class="rm-task-name">${esc(t.name)}</div>
            <div class="rm-task-date">${esc(t.date)}</div>
            <div class="rm-task-actions">
              <button class="rm-task-edit" data-id="${t.id}" data-col="${col}">✏</button>
              <button class="rm-task-del"  data-id="${t.id}" data-col="${col}">✕</button>
            </div>
          </div>`).join('') || '<div style="font-size:12px;color:var(--muted);text-align:center;padding:12px 0;border:1px dashed var(--line);border-radius:6px">Arrastra aquí</div>'}
      </div>
      <div class="add-row">
        <input id="rmNew_${col}" placeholder="+ Nueva tarea...">
        <button class="btn-sm rm-add-btn" data-col="${col}">Agregar</button>
      </div>
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
        <div style="font-size:12px;color:var(--muted)">Arrastra tarjetas entre columnas para moverlas.</div>
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
  // Drag & drop
  document.querySelectorAll('.rm-task-card').forEach(card => {
    card.addEventListener('dragstart', e => {
      dragItem = { id: parseInt(card.dataset.id), col: card.dataset.col };
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
      const task = projectCache[currentProject][fromCol].find(t => t.id === id);
      if (!task) { dragItem = null; return; }

      const dateByCol = {
        done:    `${new Date().getDate()} ${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`,
        wip:     'En curso',
        pending: 'Por definir',
      };
      task.date = dateByCol[colId];

      projectCache[currentProject][fromCol] = projectCache[currentProject][fromCol].filter(t => t.id !== id);
      projectCache[currentProject][colId].push(task);
      await saveProject(currentProject, projectCache[currentProject]);
      dragItem = null;
      renderAdminView();
    });
  });

  // Editar / eliminar tarea
  document.querySelectorAll('.rm-task-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const task = projectCache[currentProject][btn.dataset.col].find(t => t.id === parseInt(btn.dataset.id));
      if (!task) return;
      editingTask = { id: parseInt(btn.dataset.id), col: btn.dataset.col };
      document.getElementById('taskEditName').value = task.name;
      document.getElementById('taskEditDate').value = task.date;
      document.getElementById('taskModal').classList.add('open');
    });
  });

  document.querySelectorAll('.rm-task-del').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Eliminar esta tarea?')) return;
      projectCache[currentProject][btn.dataset.col] = projectCache[currentProject][btn.dataset.col].filter(t => t.id !== parseInt(btn.dataset.id));
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
  projectCache[currentProject][col].push({ id: Date.now(), name, date: dateByCol[col] });
  await saveProject(currentProject, projectCache[currentProject]);
  renderAdminView();
}

async function saveTaskEdit() {
  const name = document.getElementById('taskEditName').value.trim();
  const date = document.getElementById('taskEditDate').value.trim();
  if (!name) { alert('El nombre es obligatorio.'); return; }

  const task = projectCache[currentProject][editingTask.col].find(t => t.id === editingTask.id);
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
      <div style="font-size:12px;color:var(--muted);margin:-6px 0 14px">Solo tú puedes agregar evidencias. El cliente las ve al instante.</div>
      <div class="ev-grid">
        ${p.evidence.map(e => `
          <div style="background:var(--bg3);border:1px solid var(--line);border-radius:var(--r);overflow:hidden">
            <div class="ev-thumb">${e.icon}</div>
            <div class="ev-cap" style="padding:10px 12px">
              <input class="inline-edit" data-evid="${e.id}" data-field="title" value="${esc(e.title)}"       placeholder="Título">
              <input class="inline-edit" data-evid="${e.id}" data-field="date"  value="${esc(e.date)}"        placeholder="Fecha" style="font-size:11px;color:var(--muted)">
              <input class="inline-edit" data-evid="${e.id}" data-field="note"  value="${esc(e.note || '')}"  placeholder="📝 Nota para cliente" style="font-size:11px;color:var(--gold)">
              <input class="inline-edit" data-evid="${e.id}" data-field="icon"  value="${e.icon}"             placeholder="Emoji" style="font-size:22px;text-align:center">
              <button class="btn-danger ev-del-btn" data-evid="${e.id}" style="width:100%;margin-top:6px">Eliminar</button>
            </div>
          </div>`).join('')}
        <div class="upload-zone" id="addEvBtn" style="min-height:200px">
          <div style="font-size:26px;color:var(--muted)">＋</div>
          <div style="font-size:12px;color:var(--muted)">Agregar evidencia<br><span style="color:var(--gold)">Solo tú puedes hacer esto</span></div>
        </div>
      </div>
    </div>`;
}

function wireAdminEvidence() {
  document.querySelectorAll('.inline-edit').forEach(input => {
    input.addEventListener('change', async () => {
      const ev = projectCache[currentProject].evidence.find(e => e.id === parseInt(input.dataset.evid));
      if (ev) { ev[input.dataset.field] = input.value; await saveProject(currentProject, projectCache[currentProject]); }
    });
  });

  document.querySelectorAll('.ev-del-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Eliminar esta evidencia?')) return;
      projectCache[currentProject].evidence = projectCache[currentProject].evidence.filter(e => e.id !== parseInt(btn.dataset.evid));
      await saveProject(currentProject, projectCache[currentProject]);
      renderAdminView();
    });
  });

  document.getElementById('addEvBtn')?.addEventListener('click', () => {
    ['evTitle', 'evDate', 'evNote', 'evIconCustom'].forEach(id => document.getElementById(id).value = '');
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
        document.getElementById('evIconCustom').value = '';
      });
    });
    document.getElementById('evModal').classList.add('open');
  });
}

async function saveEvidence() {
  const title  = document.getElementById('evTitle').value.trim();
  const date   = document.getElementById('evDate').value.trim() || 'Sin fecha';
  const note   = document.getElementById('evNote').value.trim();
  const custom = document.getElementById('evIconCustom').value.trim();
  const icon   = custom || pickedIcon || '📄';
  if (!title) { alert('El título es obligatorio.'); return; }

  projectCache[currentProject].evidence.push({ id: Date.now(), title, date, icon, note });
  await saveProject(currentProject, projectCache[currentProject]);
  closeModal('evModal');
  renderAdminView();
}

// ── Admin: Reuniones ──────────────────────────────────
function buildAdminMeetings(p) {
  const meetingItems = p.reuniones.length
    ? p.reuniones.map(r => `
        <div class="cr-item">
          <div class="cr-head">
            <div style="flex:1">
              <div class="cr-title">${r.nombre}</div>
              <div class="cr-meta">${r.dia} de ${MONTHS[r.mes]} ${r.anio} · ${r.hora} · <a href="mailto:${r.email}" style="color:var(--gold)">${r.email}</a></div>
            </div>
            <div style="display:flex;align-items:center;gap:7px;flex-shrink:0">
              ${pillHtml(r.estado)}
              ${r.estado === 'Solicitada' ? `
                <button class="btn-sm" style="color:var(--green);border-color:rgba(74,222,128,.2)" data-reid="${r.id}" data-action="Confirmada">✓ Aceptar</button>
                <button class="btn-danger" data-reid="${r.id}" data-action="Cancelada">✕</button>` : ''}
              ${r.estado === 'Confirmada' ? `
                <button class="btn-danger" data-reid="${r.id}" data-action="Cancelada">Cancelar</button>` : ''}
            </div>
          </div>
          ${r.estado === 'Confirmada' ? '<div class="alert-ok" style="margin-top:8px;font-size:12px">✅ Confirmada — Recordatorios activos.</div>' : ''}
        </div>`).join('')
    : '<div style="color:var(--muted);font-size:13px;padding:8px 0">No hay reuniones aún.</div>';

  return `
    <div class="card">
      <div class="card-title">Reuniones del cliente</div>
      <div style="font-size:12px;color:var(--muted);margin:-6px 0 14px">Al aceptar se activan recordatorios automáticos.</div>
      ${meetingItems}
    </div>
    <div class="card">
      <div class="card-title">Agregar reunión manualmente</div>
      <div class="g2">
        <div class="frow"><label class="flabel">Nombre</label><input class="finput" id="rNom"   placeholder="Nombre Apellido"></div>
        <div class="frow"><label class="flabel">Email</label> <input class="finput" id="rEmail" type="email" placeholder="cliente@email.com"></div>
      </div>
      <div class="g3">
        <div class="frow"><label class="flabel">Día</label>  <input class="finput" id="rDia"  type="number" min="1" max="31" placeholder="15"></div>
        <div class="frow"><label class="flabel">Mes</label>  <select class="finput" id="rMes">${MONTHS.map((m,i) => `<option value="${i}">${m}</option>`).join('')}</select></div>
        <div class="frow"><label class="flabel">Hora</label> <select class="finput" id="rHora">${SLOTS.map(s => `<option>${s}</option>`).join('')}</select></div>
      </div>
      <button class="btn-gold" style="width:auto;padding:9px 22px" id="addMeetingBtn">Agregar y confirmar</button>
      <div id="reuOk" class="alert-ok" style="display:none">✓ Reunión agregada. Recordatorios activados.</div>
    </div>`;
}

function wireAdminMeetings() {
  document.querySelectorAll('[data-reid]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const meeting = projectCache[currentProject].reuniones.find(r => r.id === parseInt(btn.dataset.reid));
      if (!meeting) return;
      meeting.estado = btn.dataset.action;
      await saveProject(currentProject, projectCache[currentProject]);
      if (meeting.estado === 'Confirmada') {
        scheduleReminders(meeting);
        showNotif('Reunión confirmada ✅', `${meeting.nombre} · ${meeting.dia} de ${MONTHS[meeting.mes]} · ${meeting.hora}`);
      }
      renderAdminView();
    });
  });

  document.getElementById('addMeetingBtn')?.addEventListener('click', async () => {
    const nombre = document.getElementById('rNom').value.trim();
    const email  = document.getElementById('rEmail').value.trim();
    const dia    = parseInt(document.getElementById('rDia').value);
    const mes    = parseInt(document.getElementById('rMes').value);
    const hora   = document.getElementById('rHora').value;
    if (!nombre || !email || !dia) { alert('Completa nombre, email y día.'); return; }

    const meeting = { id: Date.now(), dia, mes, anio: 2025, hora, nombre, email, estado: 'Confirmada' };
    projectCache[currentProject].reuniones.push(meeting);
    await saveProject(currentProject, projectCache[currentProject]);

    scheduleReminders(meeting);
    showNotif('Reunión confirmada ✅', `${nombre} · ${dia} de ${MONTHS[mes]} · ${hora}`);

    const okEl = document.getElementById('reuOk');
    if (okEl) { okEl.style.display = 'block'; setTimeout(() => okEl.style.display = 'none', 4000); }
    renderAdminView();
  });
}

// ── Admin: Solicitudes ────────────────────────────────
function buildAdminRequests(p) {
  // Marcar todas como vistas
  p.changes.forEach(c => c.seen = true);
  saveProject(currentProject, p);

  const items = p.changes.length
    ? p.changes.map(c => `
        <div class="cr-item">
          <div class="cr-head">
            <div style="flex:1">
              <div class="cr-title">${c.title}</div>
              <div class="cr-meta">${c.type} · Prioridad: <strong style="color:${c.priority==='Urgente'?'var(--red)':c.priority==='Alta'?'var(--yellow)':'var(--soft)'}">${c.priority}</strong> · ${c.date}</div>
              <div class="cr-desc" style="margin-top:4px">${c.desc}</div>
            </div>
            ${pillHtml(c.status)}
          </div>
          ${c.reply ? `<div class="cr-reply">💬 <strong>Tu respuesta:</strong> ${c.reply}</div>` : ''}
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
      replyingId = parseInt(btn.dataset.cid);
      document.getElementById('replyModalSub').textContent = `"${btn.dataset.title}"`;
      document.getElementById('replyStatus').value         = btn.dataset.status;
      document.getElementById('replyText').value           = '';
      document.getElementById('replyModal').classList.add('open');
    });
  });

  document.querySelectorAll('.del-cr-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Eliminar esta solicitud?')) return;
      projectCache[currentProject].changes = projectCache[currentProject].changes.filter(c => c.id !== parseInt(btn.dataset.cid));
      await saveProject(currentProject, projectCache[currentProject]);
      renderAdminView();
    });
  });
}

async function submitReply() {
  const status = document.getElementById('replyStatus').value;
  const reply  = document.getElementById('replyText').value.trim();
  const change = projectCache[currentProject].changes.find(c => c.id === replyingId);
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
  const bookedDays    = new Set(meetings.filter(r => r.mes === m && r.anio === y).map(r => r.dia));

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

  const bookedSlotIdxs = selDay ? meetings.filter(r => r.mes === m && r.anio === y && r.dia === selDay).map(r => SLOTS.indexOf(r.hora)) : [];
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
      ${confirmedMeetings.map(r => `
        <div style="display:flex;align-items:center;gap:8px;padding:7px 11px;background:var(--gbg);border:1px solid rgba(74,222,128,.1);border-radius:6px;margin-bottom:6px;font-size:12px">
          <span style="color:var(--green)">✅</span>
          <span style="flex:1">${r.nombre}</span>
          <span style="color:var(--muted);font-family:'DM Mono',monospace">${r.dia}/${r.mes + 1} · ${r.hora}</span>
        </div>`).join('')}
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
      calendar.selDay  = parseInt(el.dataset.day);
      calendar.selSlot = null;
      rerender();
    });
  });

  document.querySelectorAll('.slot:not(.sbooked)').forEach(el => {
    el.addEventListener('click', () => {
      calendar.selSlot = parseInt(el.dataset.slot);
      rerender();
    });
  });

  document.getElementById('reqSlotBtn')?.addEventListener('click', () => {
    pendingBooking = { ...calendar };
    document.getElementById('bookModalSub').textContent = `${calendar.selDay} de ${MONTHS[calendar.m]} ${calendar.y} · ${SLOTS[calendar.selSlot]} — Matias confirmará a la brevedad.`;
    document.getElementById('bookModal').classList.add('open');
  });
}

async function finalizeBooking() {
  const nombre = document.getElementById('bookName').value.trim();
  const email  = document.getElementById('bookEmail').value.trim();
  if (!nombre || !email)          { alert('Completa tu nombre y email.'); return; }
  if (!email.includes('@'))       { alert('Email inválido.'); return; }

  const { y, m, selDay, selSlot } = pendingBooking;
  projectCache[currentProject] = await loadProject(currentProject);
  projectCache[currentProject].reuniones.push({
    id: Date.now(), dia: selDay, mes: m, anio: y,
    hora: SLOTS[selSlot], nombre, email, estado: 'Solicitada',
  });
  await saveProject(currentProject, projectCache[currentProject]);

  calendar.selSlot = null;
  closeModal('bookModal');
  ['bookName', 'bookEmail'].forEach(id => document.getElementById(id).value = '');
  showNotif('Solicitud enviada 📅', `${selDay} de ${MONTHS[m]} a las ${SLOTS[selSlot]}. Matias confirmará pronto.`);

  document.getElementById('cMain').innerHTML = buildCalendar();
  wireCalendar();
}

// ═══════════════════════════════════════════════════════
//  HELPERS DE UI
// ═══════════════════════════════════════════════════════
function show(id, display)  { document.getElementById(id).style.display = display || 'block'; }
function hide(id)           { document.getElementById(id).style.display = 'none'; }
function closeModal(id)     { document.getElementById(id).classList.remove('open'); }
function setLoading(active) { document.getElementById('loadingOverlay').style.display = active ? 'flex' : 'none'; }

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
  return `<span class="pill ${map[status] || 'pill-gray'}">${status}</span>`;
}

function taskRowHtml(task, status) {
  const colors = { done: 'var(--green)', wip: 'var(--yellow)', pending: 'var(--muted)' };
  const labels = { done: 'Listo',        wip: 'En proceso',    pending: 'Pendiente'   };
  return `
    <div class="trow">
      <div class="tdot" style="background:${colors[status]}"></div>
      <div class="tname">${task.name}</div>
      <div class="tdate">${task.date}</div>
      ${pillHtml(labels[status])}
    </div>`;
}

function esc(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
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
