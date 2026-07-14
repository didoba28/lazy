/* ============================================================
   SECTIONS — timeline, usages, chiffres XXL, réalisations, CTA
   ============================================================ */
import { TIMELINE, USAGES, PROJECTS } from './data.js';

/* utilitaire : image avec repli dégradé si le réseau est bloqué */
function guardImage(img, onFail) {
  const fail = () => onFail(img);
  img.addEventListener('error', fail, { once: true });
  if (img.complete && img.naturalWidth === 0) fail();
}

/* ---------------- 5 · Timeline clé en main ---------------- */
function initTimeline(ctx) {
  const tl = document.getElementById('tl');
  tl.insertAdjacentHTML('beforeend', TIMELINE.map(s => `
    <div class="tl-step">
      <span class="tl-node" aria-hidden="true"></span>
      <div class="tl-num" aria-hidden="true">${s.n}</div>
      <div class="tl-body">
        <span class="tl-kicker">Étape ${s.n} / 06</span>
        <h3>${s.t}</h3>
        <p>${s.d}</p>
      </div>
    </div>`).join(''));

  const steps = tl.querySelectorAll('.tl-step');
  if (!ctx.motionOK) {
    steps.forEach(s => s.classList.add('is-active'));
    return;
  }
  gsap.fromTo('#tl-fill', { scaleY: 0 }, {
    scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: tl, start: 'top 72%', end: 'bottom 45%', scrub: 0.6 },
  });
  steps.forEach(step => {
    ScrollTrigger.create({ trigger: step, start: 'top 64%', end: 'bottom 28%', toggleClass: 'is-active' });
    gsap.from(step.querySelector('.tl-body'), {
      y: 40, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: step, start: 'top 76%', once: true },
    });
    gsap.from(step.querySelector('.tl-num'), {
      y: 26, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: step, start: 'top 76%', once: true },
    });
  });
}

/* ---------------- 6 · Usages ---------------- */
function initUsages(ctx) {
  const flow = document.getElementById('usage-flow');
  flow.insertAdjacentHTML('beforeend', USAGES.map(u => `
    <article class="usage-card">
      <img src="${u.img}" alt="${u.t} sur un plateau AirFit — ${u.d}" loading="lazy">
      <div class="usage-body">
        <span class="usage-age">${u.label}</span>
        <h3>${u.t}</h3>
        <p>${u.d}</p>
      </div>
    </article>`).join(''));

  flow.querySelectorAll('img').forEach(img =>
    guardImage(img, (el) => { el.closest('.usage-card').classList.add('no-img'); el.remove(); }));

  if (ctx.motionOK) {
    gsap.from(flow.children, {
      y: 60, autoAlpha: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out',
      scrollTrigger: { trigger: flow, start: 'top 80%', once: true },
    });
  }
}

/* ---------------- 7 · Chiffres XXL (odomètres) ---------------- */
function initFigures(ctx) {
  document.querySelectorAll('.odo').forEach(el => {
    const target = String(el.dataset.odo);
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', el.getAttribute('aria-label') || target);
    el.textContent = '';
    const cols = [...target].map(ch => {
      const digit = document.createElement('span');
      digit.className = 'odo-digit';
      digit.setAttribute('aria-hidden', 'true');
      const strip = document.createElement('span');
      strip.className = 'odo-strip';
      for (let n = 0; n <= 9; n++) {
        const s = document.createElement('span');
        s.textContent = String(n);
        strip.appendChild(s);
      }
      digit.appendChild(strip);
      el.appendChild(digit);
      return { strip, n: +ch };
    });

    if (!ctx.motionOK) {
      cols.forEach(({ strip, n }) => { strip.style.transform = `translateY(${-n * 10}%)`; });
      return;
    }
    gsap.set(cols.map(c => c.strip), { yPercent: 0 });
    ScrollTrigger.create({
      trigger: el.closest('.figure-panel'),
      start: 'top 55%',
      once: true,
      onEnter: () => cols.forEach(({ strip, n }, i) =>
        gsap.to(strip, { yPercent: -n * 10, duration: 1.7 + i * 0.12, ease: 'power4.inOut', delay: i * 0.06 })),
    });
  });

  if (ctx.motionOK) {
    document.querySelectorAll('.figure-panel').forEach(panel => {
      gsap.from(panel.querySelectorAll('.figure-label, .figure-value, .figure-caption'), {
        y: 44, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: panel, start: 'top 62%', once: true },
      });
    });
  }
}

/* ---------------- 8 · Réalisations ---------------- */
function initWorks(ctx) {
  const track = document.getElementById('works-track');
  const viewport = document.getElementById('works-viewport');
  const fill = document.getElementById('works-progress-fill');

  track.insertAdjacentHTML('beforeend', PROJECTS.map(p => `
    <article class="work-panel" data-type="${p.type}">
      <div class="work-media">
        <span class="work-ghost" aria-hidden="true">${p.city}</span>
        <img src="${p.img}" alt="Plateau ${p.typeName} installé à ${p.city} — ${p.place}" loading="lazy">
      </div>
      <div class="work-fiche">
        <h3>${p.city}<span class="place">${p.place} · Commune de ${p.city}</span></h3>
        <div class="work-specs">
          <span>Modèle<b>${p.typeName}</b></span>
          <span>Surface<b>${p.area}</b></span>
          <span>Année<b>${p.year}</b></span>
        </div>
      </div>
    </article>`).join(''));

  track.querySelectorAll('img').forEach(img => guardImage(img, (el) => el.remove()));

  /* filtres */
  const filterBtns = [...document.querySelectorAll('#works-filters button')];
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    const f = btn.dataset.f;
    track.querySelectorAll('.work-panel').forEach(panel =>
      panel.classList.toggle('is-dim', f !== 'all' && panel.dataset.type !== f));
  }));

  /* défilement horizontal épinglé (desktop, motion OK) */
  if (ctx.motionOK) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: '#realisations',
          start: 'top top',
          end: () => '+=' + dist(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => { fill.style.transform = `scaleX(${self.progress})`; },
        },
      });
      return () => { tween.scrollTrigger && tween.scrollTrigger.kill(); tween.kill(); gsap.set(track, { x: 0 }); };
    });
  } else {
    viewport.classList.add('no-pin');
  }
}

/* ---------------- 9 · CTA final ---------------- */
function initCta(ctx) {
  if (!ctx.motionOK) return;
  gsap.from('#cta-inner > *', {
    y: 52, autoAlpha: 0, duration: 1.1, stagger: 0.14, ease: 'power3.out',
    scrollTrigger: { trigger: '#contact', start: 'top 62%', once: true },
  });
  gsap.fromTo('.cta-halo', { scale: 0.5, autoAlpha: 0 }, {
    scale: 1, autoAlpha: 1, duration: 1.8, ease: 'power2.out',
    scrollTrigger: { trigger: '#contact', start: 'top 70%', once: true },
  });
}

/* ---------------- reveals génériques ---------------- */
function initReveals(ctx) {
  if (!ctx.motionOK) return;
  document.querySelectorAll('.compare-section .section-head, .process .section-head, .usages .section-head, .works-head-inner').forEach(head => {
    gsap.from(head.children, {
      y: 34, autoAlpha: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out',
      scrollTrigger: { trigger: head, start: 'top 78%', once: true },
    });
  });
}

export function initSections(ctx) {
  initTimeline(ctx);
  initUsages(ctx);
  initFigures(ctx);
  initWorks(ctx);
  initCta(ctx);
  initReveals(ctx);
}
