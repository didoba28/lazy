# AirFit — Variante 2 « Éditorial Lumière »

Concept : un grand magazine d'architecture consacré à un seul sujet — le plateau sportif.
Le blanc #FFFFFF domine partout ; la page se lit comme une revue : chapitres numérotés 01 → 07,
règles fines #E5E6E9, immenses titres Barlow ExtraBold alignés à gauche, bleu AirFit #01549D
réservé aux index, soulignements et éléments actifs. Le rythme est lent, luxueux, précis.

Seule exception sombre : le hero pleine hauteur sur le dégradé signature
(135deg, #001231 → #01549D → blanc), où le plateau — dessiné intégralement en SVG par un
mini-moteur de projection quasi-isométrique (js/modules/plateau.js) — déborde du cadre à droite,
lignes claires et halo. Au scroll, il descend, tourne de quelques degrés et « se pose » sur le
blanc du sélecteur, où il réapparaît en version blueprint habillé (traits bleu nuit, aplats
#E5E6E9, accents #01549D, ombre douce).

Section signature : le sélecteur pinné sur ~3 écrans. À gauche, les trois noms en liste
typographique géante (contour gris pour l'inactif, plein #01549D pour l'actif) ; à droite le
plateau immense qui déborde. Scroll, clic, drag, flèches clavier et tactile pilotent le même
état, centralisé dans js/modules/data.js.

Suivent : comparateur avant/après en clip-path pleine largeur, timeline clé en main dont la
ligne se dessine, grille magazine des usages (fallbacks dégradés si photos bloquées), chiffres
XXL en Barlow Semi Condensed avec compteurs, galerie horizontale pinnée des réalisations,
bandeau final sur dégradé. GSAP + ScrollTrigger + Lenis vendorés ; prefers-reduced-motion
désactive tout proprement.
