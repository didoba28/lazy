/* Micro-interactions : nav intelligente, ancres douces, boutons magnétiques,
   tilt 3D des cartes, slider avant/après, filtres de réalisations. */

export function initInteractions({ lenis, reduceMotion }) {
  smartNav();
  anchors(lenis);
  compareSlider();
  workFilters();

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!reduceMotion && finePointer) {
    magneticButtons();
    tiltCards();
  }
}

/* ── Nav : se cache en descendant, glass dès qu'on quitte le hero ───── */
function smartNav() {
  const nav = document.getElementById("nav");
  let last = 0;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    nav.classList.toggle("is-solid", y > window.innerHeight * 0.75);
    nav.classList.toggle("is-hidden", y > last && y > 200);
    last = y;
  }, { passive: true });
}

/* ── Ancres : défilement doux via Lenis ─────────────────────────────── */
function anchors(lenis) {
  document.querySelectorAll("[data-scroll-to]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target || !link.getAttribute("href").startsWith("#")) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.4 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* ── Boutons magnétiques ────────────────────────────────────────────── */
function magneticButtons() {
  document.querySelectorAll("[data-magnetic]").forEach((btn) => {
    const strength = 0.35;

    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      gsap.to(btn, { x, y, duration: 0.4, ease: "power3.out" });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* ── Cartes qui suivent la souris (tilt 3D discret) ─────────────────── */
function tiltCards() {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
      gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 900, duration: 0.5, ease: "power2.out" });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power3.out" });
    });
  });
}

/* ── Avant / Après : drag, tactile et clavier ───────────────────────── */
function compareSlider() {
  const stage = document.querySelector("[data-compare]");
  if (!stage) return;

  const set = (percent) => {
    const clamped = Math.max(2, Math.min(98, percent));
    stage.style.setProperty("--x", `${clamped}%`);
    stage.setAttribute("aria-valuenow", Math.round(clamped));
  };

  const fromEvent = (e) => {
    const r = stage.getBoundingClientRect();
    set(((e.clientX - r.left) / r.width) * 100);
  };

  let dragging = false;
  stage.addEventListener("pointerdown", (e) => { dragging = true; stage.setPointerCapture(e.pointerId); fromEvent(e); });
  stage.addEventListener("pointermove", (e) => dragging && fromEvent(e));
  stage.addEventListener("pointerup", () => { dragging = false; });
  stage.addEventListener("pointercancel", () => { dragging = false; });

  stage.addEventListener("keydown", (e) => {
    const current = parseFloat(stage.getAttribute("aria-valuenow"));
    if (e.key === "ArrowLeft") set(current - 4);
    if (e.key === "ArrowRight") set(current + 4);
  });

  set(50);
}

/* ── Filtres de réalisations : sans rechargement, transition douce ──── */
function workFilters() {
  const chips = document.querySelectorAll("[data-filter]");
  const works = document.querySelectorAll(".work");
  if (!chips.length) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => {
        c.classList.toggle("is-active", c === chip);
        c.setAttribute("aria-selected", c === chip ? "true" : "false");
      });
      const cat = chip.dataset.filter;
      works.forEach((w) => {
        w.classList.toggle("is-dimmed", cat !== "all" && w.dataset.cat !== cat);
      });
    });
  });
}
