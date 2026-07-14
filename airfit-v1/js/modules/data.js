/* ==========================================================================
   AirFit — Données centralisées des 3 plateaux
   ========================================================================== */

export const PLATEAUX = [
  {
    id: 'compact',
    numero: '01',
    nom: 'Compact',
    accroche: 'L’essentiel du sport, au cœur des espaces les plus contraints.',
    surface: 'Dès 90 m²',
    capacite: 'Jusqu’à 10 utilisateurs simultanés',
    pratiques: ['Fitness', 'Street-workout', 'Motricité'],
    largeur: 0.66,           // part de la largeur allouée au visuel (desktop)
    fond: '#00102C',         // nuance de fond de la scène
    lumiere: 0.55            // intensité du halo
  },
  {
    id: 'signature',
    numero: '02',
    nom: 'Signature',
    accroche: 'Le plateau complet qui devient le point de rencontre de la commune.',
    surface: 'Dès 140 m²',
    capacite: 'Jusqu’à 18 utilisateurs simultanés',
    pratiques: ['Fitness', 'Street-workout', 'Cross-training', 'Pratiques douces'],
    largeur: 0.78,
    fond: '#001231',
    lumiere: 0.75
  },
  {
    id: 'arena',
    numero: '03',
    nom: 'Arena',
    accroche: 'Double zone et gradins : l’équipement sportif signature d’un territoire.',
    surface: 'Dès 200 m²',
    capacite: 'Jusqu’à 25 utilisateurs simultanés',
    pratiques: ['Fitness', 'Street-workout', 'Cross-training', 'Motricité', 'Pratiques douces'],
    largeur: 0.92,
    fond: '#011940',
    lumiere: 0.9
  }
];

export const REALISATIONS = [
  { lieu: 'Parc des Rives', commune: 'Annecy', type: 'Signature', filtre: 'signature',
    img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=70' },
  { lieu: 'Esplanade du Port', commune: 'La Rochelle', type: 'Arena', filtre: 'arena',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=70' },
  { lieu: 'Square Jean-Moulin', commune: 'Villeurbanne', type: 'Compact', filtre: 'compact',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=70' },
  { lieu: 'Promenade du Canal', commune: 'Sète', type: 'Signature', filtre: 'signature',
    img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&q=70' },
  { lieu: 'Plaine des Sports', commune: 'Clermont-Ferrand', type: 'Arena', filtre: 'arena',
    img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=70' },
  { lieu: 'Jardin des Remparts', commune: 'Vannes', type: 'Compact', filtre: 'compact',
    img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=70' }
];

export const CHIFFRES = [
  { valeur: 550, prefixe: '+', suffixe: '', label: 'installations en France',
    detail: 'Des communes rurales aux grandes métropoles.' },
  { valeur: 3, prefixe: '+', suffixe: 'M', label: 'utilisateurs chaque année',
    detail: 'Un usage réel, mesuré, qui dure dans le temps.' },
  { valeur: 98, prefixe: '', suffixe: '%', label: 'de satisfaction des collectivités',
    detail: 'De l’étude du besoin au suivi après installation.' }
];
