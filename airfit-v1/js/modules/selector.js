/* ==========================================================================
   AirFit — Sélecteur de plateaux (section signature, sticky sur desktop)
   Compact -> Signature -> Arena : crescendo piloté par le scroll (desktop)
   et par clic / drag / clavier / tactile partout.
   ========================================================================== */

import { PLATEAUX } from './data.js';
import { plateauSVG } from './plateau.js';
import { MOTION, sweepSheen } from './motion.js';

export function initSelector(scrollToY) {
  const section = document.querySelector('.selector-section');
  const sticky = document.querySelector('.selector-sticky');
  const stage = document.getElementById('selectorStage');
  const slots = [...section.querySelectorAll('.selector-plateau')];
  const tabs = [...section.querySelectorAll('.selector-tab')];
  const tablist = document.getElementById('selectorTabs');
  const ink = document.getElementById('selectorInk');
  const glow = document.getElementById('selectorGlow');
  const info = document.getElementById('selectorInfo');
  const els = {
    name: document.getElementById('selName'),
    desc: document.getElementById('selDesc'),
    tags: document.getElementById('selTags'),
    surface: document.getElementById('selSurface'),
    capacite: document.getElementById('selCapacite'),
    num: document.getElementById('selNum')
  };

  slots.forEach((slot, i) => { slot.innerHTML = plateauSVG(PLATEAUX[i].id); });

  let current = 0;
  let pinned = false;
  let pinST = null;

  /* ---------- Rendu des infos ---------- */
  function renderInfo(d) {
    els.name.textContent = d.nom;
    els.desc.textContent = d.accroche;
    els.surface.textContent = d.surface;
    els.capacite.textContent = d.capacite;
    els.num.textContent = d.numero;
    els.tags.innerHTML = d.pratiques.map((p) => `<li>${p}</li>`).join('');
  }

  function placeInk() {
    const t = tabs[current];
    ink.style.width = `${t.offsetWidth}px`;
    ink.style.transform = `translateX(${t.offsetLeft}px)`;
  }

  /* ---------- Changement de modèle ---------- */
  function setModel(i, dirHint) {
    if (i === current || i < 0 || i > 2) return;
    const dir = dirHint ?? (i > current ? 1 : -1);
    const prev = current;
    current = i;
    const d = PLATEAUX[i];
    tabs.forEach((t, j) => t.setAttribute('aria-selected', String(j === i)));
    placeInk();

    const oldEl = slots[prev];
    const newEl = slots[i];

    if (!MOTION) {
      oldEl.classList.remove('is-active');
      newEl.classList.add('is-active');
      renderInfo(d);
      return;
    }

    gsap.killTweensOf([oldEl, newEl]);
    // l'ancien sort avec profondeur
    gsap.to(oldEl, {
      autoAlpha: 0, x: -120 * dir, scale: 0.88, duration: 0.45, ease: 'power2.in',
      onComplete() { oldEl.classList.remove('is-active'); gsap.set(oldEl, { clearProps: 'all' }); }
    });
    // le nouveau entre
    newEl.classList.add('is-active');
    gsap.fromTo(newEl,
      { autoAlpha: 0, x: 150 * dir, scale: 0.9 },
      { autoAlpha: 1, x: 0, scale: 1, duration: 0.8, delay: 0.16, ease: 'power3.out',
        onComplete() { gsap.set(newEl, { clearProps: 'x,scale' }); } });
    sweepSheen(newEl.querySelector('svg'), { delay: 0.75, duration: 1.5 });

    // l'éclairage et la nuance de fond évoluent
    gsap.to(sticky, { backgroundColor: d.fond, duration: 1.0, ease: 'power1.inOut' });
    gsap.to(glow, { opacity: d.lumiere, duration: 1.0 });

    // infos avec animation
    gsap.to(info, {
      opacity: 0, y: 12, duration: 0.2, ease: 'power1.in',
      onComplete() {
        renderInfo(d);
        gsap.fromTo(info, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
      }
    });
  }

  /* Demande de modèle : en mode pinné on pilote via le scroll (source de vérité) */
  function requestModel(i, dirHint) {
    if (i < 0 || i > 2 || i === current) return;
    if (pinned && pinST) {
      const y = pinST.start + (pinST.end - pinST.start) * ((i + 0.55) / 3);
      scrollToY(y, { duration: 0.9 });
    } else {
      setModel(i, dirHint);
    }
  }

  /* ---------- Interactions ---------- */
  tabs.forEach((t, i) => t.addEventListener('click', () => requestModel(i)));

  tablist.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); requestModel(Math.min(2, current + 1), 1); tabs[Math.min(2, current)].focus(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); requestModel(Math.max(0, current - 1), -1); tabs[Math.max(0, current)].focus(); }
    if (e.key === 'Home') { e.preventDefault(); requestModel(0, -1); }
    if (e.key === 'End') { e.preventDefault(); requestModel(2, 1); }
  });

  // drag horizontal / tactile sur la scène
  let dragX = null;
  stage.addEventListener('pointerdown', (e) => { dragX = e.clientX; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove', (e) => {
    if (dragX === null || !MOTION) return;
    const dx = e.clientX - dragX;
    gsap.set(slots[current], { x: dx * 0.25 });
  });
  const endDrag = (e) => {
    if (dragX === null) return;
    const dx = e.clientX - dragX;
    dragX = null;
    if (MOTION) gsap.to(slots[current], { x: 0, duration: 0.4, ease: 'power2.out' });
    if (Math.abs(dx) > 48) requestModel(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', () => { dragX = null; if (MOTION) gsap.to(slots[current], { x: 0, duration: 0.3 }); });

  /* ---------- Pilotage par le scroll (desktop + motion) ---------- */
  if (MOTION) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      pinned = true;
      pinST = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate(self) {
          const idx = Math.min(2, Math.floor(self.progress * 2.9999));
          setModel(idx);
        }
      });
      return () => { pinned = false; pinST = null; };
    });

    /* Arrivée de la section : continuité avec le plateau du hero */
    gsap.from(stage, {
      y: -60, scale: 0.94, opacity: 0,
      scrollTrigger: { trigger: section, start: 'top 72%', end: 'top 18%', scrub: 0.5 }
    });
    gsap.from('.selector-head', {
      y: 50, opacity: 0,
      scrollTrigger: { trigger: section, start: 'top 78%', end: 'top 34%', scrub: 0.5 }
    });
  }

  /* ---------- État initial ---------- */
  renderInfo(PLATEAUX[0]);
  gsap.set(glow, { opacity: PLATEAUX[0].lumiere });
  if (document.fonts?.ready) document.fonts.ready.then(placeInk);
  window.addEventListener('resize', placeInk);
  placeInk();
}
