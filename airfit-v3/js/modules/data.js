/* ============================================================
   AIRFIT V3 — Données centralisées des 3 plateaux
   Toutes les infos produit vivent ici (sélecteur, hero, cotes).
   Unités plan : mètres (x = longueur, y = profondeur).
   ============================================================ */

export const PLATFORMS = [
  {
    id: 'compact',
    index: '01',
    name: 'Compact',
    tagline: 'L’essentiel du street-workout, dans un mouchoir de poche urbain.',
    surface: 'Dès 90 m²',
    users: 'Jusqu’à 10 utilisateurs simultanés',
    practices: ['Traction', 'Renforcement', 'Motricité'],
    // plan : 10,0 m x 9,0 m
    w: 10, d: 9,
    dims: { w: '10,0 m', d: '9,0 m', h: '2,60 m', area: '≈ 90 m²', mat: 'ACIER S235 · THERMOLAQUÉ' },
    hotspots: [
      { u: 3.7, v: 1.2, z: 2.5, label: 'Zone traction', desc: 'Portique double hauteur, barres Ø33 mm.' },
      { u: 4.1, v: 6.8, z: 1.3, label: 'Barres parallèles', desc: 'Dips, renforcement, appuis faciaux.' },
      { u: 7.6, v: 3.4, z: 0.1, label: 'Aire de motricité', desc: 'Marquage au sol, échauffement et mobilité.' },
      { u: 8.3, v: 6.7, z: 0.5, label: 'Assise intégrée', desc: 'Banc acier-bois, récupération et lien social.' },
    ],
  },
  {
    id: 'signature',
    index: '02',
    name: 'Signature',
    tagline: 'Le plateau complet : traction, suspension, anneaux et motricité réunis.',
    surface: 'Dès 140 m²',
    users: 'Jusqu’à 18 utilisateurs simultanés',
    practices: ['Traction', 'Suspension', 'Anneaux', 'Renforcement', 'Motricité'],
    // plan : 14,0 m x 10,0 m
    w: 14, d: 10,
    dims: { w: '14,0 m', d: '10,0 m', h: '2,60 m', area: '≈ 140 m²', mat: 'ACIER S235 · THERMOLAQUÉ' },
    hotspots: [
      { u: 3.1, v: 1.6, z: 2.5, label: 'Zone traction', desc: 'Trois hauteurs de barres, du débutant au confirmé.' },
      { u: 6.4, v: 3.0, z: 2.3, label: 'Monkey bars', desc: 'Échelle horizontale de suspension, 3,0 m.' },
      { u: 10.8, v: 1.6, z: 2.2, label: 'Anneaux de gym', desc: 'Sangles réglables, travail d’instabilité.' },
      { u: 3.3, v: 7.4, z: 1.3, label: 'Barres parallèles', desc: 'Dips et passages d’appuis.' },
      { u: 11.1, v: 6.6, z: 0.6, label: 'Plyo-boxes', desc: 'Sauts, step-ups, deux hauteurs.' },
      { u: 8.0, v: 8.6, z: 0.1, label: 'Aire de motricité', desc: 'Marquage ludique multi-âges.' },
    ],
  },
  {
    id: 'arena',
    index: '03',
    name: 'Arena',
    tagline: 'Double zone et gradins bas : le stade de proximité de votre commune.',
    surface: 'Dès 200 m²',
    users: 'Jusqu’à 25 utilisateurs simultanés',
    practices: ['Traction', 'Cross-training', 'Anneaux', 'Suspension', 'Motricité', 'Spectateurs'],
    // plan : 20,0 m x 10,0 m
    w: 20, d: 10,
    dims: { w: '20,0 m', d: '10,0 m', h: '2,70 m', area: '≈ 200 m²', mat: 'ACIER S235 · THERMOLAQUÉ' },
    hotspots: [
      { u: 4.4, v: 1.8, z: 2.5, label: 'Zone traction', desc: 'Portique triple, barres multi-hauteurs.' },
      { u: 7.6, v: 3.2, z: 2.3, label: 'Monkey bars', desc: 'Échelle de suspension traversante.' },
      { u: 15.2, v: 3.0, z: 2.6, label: 'Cage cross-training', desc: 'Rig 4 montants, WOD et circuits.' },
      { u: 12.0, v: 1.8, z: 2.2, label: 'Anneaux de gym', desc: 'Sangles réglables sur portique dédié.' },
      { u: 0.7, v: 5.0, z: 0.8, label: 'Gradins bas', desc: 'Deux niveaux d’assise, cours collectifs.' },
      { u: 16.6, v: 7.8, z: 0.1, label: 'Aire de motricité', desc: 'Zone libre, échauffement collectif.' },
      { u: 6.0, v: 7.6, z: 1.3, label: 'Barres parallèles', desc: 'Renforcement et passages au sol.' },
    ],
  },
];

/* Étapes de la timeline « clé en main » */
export const TIMELINE = [
  { n: '01', t: 'Étude du besoin', d: 'Analyse du site, des usages et des publics avec vos équipes. Chaque implantation part du terrain, jamais d’un catalogue.' },
  { n: '02', t: 'Conception', d: 'Nos ingénieurs dessinent un plateau à vos mesures : flux, orientations, normes EN 16630 intégrées dès le trait.' },
  { n: '03', t: 'Visualisation 3D', d: 'Vous voyez votre futur plateau dans son environnement réel avant de décider. Ajustements illimités.' },
  { n: '04', t: 'Fabrication', d: 'Acier S235 thermolaqué, assemblages soudés en atelier français. Contrôle qualité pièce par pièce.' },
  { n: '05', t: 'Installation', d: 'Pose complète par nos équipes : sol sportif, structures, marquages. Site livré prêt à l’usage.' },
  { n: '06', t: 'Suivi', d: 'Maintenance préventive, garantie décennale structure et interlocuteur unique dans la durée.' },
];

/* Usages / générations */
export const USAGES = [
  { k: 'enfants', label: '3 – 10 ans', t: 'Enfants', d: 'Motricité, équilibre, jeux de parcours au sol.', img: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=900&q=70' },
  { k: 'ados', label: '11 – 17 ans', t: 'Ados', d: 'Street-workout, freestyle, premiers défis entre amis.', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=70' },
  { k: 'sportifs', label: '18 – 45 ans', t: 'Sportifs', d: 'Cross-training, calisthénie, préparation physique.', img: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=900&q=70' },
  { k: 'familles', label: 'Tous âges', t: 'Familles', d: 'Un lieu de rendez-vous le week-end, pour bouger ensemble.', img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=900&q=70' },
  { k: 'seniors', label: '60 ans et +', t: 'Seniors', d: 'Mobilité douce, équilibre, prévention des chutes.', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=70' },
  { k: 'douces', label: 'Pratiques douces', t: 'Bien-être', d: 'Yoga, stretching, respiration en plein air.', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=70' },
];

/* Réalisations */
export const PROJECTS = [
  { city: 'Bordeaux', place: 'Parc des Berges', type: 'arena', typeName: 'Arena', area: '210 m²', year: '2025', img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=70' },
  { city: 'Annecy', place: 'Esplanade du Lac', type: 'signature', typeName: 'Signature', area: '140 m²', year: '2025', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=70' },
  { city: 'Lille', place: 'Quartier Bois-Blancs', type: 'compact', typeName: 'Compact', area: '95 m²', year: '2024', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=70' },
  { city: 'Montpellier', place: 'Promenade du Lez', type: 'signature', typeName: 'Signature', area: '150 m²', year: '2024', img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&q=70' },
  { city: 'Rennes', place: 'Plaine de Baud', type: 'arena', typeName: 'Arena', area: '220 m²', year: '2024', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200&q=70' },
  { city: 'Bayonne', place: 'Rives de l’Adour', type: 'compact', typeName: 'Compact', area: '90 m²', year: '2023', img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&q=70' },
];
