# AirFit — Variante 1 « MONOLITHE »

Concept : une nuit cinématographique inspirée des lancements Apple (Vision Pro,
Watch Ultra). La page vit dans le bleu nuit #001231 ; le plateau sportif y est
traité comme un objet iconique — dessiné en SVG isométrique art-directé,
flottant sur un halo #01549D, rétro-éclairé par un faisceau volumétrique,
traversé périodiquement par un reflet lumineux.

Le récit est un crescendo : le hero présente le plateau Compact en apesanteur ;
au scroll il plonge et devient le premier modèle du sélecteur sticky, qui
enchaîne Compact → Signature → Arena en trois écrans pilotés par le scroll
(clic, drag, clavier et tactile restent maîtres à tout moment). L'éclairage et
la nuance de fond évoluent avec chaque modèle.

Deux respirations rythment la nuit : le comparateur avant/après (terrain vide →
habitants, slider accessible en 5 phases) et la timeline « clé en main » posée
sur un blanc pur — seul moment diurne de la page, volontairement brutal.

La typographie est monumentale et centrée : Barlow partout, Barlow Semi
Condensed 800 pour les titres et les chiffres quasi plein écran (+550, +3M,
98%), comptés à l'entrée. La galerie de réalisations défile horizontalement,
pinnée au desktop, chaque carte embarquant son plateau SVG pour rester
spectaculaire même sans photo (Unsplash bloqué → fallback dégradé signature).

Motion : GSAP + ScrollTrigger (scrubs, pin galerie, sticky sélecteur), Lenis
synchronisé sur le ticker GSAP. prefers-reduced-motion coupe tout : contenu
visible d'office, sélecteur et slider restent pleinement fonctionnels.
