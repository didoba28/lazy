/* ============================================================
   AIRFIT V3 — Générateur SVG du plateau sportif
   Vue quasi-isométrique dessinée par code, 100% palette AirFit.
   Chaque modèle (compact / signature / arena) est composé à
   partir des mêmes primitives : dalle, prisme, poteau, barre,
   anneaux, monkey-bars, banc, gradins, cotes techniques.
   ============================================================ */

const S = 34;            // px par mètre
const CX = 0.866;        // cos(30°)
const CY = 0.5;          // sin(30°)

/* Projection iso : (x,y,z) mètres -> [px, py] écran */
function pt(x, y, z = 0) {
  return [(x - y) * CX * S, ((x + y) * CY - z) * S];
}
const f = (n) => Math.round(n * 100) / 100;
const pts = (arr) => arr.map(p => `${f(p[0])},${f(p[1])}`).join(' ');

/* --------- Palette locale (nuances des 4 couleurs AirFit) --------- */
const C = {
  slabTop: '#12457F',
  slabTopZone: '#1B5493',
  slabTopSoft: '#0E3A6E',
  slabSide: '#0A2C55',
  slabFront: '#071F3E',
  line: '#FFFFFF',
  post: '#01549D',
  postShade: '#013B70',
  postCap: '#E5E6E9',
  bar: '#F2F3F5',
  barShade: '#C6CDD6',
  steelTop: '#E5E6E9',
  steelSide: '#C2CBD6',
  steelFront: '#A9B5C4',
  wood: '#D8DEE7',
  navy: '#001231',
  ring: '#FFFFFF',
  groundInstalled: '#DFE5ED',
  groundInstalled2: '#D3DBE7',
  tree1: '#BFCEE2', tree2: '#A9BDD8', trunk: '#5C749B',
  people: '#0A2547',
};

/* ============================ PRIMITIVES ============================ */

/* Prisme iso posé en (x,y), dimensions plan w×d, de z0 à z0+h */
function prism(x, y, w, d, z0, h, fills, extra = '') {
  const t = [pt(x, y, z0 + h), pt(x + w, y, z0 + h), pt(x + w, y + d, z0 + h), pt(x, y + d, z0 + h)];
  const r = [pt(x + w, y, z0 + h), pt(x + w, y + d, z0 + h), pt(x + w, y + d, z0), pt(x + w, y, z0)];
  const fr = [pt(x, y + d, z0 + h), pt(x + w, y + d, z0 + h), pt(x + w, y + d, z0), pt(x, y + d, z0)];
  return `<g ${extra}>
    <polygon points="${pts(fr)}" fill="${fills.front}"/>
    <polygon points="${pts(r)}" fill="${fills.side}"/>
    <polygon points="${pts(t)}" fill="${fills.top}"/>
  </g>`;
}

/* Poteau acier (dessiné écran : fût + arête ombrée + capuchon) */
function post(x, y, h, w = 4.2) {
  const [bx, by] = pt(x, y);
  const [tx, ty] = pt(x, y, h);
  return `<g class="eq-post">
    <ellipse cx="${f(bx)}" cy="${f(by)}" rx="${w * 1.7}" ry="${w * 0.85}" fill="${C.navy}" opacity=".28"/>
    <rect x="${f(bx - w / 2)}" y="${f(ty)}" width="${w}" height="${f(by - ty)}" fill="${C.post}"/>
    <rect x="${f(bx + w / 2 - 1.4)}" y="${f(ty)}" width="1.4" height="${f(by - ty)}" fill="${C.postShade}"/>
    <rect x="${f(bx - w / 2)}" y="${f(ty - 2.4)}" width="${w}" height="2.4" rx="1.1" fill="${C.postCap}"/>
    <rect x="${f(bx - w / 2)}" y="${f(by - 7)}" width="${w}" height="4" fill="${C.postShade}"/>
  </g>`;
}

/* Barre horizontale entre 2 points plan à hauteur h */
function bar(x1, y1, x2, y2, h, sw = 3.4) {
  const a = pt(x1, y1, h), b = pt(x2, y2, h);
  return `<g class="eq-bar">
    <line x1="${f(a[0])}" y1="${f(a[1] + 1.1)}" x2="${f(b[0])}" y2="${f(b[1] + 1.1)}" stroke="${C.barShade}" stroke-width="${sw}" stroke-linecap="round"/>
    <line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${C.bar}" stroke-width="${sw - 1}" stroke-linecap="round"/>
  </g>`;
}

/* Paire d'anneaux suspendus au point plan (x,y) d'une barre à hauteur h */
function rings(x, y, h) {
  const drop = 0.55, gap = 0.22;
  let out = '<g class="eq-rings">';
  [-gap, gap].forEach(g => {
    const a = pt(x + g, y, h), b = pt(x + g, y, h - drop);
    out += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${C.barShade}" stroke-width="1.4"/>
      <circle cx="${f(b[0])}" cy="${f(b[1] + 5)}" r="5.2" fill="none" stroke="${C.ring}" stroke-width="2.2"/>`;
  });
  return out + '</g>';
}

/* Monkey-bars : 2 rails le long de y entre y1 et y2, écartés de g en x */
function monkeyBars(x, y1, y2, h, g = 0.55) {
  let out = '';
  const step = 0.42;
  for (let yy = y1 + step / 2; yy < y2; yy += step) {
    out += bar(x - g / 2, yy, x + g / 2, yy, h - 0.03, 2.4);
  }
  out += bar(x - g / 2, y1, x - g / 2, y2, h, 3);
  out += bar(x + g / 2, y1, x + g / 2, y2, h, 3);
  return `<g class="eq-monkey">${out}</g>`;
}

/* Barres parallèles basses (le long de x) */
function parallelBars(x1, x2, y, h = 1.3, g = 0.55) {
  let out = '';
  [y - g / 2, y + g / 2].forEach(yy => {
    out += post(x1, yy, h, 3.4) + post(x2, yy, h, 3.4);
    out += bar(x1, yy, x2, yy, h, 3.2);
  });
  return `<g class="eq-pbars">${out}</g>`;
}

/* Banc acier + assise claire, longueur le long de x */
function bench(x, y, len = 1.8) {
  let out = '';
  out += prism(x + 0.12, y + 0.08, 0.14, 0.34, 0, 0.4, { top: C.steelSide, side: C.postShade, front: C.navy });
  out += prism(x + len - 0.26, y + 0.08, 0.14, 0.34, 0, 0.4, { top: C.steelSide, side: C.postShade, front: C.navy });
  out += prism(x, y, len, 0.5, 0.4, 0.09, { top: C.wood, side: C.steelSide, front: C.steelFront });
  return `<g class="eq-bench">${out}</g>`;
}

/* Plyo-box */
function plyo(x, y, w, h) {
  return `<g class="eq-plyo">${prism(x, y, w, w, 0, h, { top: C.steelTop, side: C.steelSide, front: C.steelFront })}</g>`;
}

/* Gradins bas : 2 marches le long de y, adossés au bord x=0 */
function bleachers(y1, y2, xEdge = 0.05) {
  let out = '';
  out += prism(xEdge, y1, 0.62, y2 - y1, 0, 0.72, { top: C.wood, side: C.steelSide, front: C.steelFront });
  out += prism(xEdge + 0.62, y1, 0.62, y2 - y1, 0, 0.38, { top: C.wood, side: C.steelSide, front: C.steelFront });
  return `<g class="eq-bleachers">${out}</g>`;
}

/* Cage cross-training : 4 montants + cadre de poutres haut */
function rig(x, y, w, d, h) {
  let out = '';
  out += post(x, y, h) + post(x + w, y, h);
  out += bar(x, y, x + w, y, h);           // poutre arrière
  out += bar(x, y, x, y + d, h);           // poutre gauche
  out += bar(x + w, y, x + w, y + d, h);   // poutre droite
  // barres intermédiaires de traction dans la cage
  out += bar(x, y + d * 0.5, x + w, y + d * 0.5, h - 0.35, 2.6);
  out += post(x, y + d, h) + post(x + w, y + d, h);
  out += bar(x, y + d, x + w, y + d, h);   // poutre avant
  return `<g class="eq-rig">${out}</g>`;
}

/* Texte posé à plat sur la dalle (plan iso) */
function slabText(x, y, txt, size = 12, fill = 'rgba(255,255,255,.5)', ls = '.35em') {
  const [ex, ey] = pt(x, y);
  return `<text transform="matrix(${CX},${CY},${-CX},${CY},${f(ex)},${f(ey)})" font-family="Barlow,sans-serif" font-weight="600" font-size="${size}" letter-spacing="${ls}" fill="${fill}">${txt}</text>`;
}

/* Ligne de marquage au sol dans le plan */
function slabLine(x1, y1, x2, y2, w = 1.4, color = C.line, o = 0.55, dash = '') {
  const a = pt(x1, y1, 0.01), b = pt(x2, y2, 0.01);
  return `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${color}" stroke-width="${w}" opacity="${o}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
}

/* Cercle de marquage à plat sur la dalle */
function slabCircle(x, y, r, w = 1.6, o = 0.6) {
  const [ex, ey] = pt(x, y);
  return `<circle r="${f(r * S)}" transform="matrix(${CX},${CY},${-CX},${CY},${f(ex)},${f(ey)})" fill="none" stroke="${C.line}" stroke-width="${w}" opacity="${o}"/>`;
}

/* Zone colorée à plat (rectangle plan) */
function slabZone(x, y, w, d, fill = C.slabTopZone, o = 1) {
  return `<polygon points="${pts([pt(x, y, 0.005), pt(x + w, y, 0.005), pt(x + w, y + d, 0.005), pt(x, y + d, 0.005)])}" fill="${fill}" opacity="${o}"/>`;
}

/* ====================== COTES TECHNIQUES ====================== */

function tick(x, y, cls = 'dim') {
  return `<line class="${cls}" pathLength="1" x1="${f(x - 4)}" y1="${f(y + 4)}" x2="${f(x + 4)}" y2="${f(y - 4)}"/>`;
}
function dimLabel(x, y, txt, anchor = 'middle') {
  return `<text class="dim-t" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}">${txt}</text>`;
}

/* Cote le long du bord avant (y = D) : de x=0 à x=W */
function dimFront(W, D, label, off = 1.1) {
  const a = pt(0, D + off), b = pt(W, D + off);
  const ea = pt(0, D + 0.25), eb = pt(W, D + 0.25);
  const ea2 = pt(0, D + off + 0.3), eb2 = pt(W, D + off + 0.3);
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return `<g class="g-dim">
    <line class="dim" pathLength="1" x1="${f(ea[0])}" y1="${f(ea[1])}" x2="${f(ea2[0])}" y2="${f(ea2[1])}"/>
    <line class="dim" pathLength="1" x1="${f(eb[0])}" y1="${f(eb[1])}" x2="${f(eb2[0])}" y2="${f(eb2[1])}"/>
    <line class="dim" pathLength="1" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>
    ${tick(a[0], a[1])}${tick(b[0], b[1])}
    ${dimLabel(mid[0], mid[1] + 22, label)}
  </g>`;
}

/* Cote le long du bord droit (x = W) : de y=0 à y=D */
function dimSide(W, D, label, off = 1.1) {
  const a = pt(W + off, 0), b = pt(W + off, D);
  const ea = pt(W + 0.25, 0), eb = pt(W + 0.25, D);
  const ea2 = pt(W + off + 0.3, 0), eb2 = pt(W + off + 0.3, D);
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return `<g class="g-dim">
    <line class="dim" pathLength="1" x1="${f(ea[0])}" y1="${f(ea[1])}" x2="${f(ea2[0])}" y2="${f(ea2[1])}"/>
    <line class="dim" pathLength="1" x1="${f(eb[0])}" y1="${f(eb[1])}" x2="${f(eb2[0])}" y2="${f(eb2[1])}"/>
    <line class="dim" pathLength="1" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>
    ${tick(a[0], a[1])}${tick(b[0], b[1])}
    ${dimLabel(mid[0] + 16, mid[1] + 14, label, 'start')}
  </g>`;
}

/* Cote verticale (hauteur de structure) au poteau (x,y) */
function dimHeight(x, y, h, label) {
  const [bx, by] = pt(x, y);
  const gx = bx + 34;
  const ty = by - h * S;
  return `<g class="g-dim">
    <line class="dim" pathLength="1" x1="${f(bx + 8)}" y1="${f(by)}" x2="${f(gx + 6)}" y2="${f(by)}"/>
    <line class="dim" pathLength="1" x1="${f(bx + 8)}" y1="${f(ty)}" x2="${f(gx + 6)}" y2="${f(ty)}"/>
    <line class="dim" pathLength="1" x1="${f(gx)}" y1="${f(by)}" x2="${f(gx)}" y2="${f(ty)}"/>
    ${tick(gx, by)}${tick(gx, ty)}
    ${dimLabel(gx + 10, (by + ty) / 2 + 4, label, 'start')}
  </g>`;
}

/* Étiquette avec ligne de rappel (surface, matériau…) */
function callout(x, y, z, dx, dy, txt, sub = '') {
  const [ax, ay] = pt(x, y, z);
  const bx = ax + dx, by = ay + dy;
  const shelf = dx >= 0 ? 60 : -60;
  return `<g class="g-dim">
    <line class="dim" pathLength="1" x1="${f(ax)}" y1="${f(ay)}" x2="${f(bx)}" y2="${f(by)}"/>
    <line class="dim" pathLength="1" x1="${f(bx)}" y1="${f(by)}" x2="${f(bx + shelf)}" y2="${f(by)}"/>
    <circle class="dim-dot" cx="${f(ax)}" cy="${f(ay)}" r="2.6"/>
    ${dimLabel(bx + (dx >= 0 ? 0 : -60), by - 8, txt, 'start')}
    ${sub ? `<text class="dim-t dim-t--sub" x="${f(bx + (dx >= 0 ? 0 : -60))}" y="${f(by + 14)}" text-anchor="start">${sub}</text>` : ''}
  </g>`;
}

/* Croix de repérage techniques */
function cross(x, y, s = 7) {
  return `<g class="reg-cross"><line x1="${f(x - s)}" y1="${f(y)}" x2="${f(x + s)}" y2="${f(y)}"/><line x1="${f(x)}" y1="${f(y - s)}" x2="${f(x)}" y2="${f(y + s)}"/></g>`;
}

/* ====================== DALLE + MARQUAGES ====================== */

function slab(W, D, idp) {
  const t = 0.32;
  const top = [pt(0, 0), pt(W, 0), pt(W, D), pt(0, D)];
  const right = [pt(W, 0), pt(W, D), pt(W, D, -t), pt(W, 0, -t)];
  const front = [pt(0, D), pt(W, D), pt(W, D, -t), pt(0, D, -t)];
  /* liseré haut de dalle */
  const inset = 0.35;
  const border = [pt(inset, inset, 0.01), pt(W - inset, inset, 0.01), pt(W - inset, D - inset, 0.01), pt(inset, D - inset, 0.01)];
  return `
    <polygon points="${pts(front)}" fill="${C.slabFront}"/>
    <polygon points="${pts(right)}" fill="${C.slabSide}"/>
    <polygon points="${pts(top)}" fill="url(#slabGrad-${idp})"/>
    <polygon points="${pts(border)}" fill="none" stroke="${C.line}" stroke-width="1.3" opacity=".38"/>`;
}

/* Ombre portée douce sous le plateau */
function dropShadow(W, D, idp) {
  const [cx, cy] = pt(W / 2, D / 2, -0.9);
  const rx = (W + D) * CX * S * 0.62;
  return `<ellipse class="p-shadow" cx="${f(cx)}" cy="${f(cy + 26)}" rx="${f(rx)}" ry="${f(rx * 0.3)}" fill="url(#shadowGrad-${idp})"/>`;
}

/* ====================== CONTEXTE « VUE INSTALLÉE » ====================== */

function tree(x, y, scale = 1) {
  const [bx, by] = pt(x, y);
  const r = 17 * scale;
  return `<g class="ctx-tree">
    <ellipse cx="${f(bx)}" cy="${f(by + 2)}" rx="${r * 1.15}" ry="${r * 0.32}" fill="${C.navy}" opacity=".10"/>
    <line x1="${f(bx)}" y1="${f(by)}" x2="${f(bx)}" y2="${f(by - 30 * scale)}" stroke="${C.trunk}" stroke-width="${3 * scale}"/>
    <circle cx="${f(bx - r * 0.55)}" cy="${f(by - 36 * scale)}" r="${r * 0.8}" fill="${C.tree2}"/>
    <circle cx="${f(bx + r * 0.5)}" cy="${f(by - 40 * scale)}" r="${r * 0.9}" fill="${C.tree1}"/>
    <circle cx="${f(bx)}" cy="${f(by - 50 * scale)}" r="${r * 0.75}" fill="${C.tree1}"/>
  </g>`;
}

function person(x, y, hM = 1.72, flip = 1) {
  const [bx, by] = pt(x, y);
  const h = hM * S;
  return `<g class="ctx-person" transform="translate(${f(bx)},${f(by)}) scale(${flip},1)" fill="${C.people}">
    <ellipse cx="0" cy="1" rx="9" ry="3" opacity=".14"/>
    <circle cx="0" cy="${f(-h + 6)}" r="5.4"/>
    <path d="M -5.4 ${f(-h + 14)} q 5.4 -3.4 10.8 0 l 1.6 ${f(h * 0.38)} q -7 2.6 -14 0 Z"/>
    <path d="M -4.6 ${f(-h * 0.44)} l -1.2 ${f(h * 0.42)} l 3.4 0 l 2.2 ${f(-h * 0.3)} l 2.4 ${f(h * 0.3)} l 3.4 0 l -1.6 ${f(-h * 0.42)} Z"/>
  </g>`;
}

function installedContext(W, D) {
  const m = 2.6; // marge d'esplanade autour de la dalle
  const g = [pt(-m, -m, -0.34), pt(W + m, -m, -0.34), pt(W + m, D + m, -0.34), pt(-m, D + m, -0.34)];
  const path = [pt(W + 0.4, D * 0.25, -0.33), pt(W + m, D * 0.25, -0.33), pt(W + m, D * 0.62, -0.33), pt(W + 0.4, D * 0.62, -0.33)];
  let out = `<g class="ctx">
    <polygon points="${pts(g)}" fill="${C.groundInstalled}"/>
    <polygon points="${pts(path)}" fill="${C.groundInstalled2}"/>`;
  // joints de dallage sur l'esplanade
  for (let i = 1; i < 4; i++) {
    const yy = -m + (D + 2 * m) * (i / 4);
    out += `<line x1="${f(pt(-m, yy, -0.33)[0])}" y1="${f(pt(-m, yy, -0.33)[1])}" x2="${f(pt(W + m, yy, -0.33)[0])}" y2="${f(pt(W + m, yy, -0.33)[1])}" stroke="#C5CFDD" stroke-width="1"/>`;
  }
  out += tree(-1.5, D * 0.2, 1.15) + tree(W * 0.3, -1.7, 0.95) + tree(W + 1.6, D + 1.2, 1.25);
  return out + '</g>';
}

function installedPeople(W, D) {
  return `<g class="ctx-people">
    ${person(W * 0.62, D + 1.6, 1.72, 1)}
    ${person(W * 0.68, D + 1.9, 1.5, -1)}
    ${person(-0.9, D * 0.72, 1.68, 1)}
  </g>`;
}

/* ====================== ÉQUIPEMENTS PAR MODÈLE ====================== */
/* Ordre de dessin : de l'arrière (x+y petit) vers l'avant.            */

function markingsCompact(W, D) {
  return `<g class="g-marks">
    ${slabZone(6.2, 2.0, 3.2, 3.0, C.slabTopZone, 0.85)}
    ${slabCircle(7.8, 3.5, 1.15)}
    ${slabCircle(7.8, 3.5, 0.45, 1.3, 0.4)}
    ${slabLine(1.2, 5.6, 5.6, 5.6, 1.4, C.line, 0.4, '7 6')}
    ${slabLine(1.2, 6.2, 5.6, 6.2, 1.4, C.line, 0.28, '7 6')}
    ${slabText(2.1, 8.35, 'AIRFIT', 13)}
  </g>`;
}

function equipCompact(W, D) {
  let e = '';
  e += post(2.2, 1.2, 2.75) + post(4.4, 1.2, 2.75) + post(6.2, 1.2, 2.15);
  e += bar(2.2, 1.2, 4.4, 1.2, 2.6);
  e += bar(4.4, 1.2, 6.2, 1.2, 2.0);
  e += parallelBars(3.2, 5.0, 6.8);
  e += bench(7.4, 6.5, 1.8);
  return e;
}

function markingsSignature(W, D) {
  return `<g class="g-marks">
    ${slabZone(9.4, 5.6, 4.0, 3.6, C.slabTopZone, 0.85)}
    ${slabCircle(7.9, 8.3, 1.0)}
    ${slabLine(1.4, 5.4, 5.4, 5.4, 1.4, C.line, 0.4, '7 6')}
    ${slabLine(1.4, 6.0, 5.4, 6.0, 1.4, C.line, 0.28, '7 6')}
    ${slabLine(9.8, 6.0, 13.0, 6.0, 1.3, C.line, 0.35)}
    ${slabLine(9.8, 7.0, 13.0, 7.0, 1.3, C.line, 0.35)}
    ${slabText(1.8, 9.35, 'AIRFIT', 14)}
  </g>`;
}

function equipSignature(W, D) {
  let e = '';
  e += post(2.0, 1.6, 2.75) + post(4.2, 1.6, 2.75) + post(6.4, 1.6, 2.45);
  e += bar(2.0, 1.6, 4.2, 1.6, 2.6);
  e += bar(4.2, 1.6, 6.4, 1.6, 2.3);
  e += post(6.4, 4.4, 2.45);
  e += monkeyBars(6.4, 1.6, 4.4, 2.3);
  e += post(9.6, 1.6, 2.5) + post(12.0, 1.6, 2.5);
  e += bar(9.6, 1.6, 12.0, 1.6, 2.35);
  e += rings(10.8, 1.6, 2.35);
  e += parallelBars(2.4, 4.2, 7.4);
  e += bench(6.0, 8.2, 1.8);
  e += plyo(10.5, 6.3, 0.75, 0.55) + plyo(11.5, 6.8, 0.75, 0.35);
  return e;
}

function markingsArena(W, D) {
  return `<g class="g-marks">
    ${slabZone(12.4, 0.9, 5.4, 4.6, C.slabTopSoft, 0.9)}
    ${slabZone(14.6, 6.4, 4.4, 3.0, C.slabTopZone, 0.85)}
    ${slabCircle(16.7, 7.9, 1.05)}
    ${slabLine(2.6, 5.6, 7.4, 5.6, 1.4, C.line, 0.4, '7 6')}
    ${slabLine(2.6, 6.2, 7.4, 6.2, 1.4, C.line, 0.28, '7 6')}
    ${slabLine(8.6, 6.4, 12.6, 6.4, 1.3, C.line, 0.35)}
    ${slabLine(8.6, 7.4, 12.6, 7.4, 1.3, C.line, 0.35)}
    ${slabText(3.0, 9.35, 'AIRFIT', 15)}
  </g>`;
}

function equipArena(W, D) {
  let e = '';
  e += bleachers(1.4, 8.6);
  e += post(3.2, 1.8, 2.75) + post(5.4, 1.8, 2.75) + post(7.6, 1.8, 2.45);
  e += bar(3.2, 1.8, 5.4, 1.8, 2.6);
  e += bar(5.4, 1.8, 7.6, 1.8, 2.3);
  e += post(7.6, 4.6, 2.45);
  e += monkeyBars(7.6, 1.8, 4.6, 2.3);
  e += post(10.9, 1.8, 2.5) + post(13.1, 1.8, 2.5);
  e += bar(10.9, 1.8, 13.1, 1.8, 2.35);
  e += rings(12.0, 1.8, 2.35);
  e += rig(14.0, 1.6, 2.6, 2.8, 2.7);
  e += parallelBars(5.2, 7.0, 7.6);
  e += bench(10.2, 8.4, 1.8);
  e += plyo(13.2, 7.0, 0.75, 0.55) + plyo(14.2, 7.5, 0.75, 0.35);
  return e;
}

const MODEL_PARTS = {
  compact: { markings: markingsCompact, equip: equipCompact, dimPost: [2.2, 1.2, 2.75], matPost: [6.2, 1.2, 2.15] },
  signature: { markings: markingsSignature, equip: equipSignature, dimPost: [2.0, 1.6, 2.75], matPost: [12.0, 1.6, 2.5] },
  arena: { markings: markingsArena, equip: equipArena, dimPost: [3.2, 1.8, 2.75], matPost: [16.6, 1.6, 2.7] },
};

/* ============================ ASSEMBLAGE ============================ */

let uid = 0;

/**
 * Construit le SVG complet d'un plateau.
 * @param {object} model  entrée de PLATFORMS (data.js)
 * @param {object} opts   { installed, withDims, idPrefix }
 * @returns {{ svg:string, hotspots:Array, vb:object }}
 */
export function buildPlatform(model, opts = {}) {
  const { installed = false, withDims = true } = opts;
  const idp = opts.idPrefix || `p${++uid}`;
  const W = model.w, D = model.d;
  const parts = MODEL_PARTS[model.id];

  /* ViewBox englobante (dalle + cotes + structures) */
  const padDim = withDims ? 2.1 : (installed ? 3.4 : 0.9);
  const minX = pt(0, D + padDim)[0] - 64;
  const maxX = pt(W + padDim, 0)[0] + (withDims ? 120 : 64);
  const minY = -3.6 * S - (withDims ? 46 : 16);
  const maxY = pt(W, D)[1] + padDim * CY * S + 46;
  const vb = { x: f(minX), y: f(minY), w: f(maxX - minX), h: f(maxY - minY) };

  const defs = `<defs>
    <linearGradient id="slabGrad-${idp}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1A5292"/><stop offset=".55" stop-color="${C.slabTop}"/><stop offset="1" stop-color="#0D3765"/>
    </linearGradient>
    <radialGradient id="shadowGrad-${idp}" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="${C.navy}" stop-opacity=".42"/><stop offset=".7" stop-color="${C.navy}" stop-opacity=".14"/><stop offset="1" stop-color="${C.navy}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sheen-${idp}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset=".5" stop-color="#FFFFFF" stop-opacity=".16"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
  </defs>`;

  let body = '';
  if (installed) {
    body += installedContext(W, D);
  } else {
    body += dropShadow(W, D, idp);
  }
  body += slab(W, D, idp);
  body += parts.markings(W, D);
  body += `<g class="g-equip">${parts.equip(W, D)}</g>`;
  if (installed) body += installedPeople(W, D);

  /* Reflet balayant la structure (animé via GSAP sur .sheen) */
  const sheenPoly = [pt(-1, -1, 3.2), pt(W + 1, -1, 3.2), pt(W + 1, D + 1, -0.4), pt(-1, D + 1, -0.4)];
  body += `<polygon class="sheen" points="${pts(sheenPoly)}" fill="url(#sheen-${idp})" opacity="0" style="pointer-events:none"/>`;

  /* Cotes techniques */
  if (withDims) {
    const dp = parts.dimPost, mp = parts.matPost;
    /* l'étiquette de surface monte au-dessus des structures (zone libre) */
    const axU = W * 0.55, ayV = D * 0.5;
    const dyArea = -(((axU + ayV) * CY) * S + 3.1 * S);
    body += `<g class="g-dims">
      ${dimFront(W, D, model.dims.w)}
      ${dimSide(W, D, model.dims.d)}
      ${dimHeight(dp[0], dp[1], dp[2], model.dims.h)}
      ${callout(axU, ayV, 0, 28, dyArea, model.dims.area, 'SOL SPORTIF EPDM')}
      ${callout(mp[0], mp[1], mp[2], 56, -26, model.dims.mat)}
      ${cross(minX + 30, minY + 26)}${cross(maxX - 30, minY + 26)}
      ${cross(minX + 30, maxY - 26)}${cross(maxX - 30, maxY - 26)}
    </g>`;
  }

  const svg = `<svg class="platform-svg${installed ? ' is-installed' : ''}" viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Plateau sportif AirFit ${model.name}, vue ${installed ? 'installée' : 'produit'}, ${model.dims.w} par ${model.dims.d}" preserveAspectRatio="xMidYMid meet">${defs}${body}</svg>`;

  /* Hotspots -> position en % du viewBox */
  const hotspots = (model.hotspots || []).map(h => {
    const [hx, hy] = pt(h.u, h.v, h.z || 0);
    return {
      label: h.label, desc: h.desc,
      left: f(((hx - vb.x) / vb.w) * 100),
      top: f(((hy - vb.y) / vb.h) * 100),
    };
  });

  return { svg, hotspots, vb };
}

/* Scène « avant » : terrain nu, même viewBox que le plateau installé */
export function buildEmptyLot(model, opts = {}) {
  const idp = opts.idPrefix || `e${++uid}`;
  const W = model.w, D = model.d;
  const padDim = 3.4;
  const minX = pt(0, D + padDim)[0] - 64;
  const maxX = pt(W + padDim, 0)[0] + 64;
  const minY = -3.6 * S - 16;
  const maxY = pt(W, D)[1] + padDim * CY * S + 46;
  const vb = { x: f(minX), y: f(minY), w: f(maxX - minX), h: f(maxY - minY) };

  const m = 2.6;
  const g = [pt(-m, -m, -0.34), pt(W + m, -m, -0.34), pt(W + m, D + m, -0.34), pt(-m, D + m, -0.34)];
  const lot = [pt(0, 0), pt(W, 0), pt(W, D), pt(0, D)];
  let body = `<polygon points="${pts(g)}" fill="#E9EDF3"/>`;
  /* herbes folles / gravier stylisés */
  const tufts = [[1.5, 2.2], [4.2, 6.8], [7.8, 1.4], [W - 2, D - 2.4], [W * 0.55, D * 0.5], [2.2, D - 1.2], [W - 1.2, 3.2]];
  tufts.forEach(([tx, ty]) => {
    const [bx, by] = pt(tx, ty, -0.32);
    body += `<g stroke="#B9C4D4" stroke-width="1.6" stroke-linecap="round">
      <line x1="${f(bx)}" y1="${f(by)}" x2="${f(bx - 4)}" y2="${f(by - 9)}"/>
      <line x1="${f(bx)}" y1="${f(by)}" x2="${f(bx + 1)}" y2="${f(by - 11)}"/>
      <line x1="${f(bx)}" y1="${f(by)}" x2="${f(bx + 5)}" y2="${f(by - 8)}"/>
    </g>`;
  });
  /* emprise future en pointillés + label */
  body += `<polygon points="${pts(lot.map(p => [p[0], p[1] + 0.02]))}" fill="#DEE4EC" opacity=".65"/>
    <polygon points="${pts(lot)}" fill="none" stroke="#01549D" stroke-width="1.6" stroke-dasharray="9 7" opacity=".7"/>`;
  const [lx, ly] = pt(W * 0.5, D * 0.55);
  body += `<text x="${f(lx)}" y="${f(ly)}" text-anchor="middle" font-family="Barlow,sans-serif" font-weight="500" font-size="13" letter-spacing=".22em" fill="#5F7291">${Math.round(W * D)} M² DISPONIBLES</text>`;
  body += tree(-1.5, D * 0.2, 1.05) + tree(W + 1.6, D + 1.2, 1.1);

  const svg = `<svg class="platform-svg" viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Terrain vide avant installation, ${Math.round(W * D)} mètres carrés disponibles" preserveAspectRatio="xMidYMid meet">${body}</svg>`;
  return { svg, vb };
}
