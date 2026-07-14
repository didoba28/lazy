/* ==========================================================================
   AirFit — Variante « Monolithe » — point d'entrée
   GSAP / ScrollTrigger / Lenis sont chargés en globals (vendor/).
   ========================================================================== */

import { MOTION } from './modules/motion.js';
import { initHero } from './modules/hero.js';
import { initSelector } from './modules/selector.js';
import { initTransform } from './modules/transform.js';
import { initKeyturn } from './modules/timeline.js';
import { initCounters } from './modules/counters.js';
import { initGallery } from './modules/gallery.js';

gsap.registerPlugin(ScrollTrigger);

/* ---------- Smooth scroll (Lenis) synchronisé sur le ticker GSAP ---------- */
let lenis = null;
if (MOTION) {
  lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/** Défilement programmatique unifié (ancres, sélecteur). */
export function scrollToY(target, opts = {}) {
  if (lenis) lenis.scrollTo(target, { duration: 1.2, ...opts });
  else if (typeof target === 'number') window.scrollTo(0, target);
  else document.querySelector(target)?.scrollIntoView();
}

/* ---------- Ancres internes ---------- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const el = id.length > 1 && document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    scrollToY(el, { offset: id === '#plateaux' ? 2 : 0 });
  });
});

/* ---------- Nav : fond au scroll ---------- */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Sections ---------- */
initHero(scrollToY);
initSelector(scrollToY);
initTransform();
initKeyturn();
initCounters();
initGallery();

/* ---------- Reveals génériques + CTA final ---------- */
if (MOTION) {
  document.querySelectorAll('.transform-section .section-intro, .gens-section .section-intro').forEach((intro) => {
    gsap.from(intro.children, {
      opacity: 0, y: 44, stagger: 0.08,
      scrollTrigger: { trigger: intro, start: 'top 78%', end: 'top 44%', scrub: 0.5 }
    });
  });

  gsap.utils.toArray('.gens-tile').forEach((tile, i) => {
    gsap.from(tile, {
      opacity: 0, y: 60, scale: 0.97,
      scrollTrigger: { trigger: tile, start: 'top 88%', end: 'top 62%', scrub: 0.5 }
    });
  });

  // CTA cinématographique : la lumière monte, le titre se dévoile ligne par ligne
  gsap.from('.cta-light', {
    opacity: 0, scale: 0.5,
    scrollTrigger: { trigger: '.cta-section', start: 'top 75%', end: 'center center', scrub: 0.6 }
  });
  gsap.from('.cta-title .line-in', {
    yPercent: 112, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.cta-section', start: 'top 62%', end: 'top 20%', scrub: 0.6 }
  });
  gsap.from('.cta-inner .btn', {
    opacity: 0, y: 30,
    scrollTrigger: { trigger: '.cta-section', start: 'top 40%', end: 'top 12%', scrub: 0.6 }
  });
}

/* Recalage des triggers une fois les fonts chargées (hauteurs stables) */
if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
