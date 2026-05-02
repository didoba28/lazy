/**
 * Forfaits longue distance.
 *
 * Modifier les prix ici pour les ajuster sans toucher au reste du code.
 * `keywords` = mots-clés (insensibles à la casse) qui déclenchent la
 * détection automatique du forfait dans le simulateur quand on les
 * trouve dans l'adresse de départ ou d'arrivée.
 */
export type PackageDef = {
  id: string;
  fromLabelKey: string;
  toLabelKey: string;
  price: number;
  duration: string;
  icon: string;
  /** Détection automatique : tokens recherchés dans le texte d'adresse */
  keywords: string[];
  /** L'autre côté du trajet (pour matcher Paris en départ ou arrivée) */
  parisKeywords?: string[];
};

const PARIS = ['paris'];

export const PACKAGES: PackageDef[] = [
  {
    id: 'cdg',
    fromLabelKey: 'cdg',
    toLabelKey: 'cdg',
    price: 45,
    duration: '40 min',
    icon: 'plane',
    keywords: ['cdg', 'charles-de-gaulle', 'charles de gaulle', 'roissy'],
    parisKeywords: PARIS,
  },
  {
    id: 'orly',
    fromLabelKey: 'orly',
    toLabelKey: 'orly',
    price: 35,
    duration: '30 min',
    icon: 'plane',
    keywords: ['orly'],
    parisKeywords: PARIS,
  },
  {
    id: 'beauvais',
    fromLabelKey: 'beauvais',
    toLabelKey: 'beauvais',
    price: 130,
    duration: '1h15',
    icon: 'plane',
    keywords: ['beauvais', 'tillé', 'tille'],
    parisKeywords: PARIS,
  },
  {
    id: 'disney',
    fromLabelKey: 'disney',
    toLabelKey: 'disney',
    price: 50,
    duration: '45 min',
    icon: 'ferris',
    keywords: ['disney', 'disneyland', 'marne-la-vallée', 'marne la vallee', 'chessy'],
    parisKeywords: PARIS,
  },
  {
    id: 'deauville',
    fromLabelKey: 'deauville',
    toLabelKey: 'deauville',
    price: 280,
    duration: '2h15',
    icon: 'beach',
    keywords: ['deauville', 'trouville', 'honfleur'],
    parisKeywords: PARIS,
  },
  {
    id: 'lille',
    fromLabelKey: 'lille',
    toLabelKey: 'lille',
    price: 350,
    duration: '2h30',
    icon: 'city',
    keywords: ['lille'],
    parisKeywords: PARIS,
  },
  {
    id: 'reims',
    fromLabelKey: 'reims',
    toLabelKey: 'reims',
    price: 250,
    duration: '1h45',
    icon: 'wine',
    keywords: ['reims', 'épernay', 'epernay'],
    parisKeywords: PARIS,
  },
  {
    id: 'bruxelles',
    fromLabelKey: 'bruxelles',
    toLabelKey: 'bruxelles',
    price: 600,
    duration: '3h30',
    icon: 'flag',
    keywords: ['bruxelles', 'brussels', 'brussel', 'belgique', 'belgium'],
    parisKeywords: PARIS,
  },
];

function normalize(value: string | undefined): string {
  return (value ?? '')
    .toLowerCase()
    .normalize('NFD')
    // Strip combining diacritical marks (U+0300–U+036F)
    .replace(/[̀-ͯ]/g, '');
}

function matchesAny(text: string, tokens: string[]): boolean {
  return tokens.some((t) => text.includes(t));
}

/**
 * Trouve un forfait correspondant aux adresses passées.
 * Matche dans les deux sens (Paris→Dest et Dest→Paris).
 */
export function matchPackage(
  origin: string | undefined,
  destination: string | undefined,
): PackageDef | null {
  const o = normalize(origin);
  const d = normalize(destination);
  if (!o || !d) return null;

  for (const pkg of PACKAGES) {
    const parisKw = pkg.parisKeywords ?? PARIS;
    const oIsParis = matchesAny(o, parisKw);
    const dIsParis = matchesAny(d, parisKw);
    const oIsDest = matchesAny(o, pkg.keywords);
    const dIsDest = matchesAny(d, pkg.keywords);
    if ((oIsParis && dIsDest) || (dIsParis && oIsDest)) return pkg;
  }
  return null;
}
