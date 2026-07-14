/* ==========================================================================
   AirFit — Générateur SVG du plateau sportif (vue quasi-isométrique)
   Un moteur de projection unique dessine les 3 modèles : compact,
   signature, arena. Tout est vectoriel, dans la palette AirFit.
   ========================================================================== */

const A = 0.9;   // étalement horizontal
const B = 0.42;  // aplatissement vertical (légère contre-plongée)

/** Projection plan (x, y, z) -> écran [X, Y] */
function P(x, y, z = 0) {
  return [(x - y) * A, (x + y) * B - z];
}
function pt(x, y, z = 0) {
  const [X, Y] = P(x, y, z);
  return `${X.toFixed(2)},${Y.toFixed(2)}`;
}

/* --------------------------------------------------------------------------
   Primitives d'agrès
   -------------------------------------------------------------------------- */

/** Poteau vertical avec platine au sol et micro-ombre */
function post(x, y, h, w = 2.6) {
  const [bx, by] = P(x, y, 0);
  const [tx, ty] = P(x, y, h);
  return `
    <ellipse cx="${bx}" cy="${by + 0.6}" rx="${w * 1.7}" ry="${w * 0.7}" fill="#001231" opacity="0.5"/>
    <line x1="${bx}" y1="${by}" x2="${tx}" y2="${ty}" stroke="#08234A" stroke-width="${w + 1.3}" stroke-linecap="round"/>
    <line x1="${bx}" y1="${by}" x2="${tx}" y2="${ty}" stroke="url(#GRAD-post)" stroke-width="${w}" stroke-linecap="round"/>
    <line x1="${bx - w * 0.22}" y1="${by - 1}" x2="${tx - w * 0.22}" y2="${ty + 1}" stroke="#FFFFFF" stroke-width="${w * 0.28}" stroke-linecap="round" opacity="0.75"/>`;
}

/** Barre horizontale entre deux points du plan, à hauteur z */
function bar(x1, y1, x2, y2, z, w = 2) {
  const [ax, ay] = P(x1, y1, z);
  const [bx, by] = P(x2, y2, z);
  return `
    <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#08234A" stroke-width="${w + 1.1}" stroke-linecap="round"/>
    <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="url(#GRAD-bar)" stroke-width="${w}" stroke-linecap="round"/>
    <line x1="${ax}" y1="${ay - w * 0.34}" x2="${bx}" y2="${by - w * 0.34}" stroke="#FFFFFF" stroke-width="${w * 0.3}" stroke-linecap="round" opacity="0.8"/>`;
}

/** Paire d'anneaux suspendus sous une barre */
function rings(x1, y1, x2, y2, z, drop = 7) {
  let s = '';
  [[x1, y1], [x2, y2]].forEach(([x, y]) => {
    const [tx, ty] = P(x, y, z);
    const ry = ty + drop;
    s += `
      <line x1="${tx}" y1="${ty}" x2="${tx}" y2="${ry}" stroke="#E5E6E9" stroke-width="0.9" opacity="0.9"/>
      <circle cx="${tx}" cy="${ry + 2.6}" r="2.7" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
      <circle cx="${tx}" cy="${ry + 2.6}" r="2.7" fill="none" stroke="#01549D" stroke-width="0.6" opacity="0.5"/>`;
  });
  return s;
}

/** Structure de traction : n poteaux alignés + barres entre paires */
function pullupRig(x, y, dx, dy, n, heights, span) {
  let s = '';
  const posts = [];
  for (let i = 0; i < n; i++) posts.push([x + dx * i * span, y + dy * i * span]);
  // barres (dessinées d'abord : elles passent derrière les poteaux proches)
  for (let i = 0; i < n - 1; i++) {
    const h = heights[i % heights.length];
    s += bar(posts[i][0], posts[i][1], posts[i + 1][0], posts[i + 1][1], h, 1.9);
  }
  for (let i = 0; i < n; i++) {
    const h = Math.max(heights[Math.min(i, heights.length - 1)], heights[Math.max(0, i - 1) % heights.length]);
    s += post(posts[i][0], posts[i][1], h, 2.7);
  }
  return s;
}

/** Portique haut avec anneaux */
function gantry(x1, y1, x2, y2, h) {
  let s = '';
  s += bar(x1, y1, x2, y2, h, 2.3);
  const mx1 = x1 + (x2 - x1) * 0.32, my1 = y1 + (y2 - y1) * 0.32;
  const mx2 = x1 + (x2 - x1) * 0.62, my2 = y1 + (y2 - y1) * 0.62;
  s += rings(mx1, my1, mx2, my2, h, 8);
  s += post(x1, y1, h, 3);
  s += post(x2, y2, h, 3);
  return s;
}

/** Barres parallèles basses */
function parallelBars(x, y, len, gap, h) {
  let s = '';
  s += bar(x, y, x + len, y, h, 1.8);
  s += bar(x, y + gap, x + len, y + gap, h, 1.8);
  [[x, y], [x + len, y], [x, y + gap], [x + len, y + gap]].forEach(([px, py]) => {
    s += post(px, py, h, 2);
  });
  return s;
}

/** Banc / box plyo : volume bas extrudé */
function bench(x, y, w, d, h, tone = '#0E3A73') {
  const top = `${pt(x, y, h)} ${pt(x + w, y, h)} ${pt(x + w, y + d, h)} ${pt(x, y + d, h)}`;
  const right = `${pt(x + w, y, h)} ${pt(x + w, y + d, h)} ${pt(x + w, y + d, 0)} ${pt(x + w, y, 0)}`;
  const front = `${pt(x, y + d, h)} ${pt(x + w, y + d, h)} ${pt(x + w, y + d, 0)} ${pt(x, y + d, 0)}`;
  const [sx, sy] = P(x + w / 2, y + d / 2, 0);
  return `
    <ellipse cx="${sx}" cy="${sy + h * 0.24 + 1.5}" rx="${(w + d) * 0.62}" ry="${(w + d) * 0.2}" fill="#001231" opacity="0.45"/>
    <polygon points="${right}" fill="#06224B"/>
    <polygon points="${front}" fill="#082B58"/>
    <polygon points="${top}" fill="${tone}" stroke="#5F93C4" stroke-width="0.6"/>
    <polygon points="${top}" fill="url(#GRAD-benchtop)" opacity="0.55"/>`;
}

/** Gradins bas : deux marches longues le long du fond */
function bleachers(x, y, len, depth, steps = 2) {
  let s = '';
  for (let i = steps - 1; i >= 0; i--) {
    const sy = y + i * depth;
    const h = (steps - i) * 5.2;
    s += bench(x, sy, len, depth * 0.92, h, i === 0 ? '#123F79' : '#0E3565');
    // liseré lumineux sur le nez de marche
    s += `<line x1="${P(x, sy + depth * 0.92, h)[0]}" y1="${P(x, sy + depth * 0.92, h)[1]}"
            x2="${P(x + len, sy + depth * 0.92, h)[0]}" y2="${P(x + len, sy + depth * 0.92, h)[1]}"
            stroke="#FFFFFF" stroke-width="0.8" opacity="0.55"/>`;
  }
  return s;
}

/** Échelle de motricité peinte au sol (dans le repère plan, via matrix) */
function floorLadder(x, y, w, rungs, step) {
  let s = `<g stroke="#FFFFFF" stroke-width="1.4" opacity="0.6" fill="none">`;
  for (let i = 0; i <= rungs; i++) {
    s += `<line x1="${x}" y1="${y + i * step}" x2="${x + w}" y2="${y + i * step}"/>`;
  }
  s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + rungs * step}"/>`;
  s += `<line x1="${x + w}" y1="${y}" x2="${x + w}" y2="${y + rungs * step}"/></g>`;
  return s;
}

/* --------------------------------------------------------------------------
   Dalle + marquages
   -------------------------------------------------------------------------- */

function slab(W, D, T, id) {
  const top = `${pt(0, 0)} ${pt(W, 0)} ${pt(W, D)} ${pt(0, D)}`;
  const right = `${pt(W, 0, 0)} ${pt(W, D, 0)} ${pt(W, D, -T)} ${pt(W, 0, -T)}`;
  const front = `${pt(0, D, 0)} ${pt(W, D, 0)} ${pt(W, D, -T)} ${pt(0, D, -T)}`;
  return `
    <polygon points="${right}" fill="url(#${id}-side-r)"/>
    <polygon points="${front}" fill="url(#${id}-side-f)"/>
    <line x1="${P(0, D, -T)[0]}" y1="${P(0, D, -T)[1]}" x2="${P(W, D, -T)[0]}" y2="${P(W, D, -T)[1]}" stroke="#01549D" stroke-width="1" opacity="0.8"/>
    <line x1="${P(W, 0, -T)[0]}" y1="${P(W, 0, -T)[1]}" x2="${P(W, D, -T)[0]}" y2="${P(W, D, -T)[1]}" stroke="#01549D" stroke-width="1" opacity="0.6"/>
    <polygon points="${top}" fill="url(#${id}-top)"/>
    <polygon points="${top}" fill="none" stroke="#7FB0DC" stroke-width="1" opacity="0.9"/>`;
}

/** Groupe de marquages : dessiné en 2D plan, projeté par matrice iso */
function floorGroup(inner) {
  // (x,y) plan -> (A·x − A·y , B·x + B·y)
  return `<g transform="matrix(${A},${B},${-A},${B},0,0)">${inner}</g>`;
}

function courtMarkings(W, D, opts = {}) {
  const m = 6; // marge périmètre
  let s = `<rect x="${m}" y="${m}" width="${W - m * 2}" height="${D - m * 2}" rx="3"
             fill="none" stroke="#FFFFFF" stroke-width="1.6" opacity="0.65"/>`;
  if (opts.centerCircle) {
    s += `<circle cx="${W / 2}" cy="${D / 2}" r="${opts.centerCircle}" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity="0.55"/>
          <circle cx="${W / 2}" cy="${D / 2}" r="1.8" fill="#FFFFFF" opacity="0.7"/>`;
  }
  if (opts.midLine) {
    s += `<line x1="${opts.midLine}" y1="${m}" x2="${opts.midLine}" y2="${D - m}" stroke="#FFFFFF" stroke-width="1.5" opacity="0.5" stroke-dasharray="7 5"/>`;
  }
  if (opts.zoneRects) {
    opts.zoneRects.forEach(([x, y, w, h]) => {
      s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#FFFFFF" stroke-width="1.2" opacity="0.4" rx="2"/>`;
    });
  }
  if (opts.ladder) s += floorLadder(...opts.ladder);
  if (opts.dots) {
    opts.dots.forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="2.2" fill="none" stroke="#FFFFFF" stroke-width="1.1" opacity="0.45"/>`; });
  }
  return s;
}

/* --------------------------------------------------------------------------
   Modèles
   -------------------------------------------------------------------------- */

const MODELS = {
  compact: (id) => {
    const W = 92, D = 82, T = 9;
    let eq = '';
    eq += pullupRig(16, 14, 1, 0, 3, [30, 24], 22);            // rig 2 barres au fond
    eq += bench(66, 22, 13, 9, 6);                              // box plyo
    eq += parallelBars(20, 52, 30, 9, 13);                      // barres parallèles
    eq += bench(64, 56, 18, 8, 5);                              // banc
    const markings = courtMarkings(W, D, {
      centerCircle: 13,
      ladder: [40, 14, 14, 4, 7],
      dots: [[74, 44], [80, 50]]
    });
    return { W, D, T, eq, markings };
  },

  signature: (id) => {
    const W = 142, D = 102, T = 10;
    let eq = '';
    eq += pullupRig(18, 14, 1, 0, 4, [34, 27, 22], 24);         // rig 3 hauteurs
    eq += gantry(112, 16, 130, 40, 36);                         // portique + anneaux
    eq += bench(96, 60, 14, 10, 7);                             // box plyo
    eq += parallelBars(24, 62, 36, 10, 14);                     // barres parallèles
    eq += bench(118, 74, 20, 8, 5);                             // banc
    eq += bench(70, 80, 20, 8, 5);                              // banc 2
    const markings = courtMarkings(W, D, {
      centerCircle: 17,
      midLine: 88,
      ladder: [96, 22, 16, 5, 7.5],
      zoneRects: [[18, 56, 50, 22]],
      dots: [[122, 60], [128, 66], [116, 66]]
    });
    return { W, D, T, eq, markings };
  },

  arena: (id) => {
    const W = 200, D = 122, T = 11;
    let eq = '';
    eq += bleachers(112, 6, 80, 11, 2);                          // gradins bas au fond
    eq += pullupRig(16, 16, 1, 0, 5, [36, 29, 23, 29], 22);      // grand rig
    eq += gantry(160, 52, 184, 74, 38);                          // portique + anneaux
    eq += bench(128, 52, 15, 10, 7);                             // box plyo
    eq += parallelBars(24, 66, 40, 10, 14);                      // barres parallèles
    eq += bench(84, 92, 22, 8, 5);                               // bancs
    eq += bench(120, 98, 22, 8, 5);
    eq += bench(156, 104, 15, 10, 7);
    const markings = courtMarkings(W, D, {
      centerCircle: 19,
      midLine: 104,
      ladder: [120, 26, 18, 6, 8],
      zoneRects: [[16, 60, 56, 24], [150, 88, 40, 22]],
      dots: [[96, 70], [104, 76], [96, 82]]
    });
    return { W, D, T, eq, markings };
  }
};

/* --------------------------------------------------------------------------
   Assemblage
   -------------------------------------------------------------------------- */

let seq = 0;

/**
 * Construit le SVG complet d'un plateau.
 * @param {('compact'|'signature'|'arena')} model
 * @returns {string} markup SVG inline
 */
export function plateauSVG(model = 'signature') {
  const id = `pl${model}${seq++}`;
  const { W, D, T, eq, markings } = MODELS[model](id);

  // bornes projetées
  const xs = [P(0, 0), P(W, 0), P(W, D), P(0, D)];
  const minX = Math.min(...xs.map(p => p[0])) - 26;
  const maxX = Math.max(...xs.map(p => p[0])) + 26;
  const minY = -46;                                   // marge pour les agrès hauts
  const maxY = Math.max(...xs.map(p => p[1])) + T + 44; // marge pour le halo
  const vbW = maxX - minX, vbH = maxY - minY;

  const [hx, hy] = P(W / 2, D / 2, -T);
  const topClip = `${pt(0, 0)} ${pt(W, 0)} ${pt(W, D)} ${pt(0, D)}`;

  return `
<svg class="plateau-svg" viewBox="${minX.toFixed(0)} ${minY.toFixed(0)} ${vbW.toFixed(0)} ${vbH.toFixed(0)}"
     xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="Plateau sportif AirFit modèle ${model}, vue en perspective : dalle avec marquages au sol, structure street-workout, agrès et bancs">
  <defs>
    <linearGradient id="${id}-top" x1="0" y1="0" x2="0.25" y2="1">
      <stop offset="0" stop-color="#2E6DA9"/>
      <stop offset="0.45" stop-color="#0F4079"/>
      <stop offset="1" stop-color="#092D5B"/>
    </linearGradient>
    <linearGradient id="${id}-side-r" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#04214A"/>
      <stop offset="1" stop-color="#001231"/>
    </linearGradient>
    <linearGradient id="${id}-side-f" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#062A58"/>
      <stop offset="1" stop-color="#011637"/>
    </linearGradient>
    <linearGradient id="GRAD-post" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F4F6F8"/>
      <stop offset="1" stop-color="#9BB9D6"/>
    </linearGradient>
    <linearGradient id="GRAD-bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#C9D9EA"/>
      <stop offset="0.5" stop-color="#F4F6F8"/>
      <stop offset="1" stop-color="#C9D9EA"/>
    </linearGradient>
    <linearGradient id="GRAD-benchtop" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4C86BE"/>
      <stop offset="1" stop-color="#0E3A73" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="${id}-halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#01549D" stop-opacity="0.95"/>
      <stop offset="0.55" stop-color="#01549D" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#01549D" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}-halo2" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#7FB0DC" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#01549D" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${id}-sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="${id}-topclip"><polygon points="${topClip}"/></clipPath>
    <clipPath id="${id}-body"><rect x="${minX}" y="${minY}" width="${vbW}" height="${vbH - 30}"/></clipPath>
  </defs>

  <!-- Halo lumineux sous le plateau -->
  <g class="plateau-halo">
    <ellipse cx="${hx}" cy="${hy + 16}" rx="${vbW * 0.46}" ry="${vbW * 0.115}" fill="url(#${id}-halo)"/>
    <ellipse cx="${hx}" cy="${hy + 10}" rx="${vbW * 0.26}" ry="${vbW * 0.05}" fill="url(#${id}-halo2)"/>
  </g>

  <g class="plateau-body">
    ${slab(W, D, T, id)}
    <g clip-path="url(#${id}-topclip)">${floorGroup(markings)}</g>
    ${eq}
    <!-- Reflet balayant la structure -->
    <g clip-path="url(#${id}-body)">
      <rect class="plateau-sheen" x="${minX - vbW}" y="${minY}" width="${vbW * 0.55}" height="${vbH}"
            fill="url(#${id}-sheen)" transform="skewX(-18)"/>
    </g>
  </g>
</svg>`;
}
