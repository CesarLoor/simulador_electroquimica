/* ============================================
   SIMULADOR DE CELDAS GALVÁNICAS
   Clean AI-Inspired — Application Logic
   ============================================ */

// ==========================================
// ELECTROCHEMICAL DATABASE
// ==========================================
const METALS = [
  { symbol: 'Li', name: 'Litio',     ion: 'Li⁺',  e: 1, E: -3.04, color: '#c0c0c8', sol: 'rgba(180,180,200,0.08)' },
  { symbol: 'K',  name: 'Potasio',   ion: 'K⁺',   e: 1, E: -2.93, color: '#b8b8c4', sol: 'rgba(170,170,195,0.08)' },
  { symbol: 'Ca', name: 'Calcio',    ion: 'Ca²⁺', e: 2, E: -2.87, color: '#d0d0c4', sol: 'rgba(200,200,190,0.08)' },
  { symbol: 'Na', name: 'Sodio',     ion: 'Na⁺',  e: 1, E: -2.71, color: '#c8c8d0', sol: 'rgba(190,190,200,0.08)' },
  { symbol: 'Mg', name: 'Magnesio',  ion: 'Mg²⁺', e: 2, E: -2.37, color: '#a8a8a8', sol: 'rgba(160,160,160,0.08)' },
  { symbol: 'Al', name: 'Aluminio',  ion: 'Al³⁺', e: 3, E: -1.66, color: '#b8b8c0', sol: 'rgba(170,170,180,0.08)' },
  { symbol: 'Mn', name: 'Manganeso', ion: 'Mn²⁺', e: 2, E: -1.18, color: '#909098', sol: 'rgba(180,160,180,0.10)' },
  { symbol: 'Zn', name: 'Zinc',      ion: 'Zn²⁺', e: 2, E: -0.76, color: '#98a0a8', sol: 'rgba(160,170,180,0.08)' },
  { symbol: 'Cr', name: 'Cromo',     ion: 'Cr³⁺', e: 3, E: -0.74, color: '#8890a0', sol: 'rgba(100,160,100,0.10)' },
  { symbol: 'Fe', name: 'Hierro',    ion: 'Fe²⁺', e: 2, E: -0.44, color: '#787880', sol: 'rgba(140,180,140,0.10)' },
  { symbol: 'Ni', name: 'Níquel',    ion: 'Ni²⁺', e: 2, E: -0.26, color: '#909890', sol: 'rgba(110,180,110,0.10)' },
  { symbol: 'Sn', name: 'Estaño',    ion: 'Sn²⁺', e: 2, E: -0.14, color: '#a0a0a0', sol: 'rgba(160,160,160,0.10)' },
  { symbol: 'Pb', name: 'Plomo',     ion: 'Pb²⁺', e: 2, E: -0.13, color: '#606068', sol: 'rgba(140,140,150,0.10)' },
  { symbol: 'H₂', name: 'Hidrógeno', ion: '2H⁺',  e: 2, E:  0.00, color: '#d0d0d0', sol: 'rgba(180,180,180,0.06)' },
  { symbol: 'Cu', name: 'Cobre',     ion: 'Cu²⁺', e: 2, E:  0.34, color: '#c47840', sol: 'rgba(50,120,210,0.18)' },
  { symbol: 'Ag', name: 'Plata',     ion: 'Ag⁺',  e: 1, E:  0.80, color: '#c0c0c8', sol: 'rgba(170,170,190,0.08)' },
  { symbol: 'Pt', name: 'Platino',   ion: 'Pt²⁺', e: 2, E:  1.20, color: '#b8b8b0', sol: 'rgba(180,180,170,0.08)' },
  { symbol: 'Au', name: 'Oro',       ion: 'Au³⁺', e: 3, E:  1.50, color: '#d4a520', sol: 'rgba(212,165,32,0.12)' },
];

// ==========================================
// PRESETS DE CELDAS FAMOSAS
// ==========================================
const PRESETS = [
  { name: 'Daniell (Zn–Cu)',       a: 7,  c: 14 },
  { name: 'Volta (Zn–Ag)',         a: 7,  c: 15 },
  { name: 'Sacrificio (Mg–Cu)',    a: 4,  c: 14 },
  { name: 'Aluminio–Plata (Al–Ag)',a: 5,  c: 15 },
  { name: 'Hierro–Cobre (Fe–Cu)',  a: 9,  c: 14 },
  { name: 'Litio–Oro (Li–Au)',     a: 0,  c: 17 },
];

// ==========================================
// STATE
// ==========================================
const S = {
  ai: 7,    // anode index (Zn)
  ci: 14,   // cathode index (Cu)
  time: 0,
  electrons: [],
  ions: [],
  Ecell: 0,
};

// Quiz state
const Q = {
  active: false,
  a: null, c: null,
  questions: [],
  qIdx: 0,
  score: 0,
  answered: false,
};

let canvas, ctx;

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('cellCanvas');
  ctx = canvas.getContext('2d');

  populateSelects();
  renderPresets();
  bindEvents();
  resize();
  window.addEventListener('resize', resize);
  update();
  requestAnimationFrame(loop);
});

function populateSelects() {
  const aS = document.getElementById('anodeSel');
  const cS = document.getElementById('cathodeSel');
  METALS.forEach((m, i) => {
    const sign = m.E > 0 ? '+' : '';
    const txt = `${m.symbol} — ${m.name}  (${sign}${m.E.toFixed(2)} V)`;
    aS.appendChild(new Option(txt, i));
    cS.appendChild(new Option(txt, i));
  });
  aS.value = S.ai;
  cS.value = S.ci;
}

function bindEvents() {
  document.getElementById('anodeSel').addEventListener('change', e => { S.ai = +e.target.value; update(); });
  document.getElementById('cathodeSel').addEventListener('change', e => { S.ci = +e.target.value; update(); });
  document.getElementById('swapBtn').addEventListener('click', () => {
    [S.ai, S.ci] = [S.ci, S.ai];
    document.getElementById('anodeSel').value = S.ai;
    document.getElementById('cathodeSel').value = S.ci;
    update();
  });
  document.getElementById('quizToggle').addEventListener('click', () => {
    Q.active = !Q.active;
    const el = document.getElementById('quizToggle');
    el.classList.toggle('quiz-toggle--active', Q.active);
    if (Q.active) { startQuiz(); }
    else { renderQuiz(); }
  });
  document.getElementById('quizClose').addEventListener('click', () => {
    Q.active = false;
    document.getElementById('quizToggle').classList.remove('quiz-toggle--active');
    renderQuiz();
  });
  document.getElementById('quizNext').addEventListener('click', quizNext);
  document.getElementById('quizNew').addEventListener('click', startQuiz);
}

// ==========================================
// PRESETS
// ==========================================
function renderPresets() {
  const wrap = document.getElementById('presetBtns');
  PRESETS.forEach(p => {
    const b = document.createElement('button');
    b.className = 'preset-btn';
    b.textContent = p.name;
    b.addEventListener('click', () => applyPreset(p));
    wrap.appendChild(b);
  });
  const r = document.createElement('button');
  r.className = 'preset-btn preset-btn--random';
  r.textContent = '🎲 Aleatoria';
  r.title = 'Elegir una celda al azar';
  r.addEventListener('click', applyRandomCell);
  wrap.appendChild(r);
}

function applyPreset(p) {
  S.ai = p.a; S.ci = p.c;
  document.getElementById('anodeSel').value = S.ai;
  document.getElementById('cathodeSel').value = S.ci;
  update();
  toast(`${METALS[p.a].symbol} − ${METALS[p.c].symbol} · E° = ${(METALS[p.c].E - METALS[p.a].E).toFixed(2)} V`, 'info');
}

function applyRandomCell() {
  const i = Math.floor(Math.random() * METALS.length);
  let j = Math.floor(Math.random() * METALS.length);
  while (j === i) j = Math.floor(Math.random() * METALS.length);
  const anode = METALS[i].E <= METALS[j].E ? i : j;
  const cathode = anode === i ? j : i;
  S.ai = anode; S.ci = cathode;
  document.getElementById('anodeSel').value = S.ai;
  document.getElementById('cathodeSel').value = S.ci;
  update();
  toast(`Celda aleatoria: ${METALS[anode].symbol} (ánodo) − ${METALS[cathode].symbol} (cátodo)`, 'info');
}

// ==========================================
// UPDATE
// ==========================================
function update() {
  const a = METALS[S.ai], c = METALS[S.ci];
  S.Ecell = c.E - a.E;
  S.electrons = [];
  S.ions = [];

  // Info boxes
  document.getElementById('anodeInfo').innerHTML =
    `<span class="hl">${a.symbol} → ${a.ion} + ${a.e}e⁻</span> &nbsp; E° = ${a.E > 0 ? '+' : ''}${a.E.toFixed(2)} V`;
  document.getElementById('cathodeInfo').innerHTML =
    `<span class="hl">${c.ion} + ${c.e}e⁻ → ${c.symbol}</span> &nbsp; E° = ${c.E > 0 ? '+' : ''}${c.E.toFixed(2)} V`;

  // Potential
  const sign = S.Ecell > 0 ? '+' : '';
  const valEl = document.getElementById('potVal');
  valEl.textContent = `${sign}${S.Ecell.toFixed(2)} V`;
  valEl.className = 'results__value ' + (
    S.ai === S.ci ? 'results__value--zero' :
    S.Ecell > 0 ? 'results__value--positive' : 'results__value--negative'
  );

  const subEl = document.getElementById('potSub');
  if (S.ai === S.ci) {
    subEl.textContent = 'Mismo metal';
    subEl.className = 'results__sub results__sub--neutral';
  } else if (S.Ecell > 0) {
    subEl.textContent = '✓ Espontánea';
    subEl.className = 'results__sub results__sub--ok';
  } else {
    subEl.textContent = '✗ No espontánea';
    subEl.className = 'results__sub results__sub--no';
  }

  // Electrons transferred
  const n = lcm(a.e, c.e);
  document.getElementById('nElectrons').textContent = `${n} e⁻`;

  // ΔG info
  const F = 96485;
  const dG = -n * F * S.Ecell / 1000; // kJ
  const dGel = document.getElementById('dGVal');
  dGel.textContent = `${dG > 0 ? '+' : ''}${dG.toFixed(1)} kJ/mol`;
  dGel.className = 'results__value ' + (S.Ecell > 0 ? 'results__value--positive' : S.Ecell < 0 ? 'results__value--negative' : 'results__value--zero');

  // Equations
  const am = n / a.e, cm = n / c.e;
  const mc = v => v > 1 ? v : '';
  document.getElementById('eqOx').innerHTML =
    `${mc(am)}${a.symbol} <span class="arrow">→</span> ${mc(am)}${a.ion} + ${mc(n)}e⁻`;
  document.getElementById('eqRed').innerHTML =
    `${mc(cm)}${c.ion} + ${mc(n)}e⁻ <span class="arrow">→</span> ${mc(cm)}${c.symbol}`;
  document.getElementById('eqGlobal').innerHTML =
    `${mc(am)}${a.symbol} + ${mc(cm)}${c.ion} <span class="arrow">→</span> ${mc(am)}${a.ion} + ${mc(cm)}${c.symbol}`;

  // Notifications
  if (S.ai === S.ci) toast('Elige metales diferentes para formar la celda', 'warn');
  else if (S.Ecell < 0) toast('E° < 0 → celda no espontánea. Intercambia los electrodos.', 'warn');

  renderNotation();
}

// ==========================================
// CELL NOTATION (diagrama)
// ==========================================
function renderNotation() {
  const a = METALS[S.ai], c = METALS[S.ci];
  const part = m => m.symbol === 'H₂'
    ? `Pt(s) | H₂(g) | H⁺(aq)`
    : `${m.symbol}(s) | ${m.ion}(aq)`;
  document.getElementById('cellNotation').innerHTML =
    `<span class="notation__anode">${part(a)}</span>` +
    `<span class="notation__bridge">||</span>` +
    `<span class="notation__cathode">${part(c)}</span>`;
}

// ==========================================
// CANVAS
// ==========================================
function resize() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const h = window.innerWidth <= 700 ? 280 : 380;
  canvas.width = rect.width * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = rect.width + 'px';
  canvas.style.height = h + 'px';
}

function loop(t) {
  S.time = t * 0.001;
  draw();
  requestAnimationFrame(loop);
}

function draw() {
  const w = canvas.width / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1);
  ctx.clearRect(0, 0, w, h);

  const a = METALS[S.ai], c = METALS[S.ci];
  const ok = S.Ecell > 0 && S.ai !== S.ci;

  // Layout
  const gap = 60;
  const cW = (w - gap) / 2 - 30;
  const cH = h - 110;
  const cY = 55;
  const lx = 30, rx = w - 30 - cW;
  const elW = 14, elH = cH * 0.6;
  const elY = cY + cH * 0.2;
  const aEx = lx + cW / 2 - elW / 2;
  const cEx = rx + cW / 2 - elW / 2;

  // Solutions
  drawSolution(lx, cY, cW, cH, a.sol);
  drawSolution(rx, cY, cW, cH, c.sol);

  // Beakers
  drawBeaker(lx, cY, cW, cH);
  drawBeaker(rx, cY, cW, cH);

  // Electrodes
  drawElectrode(aEx, elY, elW, elH, a.color, ok, 'a');
  drawElectrode(cEx, elY, elW, elH, c.color, ok, 'c');

  // Wire
  const wireY = elY - 20;
  ctx.beginPath();
  ctx.moveTo(aEx + elW / 2, elY);
  ctx.lineTo(aEx + elW / 2, wireY);
  ctx.lineTo(cEx + elW / 2, wireY);
  ctx.lineTo(cEx + elW / 2, elY);
  ctx.strokeStyle = ok ? 'rgba(108,92,231,0.45)' : 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Wire glow
  if (ok) {
    ctx.beginPath();
    ctx.moveTo(aEx + elW / 2, elY);
    ctx.lineTo(aEx + elW / 2, wireY);
    ctx.lineTo(cEx + elW / 2, wireY);
    ctx.lineTo(cEx + elW / 2, elY);
    ctx.strokeStyle = 'rgba(108,92,231,0.1)';
    ctx.lineWidth = 6;
    ctx.stroke();
  }

  // Salt bridge
  const bridgeY = cY + cH * 0.18;
  const bx1 = lx + cW, bx2 = rx;
  ctx.strokeStyle = 'rgba(253,203,110,0.35)';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(bx1, bridgeY + 20);
  ctx.quadraticCurveTo(bx1, bridgeY - 5, (bx1 + bx2) / 2, bridgeY - 8);
  ctx.quadraticCurveTo(bx2, bridgeY - 5, bx2, bridgeY + 20);
  ctx.stroke();

  // Salt bridge inner
  ctx.strokeStyle = 'rgba(253,203,110,0.1)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(bx1, bridgeY + 20);
  ctx.quadraticCurveTo(bx1, bridgeY - 5, (bx1 + bx2) / 2, bridgeY - 8);
  ctx.quadraticCurveTo(bx2, bridgeY - 5, bx2, bridgeY + 20);
  ctx.stroke();
  ctx.lineCap = 'butt';

  // Voltmeter
  const vmX = w / 2, vmY = 18, vmR = 16;
  ctx.beginPath();
  ctx.arc(vmX, vmY, vmR, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fill();
  ctx.strokeStyle = ok ? 'rgba(0,184,148,0.4)' : S.Ecell < 0 ? 'rgba(255,107,107,0.3)' : 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = ok ? '#00b894' : S.Ecell < 0 ? '#ff6b6b' : '#555';
  ctx.font = '500 9px "JetBrains Mono"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const vs = S.Ecell > 0 ? '+' : '';
  ctx.fillText(S.ai === S.ci ? '0.00' : `${vs}${S.Ecell.toFixed(2)}`, vmX, vmY + 1);

  // Labels
  ctx.font = '600 11px "Space Grotesk"';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0,206,201,0.8)';
  ctx.fillText(`Ánodo (−)`, lx + cW / 2, cY + cH + 18);
  ctx.font = '400 10px Inter';
  ctx.fillStyle = 'rgba(0,206,201,0.5)';
  ctx.fillText(`${a.symbol} · Oxidación`, lx + cW / 2, cY + cH + 34);

  ctx.font = '600 11px "Space Grotesk"';
  ctx.fillStyle = 'rgba(162,155,254,0.8)';
  ctx.fillText(`Cátodo (+)`, rx + cW / 2, cY + cH + 18);
  ctx.font = '400 10px Inter';
  ctx.fillStyle = 'rgba(162,155,254,0.5)';
  ctx.fillText(`${c.symbol} · Reducción`, rx + cW / 2, cY + cH + 34);

  // Bridge label
  ctx.font = '400 9px Inter';
  ctx.fillStyle = 'rgba(253,203,110,0.5)';
  ctx.fillText('Puente salino', (bx1 + bx2) / 2, bridgeY - 18);

  // Electron flow label
  if (ok) {
    ctx.fillStyle = 'rgba(108,92,231,0.4)';
    ctx.font = '400 9px Inter';
    ctx.fillText('e⁻ →', w / 2, wireY - 8);
  }

  // Particles
  if (ok) {
    spawnAndDrawElectrons(aEx + elW / 2, cEx + elW / 2, elY, wireY);
    spawnAndDrawIons(lx, rx, cW, cY, cH, a, c);
  }
}

function drawSolution(x, y, w, h, color) {
  const solY = y + h * 0.1;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, solY);
  for (let i = 0; i <= w; i += 2) {
    const wy = solY + Math.sin(i * 0.04 + S.time * 1.2) * 1.5;
    ctx.lineTo(x + i, wy);
  }
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();
}

function drawBeaker(x, y, w, h) {
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w, y);
  ctx.stroke();
}

function drawElectrode(x, y, w, h, color, animated, type) {
  ctx.save();
  if (animated && type === 'a') {
    ctx.globalAlpha = 0.7 + Math.sin(S.time * 2) * 0.15;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let i = 0; i < h; i += 3) {
      ctx.lineTo(x + Math.sin(i * 0.6 + S.time * 3) * 1.5, y + i);
    }
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + w, y + h);
    for (let i = h; i > 0; i -= 3) {
      ctx.lineTo(x + w + Math.sin(i * 0.6 + S.time * 3) * 1.5, y + i);
    }
    ctx.closePath();
    ctx.fill();
  } else {
    const grow = animated && type === 'c' ? Math.sin(S.time * 2) * 0.8 : 0;
    ctx.fillStyle = color;
    ctx.fillRect(x - grow, y, w + grow * 2, h);
  }
  // highlight
  const hl = ctx.createLinearGradient(x, y, x + w, y);
  hl.addColorStop(0, 'rgba(255,255,255,0.1)');
  hl.addColorStop(1, 'rgba(255,255,255,0.03)');
  ctx.fillStyle = hl;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

// ---- Electron particles ----
function spawnAndDrawElectrons(x1, x2, ey, wy) {
  if (Math.random() < 0.06) {
    S.electrons.push({ p: 0, sp: 0.003 + Math.random() * 0.002 });
  }
  if (S.electrons.length > 18) S.electrons = S.electrons.slice(-18);

  const pathUp = ey - wy;
  const pathAcross = x2 - x1;
  const total = pathUp + pathAcross + pathUp;
  const s1 = pathUp / total, s2 = pathAcross / total;

  ctx.save();
  S.electrons = S.electrons.filter(e => {
    e.p += e.sp;
    if (e.p > 1) return false;
    let px, py;
    if (e.p < s1) { px = x1; py = ey - (e.p / s1) * pathUp; }
    else if (e.p < s1 + s2) { px = x1 + ((e.p - s1) / s2) * pathAcross; py = wy; }
    else { px = x2; py = wy + ((e.p - s1 - s2) / (1 - s1 - s2)) * pathUp; }

    const g = ctx.createRadialGradient(px, py, 0, px, py, 6);
    g.addColorStop(0, 'rgba(108,92,231,0.7)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6c5ce7';
    ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill();
    return true;
  });
  ctx.restore();
}

// ---- Ion particles ----
function spawnAndDrawIons(lx, rx, cW, cY, cH, a, c) {
  const sy = cY + cH * 0.3, sb = cY + cH - 8;
  if (Math.random() < 0.03) {
    S.ions.push({
      x: lx + cW / 2 + (Math.random() - 0.5) * 16,
      y: sy + Math.random() * (sb - sy) * 0.3,
      vx: (Math.random() - 0.5) * 0.6,
      vy: 0.15 + Math.random() * 0.2,
      life: 1, decay: 0.003,
      col: 'rgba(0,206,201,0.6)',
    });
  }
  if (Math.random() < 0.03) {
    S.ions.push({
      x: rx + cW / 2 + (Math.random() - 0.5) * cW * 0.4,
      y: sy + Math.random() * (sb - sy),
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.1 - Math.random() * 0.15,
      life: 1, decay: 0.004,
      col: 'rgba(162,155,254,0.6)',
    });
  }
  if (S.ions.length > 28) S.ions = S.ions.slice(-28);

  ctx.save();
  S.ions = S.ions.filter(ion => {
    ion.x += ion.vx; ion.y += ion.vy; ion.life -= ion.decay;
    if (ion.life <= 0) return false;
    ctx.globalAlpha = ion.life * 0.6;
    ctx.fillStyle = ion.col;
    ctx.beginPath(); ctx.arc(ion.x, ion.y, 2, 0, Math.PI * 2); ctx.fill();
    return true;
  });
  ctx.restore();
}

// ==========================================
// QUIZ / MODO PRÁCTICA
// ==========================================
function startQuiz() {
  const excluded = new Set([13]); // H₂
  let a, c;
  do {
    a = Math.floor(Math.random() * METALS.length);
    c = Math.floor(Math.random() * METALS.length);
  } while (a === c || excluded.has(a) || excluded.has(c));
  if (METALS[a].E > METALS[c].E) [a, c] = [c, a];
  Q.a = a; Q.c = c;
  Q.questions = buildQuestions(a, c);
  Q.qIdx = 0; Q.score = 0; Q.answered = false;
  renderQuiz();
  document.getElementById('quizSection').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function buildQuestions(ai, ci) {
  const a = METALS[ai], c = METALS[ci];
  const E = Math.abs(c.E - a.E);
  const n = lcm(a.e, c.e);
  const q1 = shuffledOptions(a.name, [c.name]);
  const q2 = shuffledOptions(c.name, [a.name]);
  const q3 = shuffledOptions(n, [a.e, c.e, a.e + c.e, a.e * c.e]);
  const q4 = shuffledOptions(E, [
    Math.abs(a.E) + Math.abs(c.E),
    Math.abs(Math.abs(a.E) - Math.abs(c.E)),
    E + 0.5,
    Math.abs(a.E + c.E),
  ]);
  return [
    {
      text: `¿Qué metal es el ÁNODO (−), donde ocurre la oxidación?`,
      options: q1.options, correctIdx: q1.correctIdx,
      explain: `El ánodo es el de menor potencial de reducción (${a.symbol}, E° = ${a.E.toFixed(2)} V). Se oxida y cede electrones.`,
    },
    {
      text: `¿Qué metal es el CÁTODO (+), donde ocurre la reducción?`,
      options: q2.options, correctIdx: q2.correctIdx,
      explain: `El cátodo es el de mayor potencial de reducción (${c.symbol}, E° = ${c.E.toFixed(2)} V). Capta electrones y se reduce.`,
    },
    {
      text: `¿Cuántos electrones (n) se transfieren por unidad de reacción?`,
      options: q3.options, correctIdx: q3.correctIdx,
      explain: `n = mcm(${a.e}, ${c.e}) = ${n}. El mínimo común múltiplo de las valencias balancea la transferencia de electrones.`,
    },
    {
      text: `¿Cuál es el potencial estándar de celda E° (en V)?`,
      options: q4.options, correctIdx: q4.correctIdx,
      explain: `E°celda = E°cátodo − E°ánodo = ${c.E.toFixed(2)} − (${a.E.toFixed(2)}) = ${E.toFixed(2)} V.`,
    },
  ];
}

function shuffledOptions(correct, distractors) {
  const seen = new Set([correct]);
  const pool = [correct];
  for (const d of distractors) {
    const v = typeof correct === 'number' ? Number(d.toFixed(2)) : d;
    if (!seen.has(v)) { seen.add(v); pool.push(v); }
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return { options: pool, correctIdx: pool.indexOf(correct) };
}

function renderQuiz() {
  const sec = document.getElementById('quizSection');
  sec.hidden = !Q.active;
  if (!Q.active) return;
  const q = Q.questions[Q.qIdx];
  const a = METALS[Q.a], c = METALS[Q.c];
  document.getElementById('quizCell').textContent = `Celda: ${a.symbol} (${a.name}) vs ${c.symbol} (${c.name})`;
  document.getElementById('quizCounter').textContent = `Pregunta ${Q.qIdx + 1} / ${Q.questions.length}`;
  document.getElementById('quizScore').textContent = `Aciertos: ${Q.score}`;
  document.getElementById('quizProgress').style.width =
    `${(Q.qIdx / Q.questions.length) * 100}%`;
  document.getElementById('quizQ').textContent = q.text;
  document.getElementById('quizFeedback').hidden = true;
  const opts = document.getElementById('quizOptions');
  opts.innerHTML = '';
  q.options.forEach((o, i) => {
    const b = document.createElement('button');
    b.className = 'quiz__opt';
    b.textContent = o;
    b.addEventListener('click', () => answerQuiz(i));
    opts.appendChild(b);
  });
  document.getElementById('quizNext').hidden = true;
  document.getElementById('quizNew').hidden = true;
  Q.answered = false;
}

function answerQuiz(i) {
  if (Q.answered) return;
  Q.answered = true;
  const q = Q.questions[Q.qIdx];
  const ok = i === q.correctIdx;
  if (ok) Q.score++;
  document.querySelectorAll('#quizOptions .quiz__opt').forEach((b, j) => {
    b.disabled = true;
    if (j === q.correctIdx) b.classList.add('quiz__opt--correct');
    else if (j === i) b.classList.add('quiz__opt--wrong');
  });
  const fb = document.getElementById('quizFeedback');
  fb.hidden = false;
  fb.className = 'quiz__feedback ' + (ok ? 'quiz__feedback--ok' : 'quiz__feedback--no');
  fb.innerHTML = `<b>${ok ? 'Correcto' : 'Incorrecto'}.</b> ${q.explain}`;
  document.getElementById('quizScore').textContent = `Aciertos: ${Q.score}`;
  const last = Q.qIdx === Q.questions.length - 1;
  const next = document.getElementById('quizNext');
  next.hidden = false;
  next.textContent = last ? 'Ver resultado' : 'Siguiente pregunta →';
}

function quizNext() {
  if (Q.qIdx < Q.questions.length - 1) { Q.qIdx++; renderQuiz(); }
  else showQuizResult();
}

function showQuizResult() {
  const total = Q.questions.length;
  const pct = Q.score / total;
  const emoji = pct === 1 ? '🏆' : pct >= 0.75 ? '🎉' : pct >= 0.5 ? '👍' : '📚';
  const msg = pct === 1 ? '¡Perfecto, dominas la electroquímica!'
    : pct >= 0.75 ? '¡Muy bien! Sigue así.'
    : pct >= 0.5 ? 'Vas bien, repasa la teoría y vuelve a intentarlo.'
    : 'No te desanimes: revisa la teoría y vuelve a intentarlo.';
  document.getElementById('quizQ').textContent = '';
  document.getElementById('quizOptions').innerHTML = '';
  document.getElementById('quizProgress').style.width = '100%';
  const fb = document.getElementById('quizFeedback');
  fb.hidden = false;
  fb.className = 'quiz__feedback ' + (pct >= 0.75 ? 'quiz__feedback--ok' : 'quiz__feedback--no');
  fb.innerHTML = `${emoji} Resultado: <b>${Q.score} / ${total}</b> correctas (${Math.round(pct * 100)} %). ${msg}`;
  document.getElementById('quizNext').hidden = true;
  document.getElementById('quizNew').hidden = false;
}

// ==========================================
// TOAST
// ==========================================
function toast(msg, type = 'info') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast toast--${type} toast--show`;
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('toast--show'), 3500);
}

// ==========================================
// UTILS
// ==========================================
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }
function lcm(a, b) { return (a * b) / gcd(a, b); }
