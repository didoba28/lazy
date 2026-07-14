/* Hero : plateau SVG sombre, séquence d'arrivée, scrub au scroll,
   continuité hero → sélecteur. */
import { plateauSVG } from './plateau.js';

export function initHero(ctx) {
  const holder = document.getElementById('hero-plateau');
  const stage = document.querySelector('.hero__stage');
  const light = document.querySelector('.hero__light');
  if (!holder) return;

  holder.innerHTML = plateauSVG('signature', 'dark', {
    label: 'Plateau sportif AirFit Signature — structure street-workout en perspective',
  });
  const svg = holder.querySelector('svg');
  const sheen = svg.querySelector('.sheen');
  const vb = svg.viewBox.baseVal;

  if (ctx.reduced) {
    if (light) light.style.opacity = '1';
    return;
  }

  /* ---------- Séquence d'arrivée ---------- */
  const lines = document.querySelectorAll('.hero__line > span');
  const softItems = ['.hero__eyebrow', '.hero__sub', '.hero__ctas', '.hero__meta', '.hero__foot', '.nav'];

  gsap.set(lines, { yPercent: 115 });
  gsap.set(softItems, { autoAlpha: 0, y: 22 });
  gsap.set(holder, { xPercent: 26, y: 60, scale: 0.9, rotation: 2.5, autoAlpha: 0, transformOrigin: '50% 60%' });
  gsap.set(light, { opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl
    // 1. lumière derrière le plateau
    .to(light, { opacity: 1, duration: 1.4, ease: 'sine.out' }, 0.15)
    // 2. le plateau entre avec profondeur
    .to(holder, { xPercent: 0, y: 0, autoAlpha: 1, rotation: 0, duration: 1.5, ease: 'power3.out' }, 0.35)
    // 3. léger zoom d'assise
    .to(holder, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0.9)
    // 4. textes ligne par ligne
    .to(lines, { yPercent: 0, duration: 1.05, stagger: 0.14, ease: 'power4.out' }, 0.85)
    .to('.hero__eyebrow', { autoAlpha: 1, y: 0, duration: 0.8 }, 0.75)
    .to('.nav', { autoAlpha: 1, y: 0, duration: 0.8 }, 0.9)
    .to('.hero__sub', { autoAlpha: 1, y: 0, duration: 0.9 }, 1.35)
    .to('.hero__ctas', { autoAlpha: 1, y: 0, duration: 0.9 }, 1.55)
    .to('.hero__meta', { autoAlpha: 1, y: 0, duration: 0.9 }, 1.7)
    .to('.hero__foot', { autoAlpha: 1, y: 0, duration: 0.9 }, 1.85);

  // 5. reflet qui traverse la structure
  if (sheen) {
    tl.fromTo(
      sheen,
      { attr: { x: vb.x - vb.width * 0.2 }, opacity: 0.9 },
      { attr: { x: vb.x + vb.width * 1.1 }, opacity: 0.9, duration: 1.6, ease: 'power2.inOut' },
      1.6
    ).to(sheen, { opacity: 0, duration: 0.4 }, 3.0);
  }

  /* ---------- Scrub au scroll ---------- */
  // Le plateau avance légèrement, tourne de quelques degrés ; le titre se réduit.
  gsap.timeline({
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
    },
  })
    .to(stage, { y: '22vh', x: '-4vw', ease: 'none' }, 0)
    .to(holder, { rotation: -3.5, scale: 0.86, ease: 'none' }, 0)
    .to('.hero__copy', { scale: 0.92, autoAlpha: 0.25, y: '-6vh', transformOrigin: 'left top', ease: 'none' }, 0)
    .to('.hero__foot', { autoAlpha: 0, ease: 'none' }, 0)
    .to(light, { opacity: 0.25, ease: 'none' }, 0);
}
