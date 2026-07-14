/* Sélecteur de plateaux — section signature.
   Pin sur plusieurs écrans (desktop), scrub → index,
   clic / drag / clavier / tactile, données centralisées. */
import { PLATEAUX } from './data.js';
import { plateauSVG } from './plateau.js';

export function initSelector(ctx) {
  const stage = document.getElementById('selector-stage');
  const viewport = document.getElementById('selector-viewport');
  const buttons = Array.from(document.querySelectorAll('.selector__name'));
  const info = document.getElementById('selector-info');
  const elPhrase = document.getElementById('sel-phrase');
  const elSurface = document.getElementById('sel-surface');
  const elUsers = document.getElementById('sel-users');
  const elTags = document.getElementById('sel-tags');
  const elCounter = document.getElementById('sel-counter');
  const elCta = document.getElementById('sel-cta');
  if (!stage || !viewport) return;

  /* ---- Slides ---- */
  const slides = PLATEAUX.map((p, i) => {
    const d = document.createElement('div');
    d.className = 'plateau-slide' + (i === 0 ? ' is-current' : '');
    d.innerHTML = plateauSVG(p.id, 'light', { label: `Plateau ${p.name} — ${p.surface}, ${p.users.toLowerCase()}` });
    viewport.appendChild(d);
    return d;
  });

  let index = 0;
  let animating = false;
  applyInfo(0);

  function applyInfo(i) {
    const p = PLATEAUX[i];
    elPhrase.textContent = p.phrase;
    elSurface.textContent = p.surface;
    elUsers.textContent = p.users;
    elTags.innerHTML = p.pratiques.map((t) => `<li>${t}</li>`).join('');
    elCounter.textContent = p.num;
    elCta.setAttribute('aria-label', `Découvrir le plateau ${p.name}`);
    buttons.forEach((b, bi) => {
      b.classList.toggle('is-active', bi === i);
      b.setAttribute('aria-pressed', String(bi === i));
    });
    viewport.setAttribute('aria-valuenow', String(i + 1));
    viewport.setAttribute('aria-valuetext', p.name);
  }

  function setIndex(next, dir) {
    next = gsap.utils.clamp(0, PLATEAUX.length - 1, next);
    if (next === index) return;
    const prev = index;
    index = next;
    const d = dir !== undefined ? dir : (next > prev ? 1 : -1);

    if (ctx.reduced) {
      slides[prev].classList.remove('is-current');
      slides[next].classList.add('is-current');
      applyInfo(next);
      return;
    }

    /* transition avec profondeur */
    const out = slides[prev];
    const inn = slides[next];
    inn.classList.add('is-current');
    gsap.killTweensOf([out, inn]);
    gsap.set(inn, { autoAlpha: 0, xPercent: 14 * d, scale: 1.08, rotation: 1.4 * d, transformOrigin: '50% 55%' });
    gsap.timeline()
      .to(out, {
        autoAlpha: 0, xPercent: -12 * d, scale: 0.94, rotation: -1.2 * d, duration: 0.55, ease: 'power2.in',
        onComplete: () => { out.classList.remove('is-current'); gsap.set(out, { xPercent: 0, scale: 1, rotation: 0 }); },
      }, 0)
      .to(inn, { autoAlpha: 1, xPercent: 0, scale: 1, rotation: 0, duration: 0.85, ease: 'power3.out' }, 0.22);

    /* infos : sortie / mise à jour / entrée */
    gsap.killTweensOf(info);
    gsap.timeline()
      .to(info, { autoAlpha: 0, y: 14, duration: 0.22, ease: 'power2.in', onComplete: () => applyInfo(next) })
      .to(info, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' });

    /* compteur */
    gsap.fromTo(elCounter, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out', delay: 0.2 });
  }

  /* ---- Pin desktop : la section reste, le scroll fait défiler les modèles ---- */
  let pinST = null;
  if (ctx.desktop && !ctx.reduced) {
    pinST = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: '+=210%',
      pin: true,
      anticipatePin: 1,
      onUpdate(self) {
        const i = Math.min(PLATEAUX.length - 1, Math.floor(self.progress * PLATEAUX.length * 0.999));
        setIndex(i);
      },
    });
  }

  /* Aller à un index : via le scroll si la section est pinée, sinon direct */
  function goTo(i) {
    i = gsap.utils.clamp(0, PLATEAUX.length - 1, i);
    if (pinST) {
      const p = (i + 0.5) / PLATEAUX.length;
      ctx.scrollTo(pinST.start + p * (pinST.end - pinST.start), { duration: 0.9 });
    } else {
      setIndex(i);
    }
  }

  /* ---- Clic ---- */
  buttons.forEach((b) => b.addEventListener('click', () => goTo(Number(b.dataset.index))));

  /* ---- Clavier ---- */
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goTo(index + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goTo(index - 1); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(PLATEAUX.length - 1); }
  });

  /* ---- Drag horizontal / tactile ---- */
  let dragX = null;
  let dragUsed = false;
  viewport.addEventListener('pointerdown', (e) => { dragX = e.clientX; dragUsed = false; });
  viewport.addEventListener('pointermove', (e) => {
    if (dragX === null || dragUsed) return;
    const dx = e.clientX - dragX;
    if (Math.abs(dx) > 48) {
      dragUsed = true;
      goTo(index + (dx < 0 ? 1 : -1));
    }
  });
  const endDrag = () => { dragX = null; };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('pointerleave', endDrag);

  /* ---- Entrée de la section : continuité avec le hero ----
     Le plateau du sélecteur arrive d'en haut, comme si celui du hero
     descendait se poser sur le blanc. */
  if (!ctx.reduced) {
    gsap.set(viewport, { autoAlpha: 0, y: -70, scale: 1.06, transformOrigin: '50% 30%' });
    ScrollTrigger.create({
      trigger: stage,
      start: 'top 78%',
      once: true,
      onEnter: () => gsap.to(viewport, { autoAlpha: 1, y: 0, scale: 1, duration: 1.3, ease: 'power3.out' }),
    });
    gsap.set('.selector__list li', { autoAlpha: 0, x: -40 });
    ScrollTrigger.create({
      trigger: stage,
      start: 'top 72%',
      once: true,
      onEnter: () => gsap.to('.selector__list li', { autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }),
    });
  }
}
