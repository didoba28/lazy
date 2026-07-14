/* ==========================================================================
   AirFit — Chiffres XXL : chaque chiffre occupe quasiment un écran,
   compteur animé en Barlow Semi Condensed.
   ========================================================================== */

import { CHIFFRES } from './data.js';
import { MOTION } from './motion.js';

export function initCounters() {
  const section = document.getElementById('chiffres');

  section.innerHTML = CHIFFRES.map((c) => `
    <div class="stat">
      <p class="stat-value" aria-label="${c.prefixe}${c.valeur}${c.suffixe} ${c.label}">
        <span aria-hidden="true">${c.prefixe}<span class="stat-num" data-target="${c.valeur}">${MOTION ? 0 : c.valeur}</span>${c.suffixe}</span>
      </p>
      <p class="stat-label">${c.label}</p>
      <p class="stat-detail">${c.detail}</p>
    </div>`).join('');

  if (!MOTION) return;

  section.querySelectorAll('.stat').forEach((stat) => {
    const num = stat.querySelector('.stat-num');
    const target = Number(num.dataset.target);
    const counter = { v: 0 };

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 62%',
      once: true,
      onEnter() {
        gsap.to(counter, {
          v: target,
          duration: Math.min(2.4, 1 + target / 300),
          ease: 'power2.out',
          onUpdate() { num.textContent = String(Math.round(counter.v)); }
        });
      }
    });

    gsap.fromTo(stat.querySelector('.stat-value'),
      { scale: 0.86, opacity: 0.25 },
      { scale: 1, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: stat, start: 'top 85%', end: 'center 52%', scrub: 0.5 } });
    gsap.from([stat.querySelector('.stat-label'), stat.querySelector('.stat-detail')], {
      opacity: 0, y: 26, stagger: 0.06,
      scrollTrigger: { trigger: stat, start: 'top 60%', end: 'top 34%', scrub: 0.5 }
    });
  });
}
