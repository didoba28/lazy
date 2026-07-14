/* Chapitre 05 — chiffres XXL, compteurs animés. */
import { CHIFFRES } from './data.js';

export function initFigures(ctx) {
  const list = document.getElementById('figures-list');
  if (!list) return;

  list.innerHTML = CHIFFRES.map((c) => `
    <div class="figure">
      <div class="figure__inner container">
        <p class="figure__value" aria-label="${c.prefixe}${c.valeur}${c.suffixe} ${c.label}">
          <span class="figure__affix">${c.prefixe}</span><span class="figure__count" data-value="${c.valeur}">${ctx.reduced ? c.valeur : 0}</span><span class="figure__affix">${c.suffixe}</span>
        </p>
        <div class="figure__side">
          <span class="figure__label">${c.label}</span>
          <p class="figure__texte">${c.texte}</p>
        </div>
      </div>
    </div>`).join('');

  if (ctx.reduced) return;

  list.querySelectorAll('.figure').forEach((fig) => {
    const count = fig.querySelector('.figure__count');
    const target = Number(count.dataset.value);
    gsap.set(fig.querySelector('.figure__inner'), { autoAlpha: 0, y: 50 });
    ScrollTrigger.create({
      trigger: fig,
      start: 'top 68%',
      once: true,
      onEnter: () => {
        gsap.to(fig.querySelector('.figure__inner'), { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' });
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: target,
          duration: Math.min(2.2, 0.9 + target / 400),
          ease: 'power2.out',
          onUpdate: () => { count.textContent = String(Math.round(proxy.v)); },
        });
      },
    });
  });
}
