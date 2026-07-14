/* Chapitre 03 — timeline éditoriale : ligne qui se dessine au scroll. */
import { ETAPES } from './data.js';

export function initProcess(ctx) {
  const wrap = document.getElementById('process-timeline');
  if (!wrap) return;
  const list = wrap.querySelector('.process__steps');

  list.innerHTML = ETAPES.map((s) => `
    <li class="process__step">
      <span class="process__dot" aria-hidden="true"></span>
      <span class="process__num" aria-hidden="true">${s.num}</span>
      <div class="process__body">
        <h3 class="process__titre">${s.titre}</h3>
        <p class="process__texte">${s.texte}</p>
      </div>
    </li>`).join('');

  if (ctx.reduced) {
    wrap.querySelector('.process__line-fill').style.transform = 'scaleY(1)';
    wrap.querySelectorAll('.process__step').forEach((s) => s.classList.add('is-passed'));
    return;
  }

  /* la ligne fine se dessine au fil du scroll */
  gsap.to('.process__line-fill', {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: wrap,
      start: 'top 62%',
      end: 'bottom 55%',
      scrub: 0.5,
    },
  });

  /* chaque étape se révèle et s'allume */
  wrap.querySelectorAll('.process__step').forEach((step) => {
    gsap.set(step, { autoAlpha: 0, y: 46 });
    ScrollTrigger.create({
      trigger: step,
      start: 'top 82%',
      once: true,
      onEnter: () => gsap.to(step, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' }),
    });
    ScrollTrigger.create({
      trigger: step,
      start: 'top 58%',
      onEnter: () => step.classList.add('is-passed'),
      onLeaveBack: () => step.classList.remove('is-passed'),
    });
  });
}
