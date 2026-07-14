/* =============================================================
   AirFit — Générateur SVG du plateau sportif
   Projection quasi-isométrique programmatique.
   Deux thèmes : "dark" (hero, lignes claires + halo)
                 "light" (blueprint habillé sur blanc)
   Trois modèles : compact / signature / arena
   ============================================================= */

const C = 0.866; // cos(30°)
const S = 0.5;   // sin(30°)
const SQ2 = Math.SQRT2;

/* Projette un point 3D (unités "mètres") vers l'écran. */
function pr(x, y, z = 0, s = 1) {
  return [((x - y) * C * s), ((x + y) * S * s - z * s)];
}
function pt(x, y, z, s) {
  const [px, py] = pr(x, y, z, s);
  return `${px.toFixed(2)},${py.toFixed(2)}`;
}
function poly(pts, attrs) {
  return `<polygon points="${pts.join(' ')}" ${attrs}/>`;
}
function ln(a, b, attrs) {
  return `<line x1="${a[0].toFixed(2)}" y1="${a[1].toFixed(2)}" x2="${b[0].toFixed(2)}" y2="${b[1].toFixed(2)}" ${attrs}/>`;
}
/* Cercle au sol (plan) -> ellipse projetée */
function groundCircle(cx, cy, r, s, attrs) {
  const [px, py] = pr(cx, cy, 0, s);
  return `<ellipse cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" rx="${(r * C * SQ2 * s).toFixed(2)}" ry="${(r * S * SQ2 * s).toFixed(2)}" ${attrs}/>`;
}

/* ---------- Thèmes ---------------------------------------- */
function themeTokens(theme, uid) {
  if (theme === 'dark') {
    return {
      slabTop: `url(#${uid}-slabTop)`,
      slabSideR: 'rgba(1,32,72,0.92)',
      slabSideF: 'rgba(1,26,60,0.92)',
      slabEdge: 'rgba(160,196,231,0.55)',
      mark: 'rgba(229,230,233,0.5)',
      markStrong: 'rgba(229,230,233,0.85)',
      accent: '#7FB2E5',
      accentSoft: 'rgba(127,178,229,0.35)',
      zone: 'rgba(1,84,157,0.30)',
      zoneAlt: 'rgba(127,178,229,0.12)',
      steel: '#EAF2FA',
      steelDim: 'rgba(234,242,250,0.75)',
      steelDark: 'rgba(160,196,231,0.9)',
      seat: 'rgba(229,230,233,0.9)',
      seatSide: 'rgba(160,196,231,0.5)',
      glow: `filter="url(#${uid}-glow)"`,
      shadow: '',
      groundShadow: 'rgba(0,5,16,0.5)',
      haloShow: true,
    };
  }
  return {
    slabTop: `url(#${uid}-slabTopL)`,
    slabSideR: '#C9CFD9',
    slabSideF: '#B9C1CE',
    slabEdge: '#001231',
    mark: 'rgba(0,18,49,0.34)',
    markStrong: 'rgba(0,18,49,0.66)',
    accent: '#01549D',
    accentSoft: 'rgba(1,84,157,0.28)',
    zone: 'rgba(1,84,157,0.10)',
    zoneAlt: 'rgba(0,18,49,0.05)',
    steel: '#001231',
    steelDim: 'rgba(0,18,49,0.72)',
    steelDark: '#01549D',
    seat: '#E5E6E9',
    seatSide: '#9AA3B2',
    glow: '',
    shadow: `filter="url(#${uid}-soft)"`,
    groundShadow: 'rgba(0,18,49,0.16)',
    haloShow: false,
  };
}

/* ---------- Defs (dégradés + filtres) ---------------------- */
function defs(uid, theme) {
  if (theme === 'dark') {
    return `<defs>
      <linearGradient id="${uid}-slabTop" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0A3D75"/>
        <stop offset="0.55" stop-color="#042B58"/>
        <stop offset="1" stop-color="#011E42"/>
      </linearGradient>
      <radialGradient id="${uid}-halo" cx="0.5" cy="0.42" r="0.55">
        <stop offset="0" stop-color="#2E7BC4" stop-opacity="0.5"/>
        <stop offset="0.55" stop-color="#01549D" stop-opacity="0.18"/>
        <stop offset="1" stop-color="#01549D" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${uid}-sheen" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
        <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.55"/>
        <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
      </linearGradient>
      <filter id="${uid}-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2.6" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="${uid}-blurBig" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="18"/>
      </filter>
    </defs>`;
  }
  return `<defs>
    <linearGradient id="${uid}-slabTopL" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F7F8FA"/>
      <stop offset="0.6" stop-color="#EEF0F3"/>
      <stop offset="1" stop-color="#E5E6E9"/>
    </linearGradient>
    <filter id="${uid}-soft" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#001231" flood-opacity="0.18"/>
    </filter>
    <filter id="${uid}-blurBig" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
  </defs>`;
}

/* ---------- Briques 3D ------------------------------------- */

/* Dalle : plateau extrudé, faces visibles avant + droite */
function slab(w, d, t, s, T) {
  const top = [pt(0, 0, 0, s), pt(w, 0, 0, s), pt(w, d, 0, s), pt(0, d, 0, s)];
  const front = [pt(0, d, 0, s), pt(w, d, 0, s), pt(w, d, -t, s), pt(0, d, -t, s)];
  const right = [pt(w, 0, 0, s), pt(w, d, 0, s), pt(w, d, -t, s), pt(w, 0, -t, s)];
  return (
    poly(top, `fill="${T.slabTop}" stroke="${T.slabEdge}" stroke-width="1.4" stroke-linejoin="round"`) +
    poly(front, `fill="${T.slabSideF}" stroke="${T.slabEdge}" stroke-width="1" stroke-linejoin="round"`) +
    poly(right, `fill="${T.slabSideR}" stroke="${T.slabEdge}" stroke-width="1" stroke-linejoin="round"`)
  );
}

/* Poteau vertical avec épaisseur écran et chapeau */
function post(x, y, h, s, T, wpx = 3.4) {
  const [bx, by] = pr(x, y, 0, s);
  const [tx, ty] = pr(x, y, h, s);
  const hw = wpx / 2;
  return (
    `<polygon points="${bx - hw},${by} ${bx + hw},${by} ${tx + hw},${ty} ${tx - hw},${ty}" fill="${T.steel}" ${T.glow}/>` +
    `<line x1="${bx - hw + 0.9}" y1="${by - 1}" x2="${tx - hw + 0.9}" y2="${ty + 1}" stroke="${T.steelDark}" stroke-width="0.8" opacity="0.8"/>` +
    `<ellipse cx="${tx}" cy="${ty}" rx="${hw + 0.4}" ry="${(hw + 0.4) * 0.5}" fill="${T.steel}"/>`
  );
}

/* Barre entre deux points 3D */
function bar(a, b, s, T, w = 2.6, color = null) {
  return ln(pr(...a, s), pr(...b, s), `stroke="${color || T.steel}" stroke-width="${w}" stroke-linecap="round" ${T.glow}`);
}

/* Petite embase au pied d'un poteau */
function footing(x, y, s, T) {
  const [px, py] = pr(x, y, 0, s);
  return `<ellipse cx="${px}" cy="${py}" rx="4.6" ry="2.3" fill="none" stroke="${T.mark}" stroke-width="1"/>`;
}

/* Portique de traction : poteaux + barres à plusieurs hauteurs */
function pullUpRig(x, y, len, s, T) {
  let g = '';
  const heights = [2.6, 2.15, 1.7];
  const seg = len / (heights.length);
  // poteaux
  for (let i = 0; i <= heights.length; i++) g += footing(x + i * seg, y, s, T);
  for (let i = 0; i <= heights.length; i++) {
    const h = Math.max(heights[Math.min(i, heights.length - 1)], heights[Math.max(0, i - 1)]);
    g += post(x + i * seg, y, h, s, T);
  }
  // barres de traction (accent sur la plus haute)
  heights.forEach((h, i) => {
    const col = i === 0 ? T.accent : null;
    g += bar([x + i * seg, y, h], [x + (i + 1) * seg, y, h], s, T, 2.6, col);
  });
  return g;
}

/* Échelle horizontale (monkey bars) le long de x */
function monkeyBars(x, y, len, depth, h, s, T) {
  let g = footing(x, y, s, T) + footing(x + len, y, s, T) + footing(x, y + depth, s, T) + footing(x + len, y + depth, s, T);
  g += post(x, y, h, s, T) + post(x + len, y, h, s, T) + post(x, y + depth, h, s, T) + post(x + len, y + depth, h, s, T);
  // rails
  g += bar([x, y, h], [x + len, y, h], s, T, 2.2);
  g += bar([x, y + depth, h], [x + len, y + depth, h], s, T, 2.2);
  // barreaux
  const n = Math.round(len / 0.55);
  for (let i = 1; i < n; i++) {
    const xx = x + (len * i) / n;
    g += bar([xx, y, h], [xx, y + depth, h], s, T, 1.5);
  }
  return g;
}

/* Anneaux suspendus sous une barre haute */
function rings(x, y, len, h, s, T) {
  let g = footing(x, y, s, T) + footing(x + len, y, s, T);
  g += post(x, y, h, s, T) + post(x + len, y, h, s, T);
  g += bar([x, y, h], [x + len, y, h], s, T, 2.4);
  [0.36, 0.64].forEach((f) => {
    const rx = x + len * f;
    const topP = pr(rx, y, h, s);
    const lowP = pr(rx, y, h - 0.55, s);
    g += ln(topP, lowP, `stroke="${T.steelDim}" stroke-width="1.2"`);
    g += `<circle cx="${lowP[0]}" cy="${lowP[1] + 4}" r="4.4" fill="none" stroke="${T.accent}" stroke-width="2" ${T.glow}/>`;
  });
  return g;
}

/* Barres parallèles basses (dips) */
function parallelBars(x, y, len, gap, h, s, T) {
  let g = '';
  [0, gap].forEach((dy) => {
    g += footing(x, y + dy, s, T) + footing(x + len, y + dy, s, T);
    g += post(x, y + dy, h, s, T, 2.6) + post(x + len, y + dy, h, s, T, 2.6);
    g += bar([x, y + dy, h], [x + len, y + dy, h], s, T, 2.4);
  });
  return g;
}

/* Poutre basse / banc de step */
function bench(x, y, len, depth, h, s, T) {
  const top = [pt(x, y, h, s), pt(x + len, y, h, s), pt(x + len, y + depth, h, s), pt(x, y + depth, h, s)];
  const front = [pt(x, y + depth, h, s), pt(x + len, y + depth, h, s), pt(x + len, y + depth, 0, s), pt(x, y + depth, 0, s)];
  const right = [pt(x + len, y, h, s), pt(x + len, y + depth, h, s), pt(x + len, y + depth, 0, s), pt(x + len, y, 0, s)];
  return (
    poly(front, `fill="${T.seatSide}"`) +
    poly(right, `fill="${T.seatSide}" opacity="0.75"`) +
    poly(top, `fill="${T.seat}" stroke="${T.slabEdge}" stroke-width="0.8" stroke-linejoin="round"`)
  );
}

/* Gradins bas : marches successives posées sur la dalle,
   la plus haute au fond (y le plus petit), descendant vers l'avant. */
function bleachers(x, y, len, steps, s, T) {
  let g = '';
  for (let i = 0; i < steps; i++) {
    g += bench(x, y + i * 0.95, len, 0.95, 0.4 * (steps - i), s, T);
  }
  return g;
}

/* Marquages au sol d'une zone : contour inset + couloirs */
function markings(w, d, s, T, opts = {}) {
  let g = '';
  const m = 0.7;
  g += poly([pt(m, m, 0.02, s), pt(w - m, m, 0.02, s), pt(w - m, d - m, 0.02, s), pt(m, d - m, 0.02, s)],
    `fill="none" stroke="${T.markStrong}" stroke-width="1.6" stroke-linejoin="round"`);
  if (opts.circle) {
    g += groundCircle(opts.circle[0], opts.circle[1], opts.circle[2], s,
      `fill="${T.zone}" stroke="${T.accent}" stroke-width="1.8"`);
    g += groundCircle(opts.circle[0], opts.circle[1], opts.circle[2] * 0.45, s,
      `fill="none" stroke="${T.mark}" stroke-width="1.1"`);
  }
  if (opts.lanes) {
    const [lx, ly, llen, n, lgap] = opts.lanes;
    for (let i = 0; i < n; i++) {
      g += ln(pr(lx, ly + i * lgap, 0.02, s), pr(lx + llen, ly + i * lgap, 0.02, s),
        `stroke="${T.mark}" stroke-width="1.2" stroke-dasharray="${i % 2 ? '5 6' : 'none'}"`);
    }
  }
  if (opts.zoneRect) {
    const [zx, zy, zw, zd] = opts.zoneRect;
    g += poly([pt(zx, zy, 0.015, s), pt(zx + zw, zy, 0.015, s), pt(zx + zw, zy + zd, 0.015, s), pt(zx, zy + zd, 0.015, s)],
      `fill="${T.zoneAlt}" stroke="${T.mark}" stroke-width="1.1"`);
  }
  if (opts.cross) {
    const [cx2, cy2] = opts.cross;
    g += ln(pr(cx2 - 0.5, cy2, 0.02, s), pr(cx2 + 0.5, cy2, 0.02, s), `stroke="${T.accent}" stroke-width="1.6"`);
    g += ln(pr(cx2, cy2 - 0.5, 0.02, s), pr(cx2, cy2 + 0.5, 0.02, s), `stroke="${T.accent}" stroke-width="1.6"`);
  }
  return g;
}

/* Ombre portée de la dalle au sol */
function groundShadow(w, d, s, uid, T) {
  const [cx, cy] = pr(w / 2, d / 2, 0, s);
  return `<ellipse cx="${cx}" cy="${cy + d * s * 0.36}" rx="${w * s * 0.78}" ry="${d * s * 0.34}" fill="${T.groundShadow}" filter="url(#${uid}-blurBig)"/>`;
}

/* ---------- Modèles ---------------------------------------- */
const MODELS = {
  compact: { w: 10, d: 9 },
  signature: { w: 14, d: 10 },
  arena: { w: 20, d: 10 },
};

function buildModel(model, s, T, uid) {
  const { w, d } = MODELS[model];
  let g = '';
  g += groundShadow(w, d, s, uid, T);
  g += slab(w, d, 0.55, s, T);

  if (model === 'compact') {
    g += markings(w, d, s, T, { circle: [3.1, 5.9, 1.7], zoneRect: [6.2, 5.4, 3.1, 2.8] });
    g += bench(6.6, 6.2, 2.2, 0.75, 0.42, s, T);
    g += parallelBars(1.4, 1.6, 2.6, 1.15, 1.25, s, T);
    g += pullUpRig(4.6, 1.4, 4.4, s, T);
  }

  if (model === 'signature') {
    g += markings(w, d, s, T, {
      circle: [3.4, 6.6, 1.9],
      lanes: [7.6, 5.6, 5.4, 3, 1.15],
      zoneRect: [7.2, 5.2, 5.6, 3.4],
    });
    g += bench(8.0, 8.55, 2.4, 0.75, 0.42, s, T);
    g += bench(11.2, 8.55, 2.4, 0.75, 0.42, s, T);
    g += parallelBars(1.3, 1.5, 2.8, 1.15, 1.25, s, T);
    g += rings(10.6, 1.2, 2.6, 2.75, s, T);
    g += monkeyBars(5.0, 1.15, 4.6, 1.25, 2.35, s, T);
    g += pullUpRig(0.9, 4.5, 4.2, s, T);
  }

  if (model === 'arena') {
    g += markings(w, d, s, T, {
      circle: [4.2, 6.4, 2.1],
      lanes: [8.6, 5.4, 7.2, 4, 1.1],
      zoneRect: [8.2, 5.0, 8.0, 4.0],
      cross: [17.6, 7.4],
    });
    // séparation des deux zones
    g += ln(pr(10, 0.7, 0.02, s), pr(10, d - 0.7, 0.02, s), `stroke="${T.accent}" stroke-width="1.6" stroke-dasharray="7 6"`);
    g += bleachers(11.8, 0.9, 6.4, 2, s, T);
    g += bench(1.2, 8.55, 2.4, 0.75, 0.42, s, T);
    g += parallelBars(1.4, 1.6, 3.0, 1.15, 1.25, s, T);
    g += rings(15.6, 3.4, 2.7, 2.75, s, T);
    g += monkeyBars(5.6, 1.2, 5.0, 1.25, 2.35, s, T);
    g += pullUpRig(0.9, 4.6, 4.6, s, T);
    g += pullUpRig(11.4, 4.9, 4.4, s, T);
  }
  return g;
}

/* ---------- API -------------------------------------------- */
let UID = 0;

/**
 * Construit le SVG complet du plateau.
 * @param {('compact'|'signature'|'arena')} model
 * @param {('dark'|'light')} theme
 * @param {object} o  { width, height, label }
 */
export function plateauSVG(model, theme, o = {}) {
  const uid = `pl${++UID}`;
  const T = themeTokens(theme, uid);
  const { w, d } = MODELS[model];
  const s = o.scale || 46;

  // Étendue projetée pour cadrer le viewBox
  const corners = [pr(0, 0, 0, s), pr(w, 0, 0, s), pr(w, d, 0, s), pr(0, d, 0, s)];
  const xs = corners.map((p) => p[0]);
  const ys = corners.map((p) => p[1]);
  const minX = Math.min(...xs) - s * 1.6;
  const maxX = Math.max(...xs) + s * 1.6;
  const minY = Math.min(...ys) - s * 3.6; // place pour les structures + halo
  const maxY = Math.max(...ys) + s * 1.5;
  const vbW = maxX - minX;
  const vbH = maxY - minY;

  let inner = '';
  if (T.haloShow) {
    const [hx, hy] = pr(w / 2, d / 2, 1.2, s);
    inner += `<ellipse cx="${hx}" cy="${hy}" rx="${vbW * 0.52}" ry="${vbH * 0.5}" fill="url(#${uid}-halo)"/>`;
  }
  inner += `<g ${T.shadow ? '' : ''}>${buildModel(model, s, T, uid)}</g>`;
  if (theme === 'dark') {
    // bande de reflet animable (cachée par défaut, pilotée en JS)
    inner += `<rect class="sheen" x="${minX}" y="${minY}" width="${vbW * 0.16}" height="${vbH}" fill="url(#${uid}-sheen)" opacity="0" style="mix-blend-mode:overlay"/>`;
  }

  const label = o.label || `Plateau AirFit ${model.charAt(0).toUpperCase() + model.slice(1)} — vue en perspective`;
  return `<svg class="plateau-svg plateau-svg--${theme} plateau-svg--${model}" viewBox="${minX.toFixed(1)} ${minY.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">${defs(uid, theme)}${inner}</svg>`;
}

export const PLATEAU_MODELS = Object.keys(MODELS);
