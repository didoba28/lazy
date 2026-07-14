/* ==========================================================================
   AirFit — Réalisations : galerie premium.
   Desktop + motion : défilement horizontal pinné (scrub).
   Mobile / reduced-motion : défilement natif avec snap.
   Chaque carte embarque le SVG du plateau : la galerie reste belle
   même sans les photos (réseau bloqué -> onerror retire l'image).
   ========================================================================== */

import { REALISATIONS } from './data.js';
import { plateauSVG } from './plateau.js';
import { MOTION, sweepSheen } from './motion.js';

export function initGallery() {
  const section = document.querySelector('.real-section');
  const viewport = document.getElementById('realViewport');
  const track = document.getElementById('realTrack');

  /* ---------- Construction des cartes ---------- */
  REALISATIONS.forEach((r) => {
    const card = document.createElement('article');
    card.className = 'real-card';
    card.dataset.filter = r.filtre;
    card.innerHTML = `
      <div class="real-card-bg" aria-hidden="true"></div>
      <div class="real-card-plateau" aria-hidden="true">${plateauSVG(r.filtre)}</div>
      <div class="real-card-caption">
        <h3>${r.lieu}<small>${r.commune}</small></h3>
        <span class="real-card-type">Plateau ${r.type}</span>
      </div>`;
    const img = new Image();
    img.alt = `Plateau sportif AirFit ${r.type} — ${r.lieu}, ${r.commune}`;
    img.loading = 'lazy';
    img.addEventListener('error', () => img.remove());
    img.src = r.img;
    card.insertBefore(img, card.querySelector('.real-card-caption'));
    track.appendChild(card);
  });

  const cards = [...track.querySelectorAll('.real-card')];

  /* ---------- Filtres discrets ---------- */
  document.querySelectorAll('#realFilters .real-filter').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#realFilters .real-filter').forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      const f = btn.dataset.filter;
      cards.forEach((c) => c.classList.toggle('is-dim', f !== 'all' && c.dataset.filter !== f));
    });
  });

  /* ---------- Défilement horizontal pinné (desktop + motion) ---------- */
  if (MOTION) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      section.classList.add('is-pinned');
      const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => cards.forEach((c) => sweepSheen(c.querySelector('svg'), { duration: 2 }))
        }
      });
      return () => {
        section.classList.remove('is-pinned');
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: 'transform' });
      };
    });

    gsap.from('.real-head > *', {
      opacity: 0, y: 40, stagger: 0.1,
      scrollTrigger: { trigger: section, start: 'top 75%', end: 'top 45%', scrub: 0.5 }
    });
  }
}
