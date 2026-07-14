/* ==========================================================================
   AirFit — Hero : séquence d'arrivée cinématographique + comportement scroll
   ========================================================================== */

import { plateauSVG } from './plateau.js';
import { MOTION, sweepSheen } from './motion.js';

export function initHero() {
  const heroPlateau = document.getElementById('heroPlateau');
  heroPlateau.innerHTML = plateauSVG('signature');
  const svg = heroPlateau.querySelector('svg');

  if (!MOTION) return; // contenu visible d'office, aucune animation

  /* ---------- Séquence d'arrivée ---------- */
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-bg', { opacity: 0, duration: 1.1, ease: 'power1.out' }, 0)
    .from('.hero-beam', { opacity: 0, duration: 1.6, ease: 'power1.inOut' }, 0.25)
    // la lumière se dessine derrière le plateau
    .from('.hero-light', { opacity: 0, scale: 0.55, duration: 1.5, ease: 'power2.out' }, 0.35)
    // le plateau arrive avec profondeur, puis très léger zoom
    .from(heroPlateau, { y: 110, scale: 0.82, opacity: 0, duration: 1.5, ease: 'power3.out' }, 0.55)
    .to(heroPlateau, { scale: 1.02, duration: 2.6, ease: 'sine.inOut' }, 2.0)
    // textes ligne par ligne
    .from('.hero-title .line-in', { yPercent: 112, duration: 0.9, stagger: 0.14 }, 1.15)
    .from('.hero-sub', { y: 26, opacity: 0, duration: 0.8 }, 1.55)
    .from('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.7, stagger: 0.09 }, 1.75)
    .from('.hero-mention', { opacity: 0, duration: 0.8 }, 2.0)
    .from('.hero-trust', { opacity: 0, y: 12, duration: 0.7 }, 2.1)
    .from('.hero-scroll', { opacity: 0, duration: 0.9 }, 2.3)
    // le reflet traverse la structure
    .add(() => sweepSheen(svg, { duration: 1.8 }), 1.9);

  /* Reflet périodique discret */
  gsap.delayedCall(9, function loop() {
    sweepSheen(svg, { duration: 2.2 });
    gsap.delayedCall(9, loop);
  });

  /* ---------- Au scroll : le plateau avance, le titre s'efface ---------- */
  gsap.timeline({
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6
    }
  })
    .to(heroPlateau, { y: '16vh', scale: 1.14, rotation: -2.4, ease: 'none' }, 0)
    .to('.hero-light', { y: '10vh', opacity: 0.5, ease: 'none' }, 0)
    .to('.hero-title', { scale: 0.9, opacity: 0.12, y: '-6vh', ease: 'none' }, 0)
    .to('.hero-sub, .hero-ctas, .hero-mention', { opacity: 0, y: '-4vh', ease: 'none' }, 0)
    .to('.hero-scroll, .hero-trust', { opacity: 0, ease: 'none' }, 0)
    // remise du plateau vers le sélecteur : il plonge et s'efface au tout dernier moment
    .to(heroPlateau, { opacity: 0, y: '30vh', scale: 1.05, ease: 'power1.in', duration: 0.32 }, 0.68);
}
