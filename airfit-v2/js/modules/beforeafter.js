/* Chapitre 02 — comparateur avant / après (clip-path, drag + clavier). */
import { plateauSVG } from './plateau.js';

/* Scène « avant » : délaissé urbain, dalle nue, emprise en pointillés. */
function sceneBefore() {
  return `<svg viewBox="0 0 1600 840" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Espace urbain vide avant aménagement" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bf-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#F4F5F7"/><stop offset="1" stop-color="#E5E6E9"/>
      </linearGradient>
      <linearGradient id="bf-ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#D6D9DE"/><stop offset="1" stop-color="#C4C9D1"/>
      </linearGradient>
    </defs>
    <rect width="1600" height="840" fill="url(#bf-sky)"/>
    <rect y="330" width="1600" height="510" fill="url(#bf-ground)"/>
    <line x1="0" y1="330" x2="1600" y2="330" stroke="#AEB4BF" stroke-width="1.5"/>
    <!-- immeubles lointains, silhouettes grises -->
    <g fill="#CDD1D8">
      <rect x="60" y="216" width="150" height="114"/><rect x="238" y="252" width="96" height="78"/>
      <rect x="1250" y="234" width="130" height="96"/><rect x="1400" y="264" width="170" height="66"/>
    </g>
    <g fill="#BFC4CD">
      <rect x="90" y="240" width="18" height="20"/><rect x="126" y="240" width="18" height="20"/>
      <rect x="1280" y="256" width="16" height="18"/><rect x="1316" y="256" width="16" height="18"/>
    </g>
    <!-- dalle nue fissurée -->
    <polygon points="360,505 1240,505 1430,760 190,760" fill="#CBCFD6" stroke="#AEB4BF" stroke-width="2"/>
    <g stroke="#A8AEB9" stroke-width="2" fill="none" stroke-linecap="round">
      <path d="M520 585 l70 28 l-16 42 l58 30"/>
      <path d="M980 550 l-40 46 l52 34"/>
      <path d="M760 700 l88 12"/>
    </g>
    <!-- emprise du futur plateau -->
    <polygon points="560,540 1090,540 1210,712 440,712" fill="none" stroke="#01549D" stroke-width="2.5" stroke-dasharray="12 10" opacity="0.55"/>
    <text x="800" y="640" text-anchor="middle" font-family="Barlow, sans-serif" font-weight="600" font-size="26" letter-spacing="6" fill="#01549D" opacity="0.55">EMPRISE 140 M²</text>
    <!-- mobilier fatigué -->
    <g stroke="#9AA1AD" stroke-width="5" stroke-linecap="round">
      <line x1="285" y1="470" x2="285" y2="392"/><line x1="264" y1="392" x2="306" y2="392"/>
    </g>
    <g stroke="#9AA1AD" stroke-width="4" stroke-linecap="round">
      <line x1="1330" y1="600" x2="1408" y2="600"/><line x1="1340" y1="600" x2="1340" y2="626"/><line x1="1398" y1="600" x2="1398" y2="626"/>
    </g>
    <!-- arbres nus -->
    <g stroke="#AAB0BB" stroke-width="4" fill="none" stroke-linecap="round">
      <path d="M170 500 v-70 m0 28 l-26 -30 m26 8 l30 -34"/>
      <path d="M1490 540 v-84 m0 34 l-30 -36 m30 10 l34 -40"/>
    </g>
  </svg>`;
}

/* Scène « après » : même cadrage, ciel lumineux, vie autour du plateau. */
function sceneAfter() {
  return `<svg viewBox="0 0 1600 840" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Le même espace après installation du plateau AirFit" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="af-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCE9F5"/>
      </linearGradient>
      <linearGradient id="af-ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#EDF1F6"/><stop offset="1" stop-color="#DAE3EE"/>
      </linearGradient>
      <radialGradient id="af-glow" cx="0.5" cy="0.6" r="0.6">
        <stop offset="0" stop-color="#7FB2E5" stop-opacity="0.28"/><stop offset="1" stop-color="#7FB2E5" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1600" height="840" fill="url(#af-sky)"/>
    <rect y="330" width="1600" height="510" fill="url(#af-ground)"/>
    <line x1="0" y1="330" x2="1600" y2="330" stroke="#B9CBE0" stroke-width="1.5"/>
    <g fill="#C9D8EA">
      <rect x="60" y="216" width="150" height="114"/><rect x="238" y="252" width="96" height="78"/>
      <rect x="1250" y="234" width="130" height="96"/><rect x="1400" y="264" width="170" height="66"/>
    </g>
    <g fill="#01549D" opacity="0.35">
      <rect x="90" y="240" width="18" height="20"/><rect x="126" y="240" width="18" height="20"/>
      <rect x="1280" y="256" width="16" height="18"/><rect x="1316" y="256" width="16" height="18"/>
    </g>
    <ellipse cx="800" cy="640" rx="640" ry="220" fill="url(#af-glow)"/>
    <!-- parvis clair + cheminement -->
    <polygon points="330,498 1270,498 1470,772 160,772" fill="#E8EDF4" stroke="#B9CBE0" stroke-width="2"/>
    <path d="M60 806 C 380 740 520 700 690 668" fill="none" stroke="#01549D" stroke-width="4" opacity="0.35" stroke-dasharray="2 14" stroke-linecap="round"/>
    <!-- arbres feuillus stylisés -->
    <g>
      <line x1="170" y1="500" x2="170" y2="436" stroke="#01549D" stroke-width="5" stroke-linecap="round"/>
      <circle cx="170" cy="410" r="42" fill="#7FB2E5" opacity="0.5"/><circle cx="146" cy="428" r="26" fill="#7FB2E5" opacity="0.4"/>
      <line x1="1490" y1="540" x2="1490" y2="462" stroke="#01549D" stroke-width="5" stroke-linecap="round"/>
      <circle cx="1490" cy="430" r="50" fill="#7FB2E5" opacity="0.5"/><circle cx="1524" cy="456" r="28" fill="#7FB2E5" opacity="0.4"/>
    </g>
    <!-- banc neuf + lampadaire -->
    <g stroke="#01549D" stroke-width="5" stroke-linecap="round">
      <line x1="285" y1="470" x2="285" y2="386"/><line x1="262" y1="386" x2="308" y2="386"/>
    </g>
    <circle cx="285" cy="380" r="7" fill="#7FB2E5"/>
    <g stroke="#001231" stroke-width="4" stroke-linecap="round">
      <line x1="1330" y1="596" x2="1408" y2="596"/><line x1="1340" y1="596" x2="1340" y2="624"/><line x1="1398" y1="596" x2="1398" y2="624"/>
    </g>
  </svg>`;
}

export function initBeforeAfter(ctx) {
  const ba = document.getElementById('ba');
  const before = document.getElementById('ba-before');
  const after = document.getElementById('ba-after');
  const afterLayer = document.getElementById('ba-after-layer');
  const handle = document.getElementById('ba-handle');
  if (!ba) return;

  before.innerHTML = sceneBefore();
  after.innerHTML = sceneAfter();

  /* Le plateau, posé au centre de la scène « après » */
  const plateauWrap = document.createElement('div');
  plateauWrap.style.cssText = 'position:absolute;left:50%;top:58%;width:min(62%,760px);transform:translate(-50%,-50%);';
  plateauWrap.innerHTML = plateauSVG('signature', 'light', { label: 'Plateau Signature installé' });
  plateauWrap.querySelector('svg').style.cssText = 'width:100%;height:auto;display:block;';
  after.appendChild(plateauWrap);

  let pos = 50;
  function render() {
    afterLayer.style.clipPath = `inset(0 0 0 ${pos}%)`;
    handle.style.left = `${pos}%`;
    ba.setAttribute('aria-valuenow', String(Math.round(pos)));
    ba.setAttribute('aria-valuetext', `${Math.round(pos)} % après`);
  }
  function setPos(p) {
    pos = gsap.utils.clamp(0, 100, p);
    render();
  }
  function tweenPos(from, to, duration, delay = 0) {
    const proxy = { v: from };
    gsap.to(proxy, {
      v: to, duration, delay, ease: 'power3.inOut',
      onUpdate: () => setPos(proxy.v),
    });
  }
  render();

  /* Drag / tactile */
  let dragging = false;
  function posFromEvent(e) {
    const r = ba.getBoundingClientRect();
    return ((e.clientX - r.left) / r.width) * 100;
  }
  ba.addEventListener('pointerdown', (e) => {
    dragging = true;
    ba.setPointerCapture(e.pointerId);
    setPos(posFromEvent(e));
  });
  ba.addEventListener('pointermove', (e) => { if (dragging) setPos(posFromEvent(e)); });
  ba.addEventListener('pointerup', () => { dragging = false; });
  ba.addEventListener('pointercancel', () => { dragging = false; });

  /* Clavier */
  ba.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setPos(pos + 5); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setPos(pos - 5); }
    else if (e.key === 'Home') { e.preventDefault(); setPos(0); }
    else if (e.key === 'End') { e.preventDefault(); setPos(100); }
  });

  /* Révélation d'entrée : le rideau s'ouvre de 94 % à 50 % */
  if (!ctx.reduced) {
    setPos(94);
    ScrollTrigger.create({
      trigger: ba,
      start: 'top 72%',
      once: true,
      onEnter: () => tweenPos(94, 50, 1.6, 0.2),
    });
  }
}
