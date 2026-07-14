/* Chorégraphies de sections : hero vidéo, histoire sticky, piste horizontale,
   ligne de conception, mur de témoignages. Les pins lourds sont réservés au
   desktop via ScrollTrigger.matchMedia. */

export function initSections() {
  heroVideo();
  storyChapters();
  worksTrack();
  stepsLine();
  voicesWall();
  floaters();
}

/* ── Hero : bascule image → vidéo drone si assets/video/hero.mp4 existe ── */
function heroVideo() {
  const video = document.querySelector("[data-hero-video]");
  const img = document.querySelector("[data-hero-img]");
  if (!video) return;

  video.addEventListener("canplay", () => {
    video.muted = true;
    video.play().then(() => {
      video.classList.add("is-playing");
      img?.remove();
    }).catch(() => {});
  }, { once: true });

  video.load();
}

/* ── L'histoire : section pinnée, chapitres en crossfade ────────────── */
function storyChapters() {
  const section = document.querySelector("[data-story]");
  if (!section) return;

  const frames = section.querySelectorAll("[data-story-frame]");
  const steps = section.querySelectorAll("[data-story-step]");
  const bar = section.querySelector("[data-story-bar]");
  const count = steps.length;

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: `+=${count * 90}%`,
    pin: section.querySelector(".story__pin"),
    scrub: true,
    onUpdate: (self) => {
      const index = Math.min(count - 1, Math.floor(self.progress * count));
      frames.forEach((f, i) => f.classList.toggle("is-active", i === index));
      steps.forEach((s, i) => s.classList.toggle("is-active", i === index));
      if (bar) bar.style.width = `${self.progress * 100}%`;
    },
  });
}

/* ── Réalisations : piste horizontale pinnée (desktop uniquement) ───── */
function worksTrack() {
  const section = document.querySelector("[data-works]");
  const viewport = section?.querySelector("[data-works-viewport]");
  const track = section?.querySelector("[data-works-track]");
  if (!track) return;

  ScrollTrigger.matchMedia({
    "(min-width: 900px)": () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: viewport,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => tween.scrollTrigger?.kill();
    },
  });
}

/* ── Conception : la ligne verte se dessine au fil du scroll ────────── */
function stepsLine() {
  const list = document.querySelector("[data-steps]");
  const line = document.querySelector("[data-steps-line]");
  if (!list || !line) return;

  ScrollTrigger.create({
    trigger: list,
    start: "top 70%",
    end: "bottom 55%",
    scrub: true,
    onUpdate: (self) => line.style.setProperty("--p", self.progress.toFixed(3)),
  });
}

/* ── Témoignages : citation géante qui se remplace au scroll ────────── */
function voicesWall() {
  const section = document.querySelector("[data-voices]");
  if (!section) return;

  const quotes = section.querySelectorAll("[data-voice]");
  const count = quotes.length;

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: `+=${count * 80}%`,
    pin: section.querySelector(".voices__pin"),
    scrub: true,
    onUpdate: (self) => {
      const index = Math.min(count - 1, Math.floor(self.progress * count));
      quotes.forEach((q, i) => q.classList.toggle("is-active", i === index));
    },
  });
}

/* ── Éléments qui flottent légèrement ───────────────────────────────── */
function floaters() {
  document.querySelectorAll("[data-float]").forEach((el, i) => {
    gsap.to(el, {
      y: i % 2 ? 14 : -14,
      duration: 3 + i * 0.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  });
}
