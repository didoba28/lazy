/* Reveals génériques pilotés par attributs :
   - [data-reveal="fade|up|blur|scale"]  + [data-delay]
   - [data-split]        titres révélés ligne par ligne (masque + translateY)
   - [data-manifesto]    opacité mot par mot, scrubée au scroll (effet Apple)
   - [data-counter]      compteurs animés (data-to, data-prefix, data-suffix)
   - [data-parallax]     dérive verticale scrubée (valeur = yPercent)
*/

export function initReveals() {
  splitLines();
  genericReveals();
  manifesto();
  counters();
  parallax();
}

/* ── Titres ligne par ligne ─────────────────────────────────────────── */
function splitLines() {
  document.querySelectorAll("[data-split]").forEach((title) => {
    const lines = [...title.querySelectorAll(":scope > span")].map((span) => {
      const inner = document.createElement("span");
      inner.className = "split-inner";
      inner.append(...span.childNodes);
      span.append(inner);
      return inner;
    });

    gsap.to(lines, {
      y: 0,
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.12,
      scrollTrigger: { trigger: title, start: "top 82%", once: true },
    });
  });
}

/* ── Fades / blur / scale ───────────────────────────────────────────── */
function genericReveals() {
  const presets = {
    fade:  { opacity: 0 },
    up:    { opacity: 0, y: 40 },
    blur:  { opacity: 0, filter: "blur(14px)" },
    scale: { opacity: 0, scale: 0.94 },
  };

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    const from = presets[el.dataset.reveal] ?? presets.fade;
    gsap.fromTo(el, from, {
      opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
      duration: 1, ease: "power3.out",
      delay: parseFloat(el.dataset.delay ?? 0),
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });
}

/* ── Manifeste : les mots s'allument au rythme du scroll ────────────── */
function manifesto() {
  const el = document.querySelector("[data-manifesto]");
  if (!el) return;

  wrapWords(el);
  const words = el.querySelectorAll(".w");

  ScrollTrigger.create({
    trigger: el,
    start: "top 78%",
    end: "bottom 45%",
    scrub: true,
    onUpdate: (self) => {
      const lit = Math.round(self.progress * words.length);
      words.forEach((w, i) => w.classList.toggle("is-on", i < lit));
    },
  });
}

function wrapWords(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) {
    if (walker.currentNode.textContent.trim()) textNodes.push(walker.currentNode);
  }
  textNodes.forEach((node) => {
    const frag = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach((part) => {
      if (!part.trim()) { frag.append(part); return; }
      const w = document.createElement("span");
      w.className = "w";
      w.textContent = part;
      frag.append(w);
    });
    node.replaceWith(frag);
  });
}

/* ── Compteurs ──────────────────────────────────────────────────────── */
function counters() {
  document.querySelectorAll("[data-counter]").forEach((el) => {
    const to = parseFloat(el.dataset.to);
    const prefix = el.dataset.prefix ?? "";
    const suffix = el.dataset.suffix ?? "";
    const state = { value: 0 };

    gsap.to(state, {
      value: to,
      duration: 2.2,
      ease: "power2.out",
      snap: { value: 1 },
      scrollTrigger: { trigger: el, start: "top 75%", once: true },
      onUpdate: () => { el.textContent = `${prefix}${state.value}${suffix}`; },
    });
  });
}

/* ── Parallaxe ──────────────────────────────────────────────────────── */
function parallax() {
  document.querySelectorAll("[data-parallax]").forEach((el) => {
    const amount = parseFloat(el.dataset.parallax) || 10;
    gsap.fromTo(el, { yPercent: -amount / 2 }, {
      yPercent: amount / 2,
      ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
}
