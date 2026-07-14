/* ==========================================================================
   AirFit — « Une solution réellement clé en main » : timeline immersive
   sur respiration blanche. La ligne se dessine au scroll, chaque étape
   se révèle en grande typographie.
   ========================================================================== */

import { MOTION } from './motion.js';

export function initKeyturn() {
  if (!MOTION) return; // tout est visible d'office

  const fill = document.getElementById('keyturnFill');

  gsap.fromTo(fill, { scaleY: 0 }, {
    scaleY: 1, ease: 'none',
    scrollTrigger: {
      trigger: '#keyturn',
      start: 'top 68%',
      end: 'bottom 62%',
      scrub: 0.4
    }
  });

  document.querySelectorAll('.keyturn-step').forEach((step) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: step, start: 'top 80%', end: 'top 52%', scrub: 0.5 }
    });
    tl.from(step.querySelector('.keyturn-num'), { opacity: 0, y: 46, scale: 0.9 }, 0)
      .from(step.querySelector('.keyturn-body'), { opacity: 0, y: 40 }, 0.08);
  });

  gsap.from('.keyturn-section .section-intro > *', {
    opacity: 0, y: 40, stagger: 0.08,
    scrollTrigger: { trigger: '.keyturn-section', start: 'top 72%', end: 'top 40%', scrub: 0.5 }
  });
}
