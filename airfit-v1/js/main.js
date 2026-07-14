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

/* Recalage des triggers une fois les fonts chargées (hauteurs stables) */
if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
