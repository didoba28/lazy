/* Chapitre 07 — bandeau final sur dégradé signature. */
import { plateauSVG } from './plateau.js';

export function initCta(ctx) {
  const holder = document.getElementById('cta-plateau');
  if (holder) {
    holder.innerHTML = plateauSVG('arena', 'dark', { label: '' });
    const svg = holder.querySelector('svg');
    svg.removeAttribute('role');
    svg.removeAttribute('aria-label');
    svg.setAttribute('aria-hidden', 'true');
  }

  if (ctx.reduced) return;

  const items = ['.cta .chap', '.cta__title', '.cta .btn--xl'];
  gsap.set(items, { autoAlpha: 0, y: 40 });
  ScrollTrigger.create({
    trigger: '.cta',
    start: 'top 65%',
    once: true,
    onEnter: () => gsap.to(items, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.16, ease: 'power3.out' }),
  });

  if (holder) {
    gsap.fromTo(holder, { y: 90, rotation: 2 }, {
      y: -30, rotation: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
    });
  }
}
