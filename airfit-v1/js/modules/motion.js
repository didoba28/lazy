/* ==========================================================================
   AirFit — Préférences de mouvement + utilitaires partagés
   ========================================================================== */

export const MOTION = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Balaye le reflet (.plateau-sheen) d'un SVG plateau, de gauche à droite. */
export function sweepSheen(svgEl, { duration = 1.6, delay = 0 } = {}) {
  if (!MOTION || !svgEl) return;
  const sheen = svgEl.querySelector('.plateau-sheen');
  if (!sheen) return;
  const vb = svgEl.viewBox.baseVal;
  gsap.fromTo(sheen,
    { attr: { x: vb.x - vb.width * 0.7 } },
    { attr: { x: vb.x + vb.width * 1.25 }, duration, delay, ease: 'power2.inOut' });
}
