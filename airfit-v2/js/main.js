/* AirFit V2 — Éditorial Lumière — point d'entrée */
import { initHero } from './modules/hero.js';
import { initSelector } from './modules/selector.js';
import { initBeforeAfter } from './modules/beforeafter.js';
import { initProcess } from './modules/process.js';
import { initUsages } from './modules/usages.js';
import { initFigures } from './modules/figures.js';
import { initWorks } from './modules/works.js';
import { initCta } from './modules/cta.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktop = window.matchMedia('(min-width: 900px)').matches;

gsap.registerPlugin(ScrollTrigger);

/* ---- Lenis (smooth scroll) synchronisé sur le ticker GSAP ---- */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

const ctx = {
  reduced,
  desktop,
  lenis,
  scrollTo(target, opts = {}) {
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.1, ...opts });
    } else {
      const y = typeof target === 'number'
        ? target
        : target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    }
  },
};

/* ---- Ancres internes ---- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    ctx.scrollTo(el);
  });
});

/* ---- Modules ---- */
initHero(ctx);
initSelector(ctx);
initBeforeAfter(ctx);
initProcess(ctx);
initUsages(ctx);
initFigures(ctx);
initWorks(ctx);
initCta(ctx);

/* ---- Reveals éditoriaux génériques ---- */
if (!reduced) {
  gsap.utils.toArray('.chap').forEach((el) => {
    const rule = el.querySelector('.chap__rule');
    if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.fromTo(el, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' });
        if (rule) gsap.to(rule, { scaleX: 1, duration: 1.2, ease: 'power3.inOut', delay: 0.15 });
      },
    });
  });

  gsap.utils.toArray('.section-title, .section-lede, .selector__title, .transfo__caption').forEach((el) => {
    gsap.set(el, { autoAlpha: 0, y: 36 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.to(el, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' }),
    });
  });
}

/* Après le chargement des fontes, recalcul des positions de pin */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
window.addEventListener('load', () => ScrollTrigger.refresh());
