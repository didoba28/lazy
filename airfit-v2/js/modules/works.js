/* Chapitre 06 — réalisations : scroll horizontal pinné (desktop),
   snap natif (mobile), filtres typographiques. */
import { REALISATIONS } from './data.js';
import { plateauSVG } from './plateau.js';

const FALLBACK_VARIANTS = ['a', 'b', 'c'];

export function initWorks(ctx) {
  const section = document.querySelector('.works');
  const pin = document.getElementById('works-pin');
  const track = document.getElementById('works-track');
  if (!track) return;

  track.innerHTML = REALISATIONS.map((r, i) => {
    const num = String(i + 1).padStart(2, '0');
    const variant = FALLBACK_VARIANTS[i % FALLBACK_VARIANTS.length];
    return `
    <figure class="work" data-type="${r.type}">
      <div class="work__media">
        <div class="work__fallback work__fallback--${variant}" aria-hidden="true">
          ${plateauSVG(r.type, 'dark', { label: '' })}
          <span class="work__fallback-num">${num}</span>
        </div>
        <img src="${r.img}" alt="${r.lieu}, ${r.commune} — ${r.typeLabel}" loading="lazy"
             onerror="this.closest('.work').classList.add('img-failed')">
      </div>
      <figcaption class="work__caption">
        <span>
          <strong>${r.lieu}</strong>
          <span class="work__commune">${r.commune}</span>
        </span>
        <span class="work__type">${r.typeLabel}</span>
      </figcaption>
    </figure>`;
  }).join('');

  /* les SVG de fallback n'ont pas besoin d'un role img sans label */
  track.querySelectorAll('.work__fallback svg').forEach((s) => {
    s.removeAttribute('role');
    s.removeAttribute('aria-label');
    s.setAttribute('aria-hidden', 'true');
  });

  /* ---- Pin + défilement horizontal (desktop, motion ok) ---- */
  let horizST = null;
  if (ctx.desktop && !ctx.reduced) {
    section.classList.add('works--pinned');
    const tween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => '+=' + Math.max(400, track.scrollWidth - window.innerWidth),
        pin: true,
        anticipatePin: 1,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
    horizST = tween.scrollTrigger;
  }

  /* ---- Filtres ---- */
  const filters = document.querySelectorAll('.works__filter');
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      const f = btn.dataset.filter;
      track.querySelectorAll('.work').forEach((w) => {
        w.classList.toggle('is-hidden', f !== 'all' && w.dataset.type !== f);
      });
      if (horizST) {
        gsap.set(track, { x: 0 });
        ScrollTrigger.refresh();
      }
      if (!ctx.reduced) {
        gsap.fromTo(track.querySelectorAll('.work:not(.is-hidden)'),
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out' });
      }
    });
  });

  /* ---- Révélation d'entrée ---- */
  if (!ctx.reduced) {
    gsap.set(track.children, { autoAlpha: 0, y: 60 });
    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      once: true,
      onEnter: () => gsap.to(track.children, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }),
    });
  }
}
