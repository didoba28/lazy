/* Données centralisées — les 3 plateaux + contenus éditoriaux */

export const PLATEAUX = [
  {
    id: 'compact',
    num: '01',
    name: 'Compact',
    phrase: 'L’essentiel du street-workout, dessiné pour les espaces contraints.',
    surface: 'Dès 90 m²',
    users: 'Jusqu’à 10 utilisateurs simultanés',
    pratiques: ['Street-workout', 'Renforcement', 'Mobilité'],
  },
  {
    id: 'signature',
    num: '02',
    name: 'Signature',
    phrase: 'Le plateau complet qui devient le cœur battant de la commune.',
    surface: 'Dès 140 m²',
    users: 'Jusqu’à 18 utilisateurs simultanés',
    pratiques: ['Street-workout', 'Cross-training', 'Callisthénie', 'Mobilité'],
  },
  {
    id: 'arena',
    num: '03',
    name: 'Arena',
    phrase: 'Double zone et gradins bas : un véritable équipement de destination.',
    surface: 'Dès 200 m²',
    users: 'Jusqu’à 25 utilisateurs simultanés',
    pratiques: ['Street-workout', 'Cross-training', 'Cours collectifs', 'Événements'],
  },
];

export const ETAPES = [
  { num: '01', titre: 'Étude du besoin', texte: 'Vos usages, votre terrain, vos publics : nous écoutons avant de dessiner. Chaque plateau naît d’un diagnostic précis du territoire.' },
  { num: '02', titre: 'Conception', texte: 'Nos concepteurs composent le plateau — agrès, flux, marquages — au millimètre, dans le respect des normes EN 16630.' },
  { num: '03', titre: 'Visualisation 3D', texte: 'Vous voyez votre futur plateau avant le premier coup de pelle : implantation réelle, matières, lumière du site.' },
  { num: '04', titre: 'Fabrication', texte: 'Acier thermolaqué, fixations inox, sols amortissants : tout est fabriqué et contrôlé dans nos ateliers.' },
  { num: '05', titre: 'Installation', texte: 'Une équipe unique, un chantier court, un site rendu propre. Le plateau est réceptionné, contrôlé, certifié.' },
  { num: '06', titre: 'Suivi', texte: 'Maintenance, animations, données d’usage : nous restons à vos côtés pendant toute la vie de l’équipement.' },
];

export const USAGES = [
  { titre: 'Enfants', legende: 'Motricité, jeu libre, premières tractions — sous l’œil des parents.', img: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?q=80&w=1200&auto=format&fit=crop' },
  { titre: 'Ados', legende: 'Le spot de rendez-vous après les cours, entre défi et progression.', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop' },
  { titre: 'Sportifs', legende: 'Callisthénie, cross-training : un vrai terrain d’entraînement en accès libre.', img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop' },
  { titre: 'Familles', legende: 'Le dimanche matin, toutes les générations sur le même plateau.', img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1200&auto=format&fit=crop' },
  { titre: 'Seniors', legende: 'Équilibre, souplesse, lien social — des agrès pensés pour durer en forme.', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop' },
  { titre: 'Pratiques douces', legende: 'Yoga, étirements, récupération : le plateau respire aussi lentement.', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop' },
];

export const CHIFFRES = [
  { valeur: 550, prefixe: '+', suffixe: '', label: 'installations', texte: 'plateaux conçus, fabriqués et installés partout en France.' },
  { valeur: 3, prefixe: '+', suffixe: 'M', label: 'utilisateurs', texte: 'de passages enregistrés chaque année sur nos équipements.' },
  { valeur: 98, prefixe: '', suffixe: '%', label: 'satisfaction', texte: 'des communes équipées recommandent AirFit à une autre collectivité.' },
];

export const REALISATIONS = [
  { lieu: 'Parc des Berges', commune: 'Lyon 7ᵉ', type: 'signature', typeLabel: 'Plateau Signature', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop' },
  { lieu: 'Esplanade du Littoral', commune: 'La Rochelle', type: 'arena', typeLabel: 'Plateau Arena', img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop' },
  { lieu: 'Square Jean-Moulin', commune: 'Montreuil', type: 'compact', typeLabel: 'Plateau Compact', img: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1600&auto=format&fit=crop' },
  { lieu: 'Plaine des Sports', commune: 'Annecy', type: 'arena', typeLabel: 'Plateau Arena', img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1600&auto=format&fit=crop' },
  { lieu: 'Promenade du Canal', commune: 'Toulouse', type: 'signature', typeLabel: 'Plateau Signature', img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1600&auto=format&fit=crop' },
  { lieu: 'Cœur de Bourg', commune: 'Saint-Brieuc', type: 'compact', typeLabel: 'Plateau Compact', img: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?q=80&w=1600&auto=format&fit=crop' },
];
