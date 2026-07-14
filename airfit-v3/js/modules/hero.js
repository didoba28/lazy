/* ============================================================
   HERO — séquence d'arrivée + liaison scroll vers le sélecteur
   ============================================================ */
import { PLATFORMS } from './data.js';
import { buildPlatform } from './platform.js';

export function initHero(ctx) {
  const holder = document.getElementById('hero-platform');
  // Compact = modèle 01 : celui qui « descend » vers le sélecteur (continuité)
  const { svg } = buildPlatform(PLATFORMS[0], { withDims: true, idPrefix: 'hero' });
  holder.innerHTML = svg;

  const dims = holder.querySelectorAll('.dim');
  const dimTexts = holder.querySelectorAll('.dim-t, .dim-dot');
  const sheen = holder.querySelector('.sheen');

  if (!ctx.motionOK) return;

  const lines = document.querySelectorAll('#hero-title .line > span');
  gsap.set(lines, { yPercent: 112 });
  gsap.set(['.hero-kicker', '.hero-sub', '.hero-ctas', '.hero-meta'], { autoAlpha: 0, y: 26 });
  gsap.set(dims, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(dimTexts, { autoAlpha: 0 });
  gsap.set(holder, { autoAlpha: 0, y: 110, scale: 0.82, transformOrigin: '50% 60%' });
  gsap.set('#hero-halo', { autoAlpha: 0, scale: 0.7, transformOrigin: '60% 40%' });
  gsap.set('#hero-scroll', { autoAlpha: 0 });

  /* ---- Séquence d'arrivée : fond -> lumière -> plateau -> textes -> cotes -> reflet ---- */
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('#hero-halo', { autoAlpha: 1, scale: 1, duration: 1.5, ease: 'power2.out' }, 0.15)
    .to(holder, { autoAlpha: 1, y: 0, duration: 1.5 }, 0.4)
    .to(holder, { scale: 1, duration: 1.7, ease: 'power2.inOut' }, 0.55)
    .to('.hero-kicker', { autoAlpha: 1, y: 0, duration: 0.7 }, 0.95)
    .to(lines, { yPercent: 0, duration: 0.95, stagger: 0.13, ease: 'power4.out' }, 1.05)
    .to('.hero-sub', { autoAlpha: 1, y: 0, duration: 0.8 }, 1.4)
    .to('.hero-ctas', { autoAlpha: 1, y: 0, duration: 0.8 }, 1.55)
    .to('.hero-meta', { autoAlpha: 1, y: 0, duration: 0.8 }, 1.7)
    .to(dims, { strokeDashoffset: 0, duration: 0.9, stagger: 0.05, ease: 'power2.inOut' }, 1.55)
    .to(dimTexts, { autoAlpha: 1, duration: 0.5, stagger: 0.06 }, 2.05)
    .to('#hero-scroll', { autoAlpha: 1, duration: 0.8 }, 2.5);

  /* reflet qui traverse la structure */
  if (sheen) {
    const bw = sheen.getBBox().width;
    tl.set(sheen, { autoAlpha: 1, x: -bw }, 2.15)
      .to(sheen, { x: bw, duration: 1.5, ease: 'power2.inOut' }, 2.15)
      .set(sheen, { autoAlpha: 0 }, 3.65);
  }

  /* ---- Au scroll : le plateau avance/descend, le titre se réduit ---- */
  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
  })
    .to(holder, { y: '32vh', scale: 0.9, rotation: -2.6, duration: 1 }, 0)
    .to(holder, { autoAlpha: 0, duration: 0.4 }, 0.6)
    .to('#hero-copy', { y: -70, scale: 0.93, autoAlpha: 0, transformOrigin: '0% 0%', duration: 1 }, 0)
    .to('#hero-halo', { y: '24vh', autoAlpha: 0.25, duration: 1 }, 0)
    .to('#hero-scroll', { autoAlpha: 0, duration: 0.25 }, 0);
}
