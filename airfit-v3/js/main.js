/* ============================================================
   AIRFIT V3 « SHOWROOM TECHNIQUE » — point d'entrée
   GSAP + ScrollTrigger + Lenis (vendorés, scripts classiques).
   ============================================================ */
import { initHero } from './modules/hero.js';
import { initSelector } from './modules/selector.js';
import { initCompare } from './modules/compare.js';
import { initSections } from './modules/sections.js';

const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (motionOK) document.documentElement.classList.add('motion-ok');

if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

/* ---- Lenis smooth scroll, synchronisé sur le ticker GSAP ---- */
let lenis = null;
if (motionOK && window.Lenis) {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

const ctx = {
  motionOK,
  lenis,
  scrollTo(target, opts = {}) {
    if (lenis) {
      lenis.scrollTo(target, { duration: 1, ...opts });
    } else {
      const top = typeof target === 'number'
        ? target
        : target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: motionOK ? 'smooth' : 'auto' });
    }
  },
};

/* ---- Nav : état scrollé ---- */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---- Ancres internes via Lenis ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    ctx.scrollTo(el, { duration: 1.2 });
  });
});

/* ---- Sections ---- */
initHero(ctx);
initSelector(ctx);
initCompare(ctx);
initSections(ctx);

/* Recalcule les déclencheurs quand les fontes sont prêtes */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
window.addEventListener('load', () => ScrollTrigger.refresh());
