/* ============================================================
   AVANT / APRÈS — slider clip-path avec règle graduée
   Drag + tactile + clavier (role=slider, aria-valuenow).
   ============================================================ */
import { PLATFORMS } from './data.js';
import { buildPlatform, buildEmptyLot } from './platform.js';

export function initCompare(ctx) {
  const model = PLATFORMS[1]; // Signature : le plateau « type »
  document.getElementById('pane-before').innerHTML =
    buildEmptyLot(model, { idPrefix: 'cmp-b' }).svg;
  document.getElementById('pane-after').innerHTML =
    buildPlatform(model, { installed: true, withDims: false, idPrefix: 'cmp-a' }).svg;

  const wrap = document.getElementById('compare');
  const handle = document.getElementById('compare-handle');
  const val = document.getElementById('compare-val');

  let pos = 50;
  function set(p) {
    pos = Math.max(0, Math.min(100, p));
    wrap.style.setProperty('--cut', pos + '%');
    const after = Math.round(100 - pos);
    handle.setAttribute('aria-valuenow', String(after));
    handle.setAttribute('aria-valuetext', `${after} % de la vue après visible`);
    val.textContent = `Après · ${after} %`;
  }
  set(50);

  /* pointeur */
  let dragging = false;
  const fromEvent = (e) => {
    const r = wrap.getBoundingClientRect();
    set(((e.clientX - r.left) / r.width) * 100);
  };
  wrap.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragging = true;
    wrap.setPointerCapture(e.pointerId);
    fromEvent(e);
  });
  wrap.addEventListener('pointermove', (e) => { if (dragging) fromEvent(e); });
  ['pointerup', 'pointercancel'].forEach(ev =>
    wrap.addEventListener(ev, () => { dragging = false; }));

  /* clavier */
  handle.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); set(pos - step); }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); set(pos + step); }
    if (e.key === 'Home') { e.preventDefault(); set(0); }
    if (e.key === 'End') { e.preventDefault(); set(100); }
  });

  /* intro : la règle balaye et révèle l'« après » */
  if (ctx.motionOK) {
    const proxy = { p: 96 };
    gsap.to(proxy, {
      p: 50, duration: 1.6, ease: 'power3.inOut',
      onUpdate: () => { if (!dragging) set(proxy.p); },
      scrollTrigger: { trigger: wrap, start: 'top 70%', once: true },
    });
    gsap.from(wrap, {
      y: 60, autoAlpha: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: wrap, start: 'top 80%', once: true },
    });
  }
}
