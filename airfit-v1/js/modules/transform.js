/* ==========================================================================
   AirFit — « D'un espace vide à un lieu de vie » : comparateur avant/après
   Slider interactif (pointeur + clavier), 5 phases révélées progressivement.
   ========================================================================== */

import { plateauSVG } from './plateau.js';
import { MOTION, sweepSheen } from './motion.js';

const PHASES = [
  { min: 0, label: 'Terrain vide' },
  { min: 20, label: 'Préparation' },
  { min: 40, label: 'Installation' },
  { min: 62, label: 'Plateau terminé' },
  { min: 82, label: 'Habitants' }
];

export function initTransform() {
  const root = document.getElementById('baRoot');
  const scene = document.getElementById('baSlider');
  const steps = [...document.querySelectorAll('#baSteps li')];
  document.getElementById('baPlateau').innerHTML = plateauSVG('signature');
  const svg = document.querySelector('#baPlateau svg');

  let value = 50;

  function phaseIndex(v) {
    let idx = 0;
    PHASES.forEach((p, i) => { if (v >= p.min) idx = i; });
    return idx;
  }

  function render() {
    scene.style.setProperty('--ba', `${value}%`);
    const idx = phaseIndex(value);
    root.dataset.phase = String(idx);
    scene.setAttribute('aria-valuenow', String(Math.round(value)));
    scene.setAttribute('aria-valuetext', PHASES[idx].label);
    steps.forEach((li, i) => li.classList.toggle('is-on', i === idx));
  }

  function setValue(v, animate = false) {
    const target = Math.max(0, Math.min(100, v));
    if (animate && MOTION) {
      gsap.to({ v: value }, {
        v: target, duration: 1.4, ease: 'power2.inOut',
        onUpdate() { value = this.targets()[0].v; render(); }
      });
    } else {
      value = target;
      render();
    }
  }

  /* ---------- Pointeur ---------- */
  let dragging = false;
  const fromEvent = (e) => {
    const r = scene.getBoundingClientRect();
    return ((e.clientX - r.left) / r.width) * 100;
  };
  scene.addEventListener('pointerdown', (e) => {
    dragging = true;
    scene.setPointerCapture(e.pointerId);
    setValue(fromEvent(e));
  });
  scene.addEventListener('pointermove', (e) => { if (dragging) setValue(fromEvent(e)); });
  const stop = () => { dragging = false; };
  scene.addEventListener('pointerup', stop);
  scene.addEventListener('pointercancel', stop);

  /* ---------- Clavier (role="slider") ---------- */
  scene.addEventListener('keydown', (e) => {
    const map = {
      ArrowRight: value + 4, ArrowUp: value + 4,
      ArrowLeft: value - 4, ArrowDown: value - 4,
      PageUp: value + 20, PageDown: value - 20,
      Home: 0, End: 100
    };
    if (e.key in map) { e.preventDefault(); setValue(map[e.key]); }
  });

  /* ---------- Entrée en scène : la transformation se joue toute seule ---------- */
  if (MOTION) {
    setValue(0);
    ScrollTrigger.create({
      trigger: scene,
      start: 'top 62%',
      once: true,
      onEnter() {
        setValue(88, true);
        sweepSheen(svg, { delay: 1.1, duration: 1.8 });
      }
    });
    gsap.from(scene, {
      y: 70, opacity: 0, duration: 1,
      scrollTrigger: { trigger: scene, start: 'top 82%', end: 'top 48%', scrub: 0.5 }
    });
  } else {
    render();
  }
}
