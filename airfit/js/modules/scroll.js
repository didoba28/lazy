/* Lenis ⇄ GSAP : un seul ticker, ScrollTrigger resynchronisé à chaque frame. */

export function initScroll({ reduceMotion }) {
  if (reduceMotion || typeof Lenis === "undefined") return null;

  const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
