/* Chapitre 04 — mise en page magazine, photos + fallbacks élégants. */
import { USAGES } from './data.js';

export function initUsages(ctx) {
  const grid = document.getElementById('usages-grid');
  if (!grid) return;

  grid.innerHTML = USAGES.map((u, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `
    <figure class="usage">
      <div class="usage__media">
        <div class="usage__fallback" aria-hidden="true">
          <span class="usage__fallback-num">${num}</span>
          <span class="usage__fallback-titre">${u.titre}</span>
        </div>
        <img src="${u.img}" alt="${u.titre} — ${u.legende}" loading="lazy"
             onerror="this.closest('.usage').classList.add('img-failed')">
      </div>
      <figcaption class="usage__caption">
        <span class="usage__index">${num}</span>
        <span class="usage__caption-body">
          <strong>${u.titre}</strong>
          <span>${u.legende}</span>
        </span>
      </figcaption>
    </figure>`;
  }).join('');

  if (ctx.reduced) return;

  grid.querySelectorAll('.usage').forEach((fig, i) => {
    gsap.set(fig, { autoAlpha: 0, y: 60 });
    ScrollTrigger.create({
      trigger: fig,
      start: 'top 86%',
      once: true,
      onEnter: () => gsap.to(fig, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: (i % 2) * 0.08 }),
    });

    /* parallaxe douce sur desktop */
    if (ctx.desktop) {
      const media = fig.querySelector('.usage__media');
      gsap.fromTo(media, { y: 24 }, {
        y: -24,
        ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      });
    }
  });
}
