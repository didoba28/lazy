/* AirFit — orchestration.
   Libs globales chargées via CDN : gsap, ScrollTrigger, Lenis. */

import { initScroll } from "./modules/scroll.js";
import { initReveals } from "./modules/reveals.js";
import { initSections } from "./modules/sections.js";
import { initInteractions } from "./modules/interactions.js";

document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

gsap.registerPlugin(ScrollTrigger);

const lenis = initScroll({ reduceMotion });

if (!reduceMotion) {
  initReveals();
  initSections();
}
initInteractions({ lenis, reduceMotion });

/* Préchargement : rideau qui se lève une fois la page prête. */
const loader = document.getElementById("loader");
window.addEventListener("load", () => {
  loader.classList.add("is-done");
  setTimeout(() => loader.remove(), 1000);
});
/* Filet de sécurité si un média externe traîne. */
setTimeout(() => loader?.classList.add("is-done"), 3500);
