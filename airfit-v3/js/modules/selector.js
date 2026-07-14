/* ============================================================
   SÉLECTEUR DE PLATEAUX — section signature
   Pin desktop + scrub 01→03, segmenté, drag, clavier, tactile,
   toggle vue produit / vue installée, hotspots.
   ============================================================ */
import { PLATFORMS } from './data.js';
import { buildPlatform } from './platform.js';

const PLUS_SVG = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 1v10M1 6h10"/></svg>';

export function initSelector(ctx) {
  const section = document.getElementById('plateaux');
  const stage = document.getElementById('stage');
  const segBtns = [...document.querySelectorAll('#seg button')];
  const viewBtns = [...document.querySelectorAll('#view-toggle button')];
  const counterCur = document.getElementById('counter-cur');
  const ticks = [...document.getElementById('counter-ticks').children];
  const infoFields = document.getElementById('info-fields');
  const F = {
    name: document.getElementById('p-name'),
    tag: document.getElementById('p-tag'),
    surface: document.getElementById('p-surface'),
    users: document.getElementById('p-users'),
    practices: document.getElementById('p-practices'),
  };

  let current = -1;
  let view = 'product';
  let pinST = null;

  /* ---------------- construction d'une couche plateau ---------------- */
  function hotspotsHTML(hs) {
    return '<div class="hotspots">' + hs.map(h => `
      <button type="button" class="hotspot" style="left:${h.left}%;top:${h.top}%"
              aria-expanded="false" aria-label="Zone : ${h.label}">
        ${PLUS_SVG}
        <span class="hs-tip${h.top < 32 ? ' flip' : ''}" role="tooltip"><strong>${h.label}</strong><span>${h.desc}</span></span>
      </button>`).join('') + '</div>';
  }

  function buildLayer(i) {
    const model = PLATFORMS[i];
    const installed = view === 'installed';
    const { svg, hotspots } = buildPlatform(model, {
      installed,
      withDims: !installed,
      idPrefix: `sel-${model.id}-${installed ? 'in' : 'pr'}-${Date.now() % 10000}`,
    });
    const layer = document.createElement('div');
    layer.className = 'stage-platform';
    layer.innerHTML = svg + hotspotsHTML(hotspots);
    return layer;
  }

  function animateDims(layer) {
    const dims = layer.querySelectorAll('.dim');
    const texts = layer.querySelectorAll('.dim-t, .dim-dot');
    if (!ctx.motionOK || !dims.length) return;
    gsap.fromTo(dims, { strokeDasharray: 1, strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 0.85, stagger: 0.045, ease: 'power2.inOut', delay: 0.35 });
    gsap.fromTo(texts, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.05, delay: 0.9 });
  }

  function updateInfo(i, animate) {
    const m = PLATFORMS[i];
    counterCur.textContent = m.index;
    ticks.forEach((t, k) => t.classList.toggle('on', k === i));
    F.name.textContent = m.name;
    F.tag.textContent = m.tagline;
    F.surface.textContent = m.surface;
    F.users.textContent = m.users;
    F.practices.innerHTML = m.practices.map(p => `<span>${p}</span>`).join('');
    section.dataset.model = m.id;
    segBtns.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    if (animate && ctx.motionOK) {
      gsap.fromTo(counterCur, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out' });
      gsap.fromTo(infoFields.children, { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.06, ease: 'power3.out' });
    }
  }

  /* ---------------- changement de modèle ---------------- */
  function setModel(i, dir = 1, instant = false) {
    if (i === current) return;
    const old = stage.querySelector('.stage-platform');
    const layer = buildLayer(i);
    stage.appendChild(layer);
    const first = current === -1;
    current = i;
    updateInfo(i, !instant && !first);

    if (!ctx.motionOK || instant) {
      if (old) old.remove();
      return;
    }
    gsap.fromTo(layer,
      { autoAlpha: 0, x: 110 * dir, scale: 0.9, transformOrigin: '50% 55%' },
      { autoAlpha: 1, x: 0, scale: 1, duration: 0.85, ease: 'power3.out' });
    animateDims(layer);
    if (old) {
      gsap.killTweensOf(old);
      gsap.to(old, {
        autoAlpha: 0, x: -130 * dir, scale: 0.92, duration: 0.45, ease: 'power2.in',
        onComplete: () => old.remove(),
      });
    }
  }

  /* sélection (contrôles) : sur desktop épinglé, on pilote via le scroll */
  function select(i, viaScroll = false) {
    i = Math.max(0, Math.min(PLATFORMS.length - 1, i));
    if (i === current) return;
    const dir = i > current ? 1 : -1;
    if (!viaScroll && pinST && pinST.isActive !== undefined) {
      const target = pinST.start + ((pinST.end - pinST.start) * i) / (PLATFORMS.length - 1);
      ctx.scrollTo(target, { duration: 0.8 });
      // le onUpdate du pin déclenchera setModel ; on force au cas où
      setModel(i, dir);
    } else {
      setModel(i, dir);
    }
  }

  /* ---------------- pin + scrub desktop ---------------- */
  if (ctx.motionOK) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      pinST = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=220%',
        pin: '#selector-pin',
        snap: { snapTo: [0, 0.5, 1], duration: 0.4, delay: 0.05, ease: 'power2.out' },
        onUpdate(self) {
          const idx = Math.round(self.progress * (PLATFORMS.length - 1));
          if (idx !== current) setModel(idx, idx > current ? 1 : -1);
        },
      });
      return () => { pinST = null; };
    });

    /* reveal d'entrée de section */
    gsap.from('.selector-head > *', {
      y: 34, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 72%', once: true },
    });
    gsap.from('#stage-info', {
      y: 40, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 62%', once: true },
    });
  }

  /* ---------------- contrôles ---------------- */
  segBtns.forEach(b => b.addEventListener('click', () => select(+b.dataset.i)));
  document.getElementById('model-prev').addEventListener('click', () => select(current - 1));
  document.getElementById('model-next').addEventListener('click', () => select(current + 1));

  const keyNav = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); select(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); select(current + 1); }
  };
  stage.addEventListener('keydown', keyNav);
  document.getElementById('seg').addEventListener('keydown', keyNav);

  /* drag horizontal / tactile */
  let dragX = null, dragY = null, dragged = false;
  stage.addEventListener('pointerdown', (e) => { dragX = e.clientX; dragY = e.clientY; dragged = false; });
  stage.addEventListener('pointermove', (e) => {
    if (dragX === null || dragged) return;
    const dx = e.clientX - dragX, dy = e.clientY - dragY;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      dragged = true;
      select(current + (dx < 0 ? 1 : -1));
    }
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev =>
    stage.addEventListener(ev, () => { dragX = null; }));

  /* toggle vue produit / vue installée */
  viewBtns.forEach(b => b.addEventListener('click', () => {
    if (b.dataset.view === view) return;
    view = b.dataset.view;
    viewBtns.forEach(x => x.setAttribute('aria-pressed', String(x.dataset.view === view)));
    const old = stage.querySelector('.stage-platform');
    const layer = buildLayer(current);
    stage.appendChild(layer);
    if (!ctx.motionOK) { if (old) old.remove(); return; }
    gsap.fromTo(layer, { autoAlpha: 0, scale: 0.965 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power2.out' });
    animateDims(layer);
    if (old) gsap.to(old, { autoAlpha: 0, scale: 1.03, duration: 0.4, ease: 'power2.in', onComplete: () => old.remove() });
  }));

  /* hotspots (délégation) */
  stage.addEventListener('click', (e) => {
    const hs = e.target.closest('.hotspot');
    if (!hs) return;
    const open = hs.getAttribute('aria-expanded') === 'true';
    stage.querySelectorAll('.hotspot[aria-expanded="true"]').forEach(x => x.setAttribute('aria-expanded', 'false'));
    hs.setAttribute('aria-expanded', String(!open));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      stage.querySelectorAll('.hotspot[aria-expanded="true"]').forEach(x => x.setAttribute('aria-expanded', 'false'));
    }
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.stage')) {
      stage.querySelectorAll('.hotspot[aria-expanded="true"]').forEach(x => x.setAttribute('aria-expanded', 'false'));
    }
  });

  /* état initial */
  setModel(0, 1, true);
}
