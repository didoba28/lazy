# AirFit — « Le sport devient un lieu de vie. »

Direction artistique & architecture d'expérience de la landing page.
Références : Apple (Vision Pro / AirPods), Nothing.tech, Stripe, Linear, Raycast, Arc.

---

## 1. Concept

On ne vend pas un équipement. On raconte la métamorphose d'un espace oublié
en cœur battant d'une commune. Le scroll **est** le récit : chaque écran est
un chapitre, la page se lit comme un film.

**Arc narratif du scroll :**

```
00  Préchargement    — logo qui respire, rideau qui se lève
01  Hero             — plan drone plein écran, lumière dorée, titre XXL
02  Manifeste        — typographie géante, mots révélés par le scroll (scrub)
03  L'histoire       — section sticky : Terrain vide → Idée → Chantier → Ouverture → La vie
04  Avant / Après    — slider interactif drag (clip-path), preuve visuelle
05  Les chiffres     — 3 stats plein écran, compteurs animés au scroll
06  Réalisations     — galerie horizontale pinnée, cartes immenses, filtres sans rechargement
07  Conception       — timeline verticale premium, ligne qui se dessine au scroll
08  Témoignages      — citation géante sticky + mur de portraits flottants
09  CTA final        — photo plein écran, titre immense, un seul bouton
10  Footer           — une ligne, ultra minimal
```

## 2. Palette (dérivée de l'identité airfit.co — variables CSS ajustables)

| Token          | Valeur     | Usage                                    |
|----------------|-----------|-------------------------------------------|
| `--paper`      | `#FAFAF7` | Fond dominant — énormément de blanc       |
| `--ink`        | `#0C0E0B` | Texte, sections sombres cinématiques      |
| `--green`      | `#8FD400` | Vert AirFit — accents, CTA, soulignements |
| `--green-deep` | `#1E4620` | Vert profond — ombres colorées, hover     |
| `--gold`       | `#F5B942` | Lumière dorée — overlays coucher de soleil|
| `--stone`      | `#8A8F86` | Texte secondaire                          |

## 3. Typographie

- **Display** : `Inter Tight` 650–800, tracking -0.045em — titres XXL (jusqu'à `clamp(3rem, 12vw, 11rem)`).
- **Émotion** : `Instrument Serif` italique — les mots qui portent l'affect (*vie*, *souvenirs*, *lien*).
- **Technique** : `Space Grotesk` / mono-like — labels, index de chapitres, chiffres (touche Nothing/Linear).

## 4. Système d'animation

- **Lenis** : smooth scroll (lerp 0.1), synchronisé à GSAP ScrollTrigger via `gsap.ticker`.
- **GSAP + ScrollTrigger** : tous les reveals, pins, scrubs, compteurs, scroll horizontal.
- Reveals génériques par attributs `data-reveal` (fade / up / blur / scale / clip) + `data-delay`.
- Titres découpés en lignes (`data-split`) — apparition ligne par ligne, masque + translateY.
- Manifeste : opacité mot par mot scrubée au scroll (effet Apple).
- Parallaxe images (`data-parallax`) : `yPercent` scrubé, images sur-dimensionnées (scale 1.15).
- Magnétisme des boutons + tilt 3D des cartes qui suivent la souris.
- Compteurs : interpolation GSAP avec `snap`, déclenchés à l'entrée.
- Sticky story : section pinnée, chapitres en crossfade pilotés par la progression.
- Réalisations : piste horizontale pinnée (desktop), scroll naturel (mobile).
- `prefers-reduced-motion` : tout est désactivé proprement, contenu visible d'office.
- Mobile-first : pins lourds réservés à `(min-width: 900px)` via `ScrollTrigger.matchMedia`.

## 5. Médias

Tous les visuels sont des emplacements art-directés (Unsplash en attendant les
shootings) avec **fallback automatique** en dégradé lumière si l'image ne charge
pas. Le hero est câblé pour recevoir la vidéo drone : déposer
`assets/video/hero.mp4` — le JS bascule automatiquement de l'image ken-burns
vers la vidéo.

## 6. Wireframe détaillé (desktop)

```
┌──────────────────────────────────────────────┐
│ NAV  AirFit◦          Réalisations  [Projet] │  glass, se cache au scroll bas
├──────────────────────────────────────────────┤
│                                              │
│   VIDÉO / IMAGE DRONE PLEIN ÉCRAN            │  ken-burns + halo doré
│   ── AIRES DE FITNESS · MADE IN FRANCE ──    │
│   Le sport devient                           │  XXL, lignes masquées
│   un *lieu de vie*.                          │  serif italique
│   [Imaginer votre plateau]  (Voir les sites) │  boutons magnétiques
│                        ↓ scroll              │
├──────────────────────────────────────────────┤
│        (blanc, 60vh de respiration)          │
│   Nous ne posons pas des machines.           │  mots scrubés un à un
│   Nous créons des lieux où l'on se           │
│   retrouve, où l'on bouge, où l'on vit.      │
├──────────────────────────────────────────────┤
│ STICKY ─ 01 Un terrain vide.   [image]       │  chapitres crossfade
│          02 Une idée.          [image]       │  index 01→05, barre de
│          03 Le chantier.       [image]       │  progression verte
│          04 L'ouverture.       [image]       │
│          05 La vie.            [image]       │
├──────────────────────────────────────────────┤
│   AVANT ◂──────╂──────▸ APRÈS                │  drag, clavier, tactile
├──────────────────────────────────────────────┤
│   +550   aires installées      (plein écran) │  compteurs, fond ink
│   +3M    utilisateurs          (plein écran) │
│   98 %   de satisfaction       (plein écran) │
├──────────────────────────────────────────────┤
│ ◂ RÉALISATIONS — piste horizontale pinnée ▸  │  cartes 70vh, hover zoom
│   [Tous][Collectivités][Campings][Écoles]    │  filtres animés
├──────────────────────────────────────────────┤
│   CONCEPTION — ligne verte qui se dessine    │  5 étapes, icônes
├──────────────────────────────────────────────┤
│   " Citation géante sticky "  + portraits    │  mur vivant, pas de carousel
├──────────────────────────────────────────────┤
│   PHOTO PLEIN ÉCRAN coucher de soleil        │
│   Votre commune mérite son lieu de vie.      │
│              [Commencer]                     │
├──────────────────────────────────────────────┤
│ AirFit◦ — Signes · Chalon-sur-Saône    2026  │
└──────────────────────────────────────────────┘
```

## 7. Structure des fichiers

```
airfit/
├── index.html
├── css/styles.css          (design system + sections, commenté par chapitres)
├── vendor/                 (gsap, ScrollTrigger, lenis — vendorés, zéro CDN au runtime)
├── js/main.js              (entrée, ordre d'initialisation)
└── js/modules/
    ├── scroll.js           (Lenis ⇄ GSAP)
    ├── reveals.js          (reveals génériques, split lignes, compteurs, manifeste)
    ├── sections.js         (hero, story sticky, horizontal, timeline, témoignages)
    └── interactions.js     (magnétisme, tilt, avant/après, filtres, nav)
```
