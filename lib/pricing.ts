import { PACKAGES, matchPackage } from './packages';

/**
 * Constantes tarifaires.
 * Modifier ces valeurs pour ajuster le tarif global.
 *
 * Note : le tarif est fonction uniquement de la distance (km), pas du
 * temps de trajet. Les majorations s'appliquent sur l'heure de prise
 * en charge.
 */
export const PRICING = {
  PRISE_EN_CHARGE: 5,
  TARIF_KM: 2,
  MAJORATION_HEURE_POINTE: 0.2,
  MAJORATION_NUIT: 0.15,
  PRIX_MINIMUM: 25,
} as const;

export type TripParams = {
  distanceKm: number;
  durationMin: number;
  pickupDateTime: Date;
  isRoundTrip: boolean;
  origin?: string;
  destination?: string;
};

export type PriceResult = {
  total: number;
  isPackage: boolean;
  packageId?: string;
  isPeak: boolean;
  isNight: boolean;
  isRoundTrip: boolean;
};

export function isPeakHour(date: Date): boolean {
  const h = date.getHours();
  return (h >= 7 && h < 10) || (h >= 17 && h < 20);
}

export function isNightHour(date: Date): boolean {
  const h = date.getHours();
  return h >= 22 || h < 6;
}

function ceilToHalfEuro(value: number): number {
  return Math.ceil(value * 2) / 2;
}

export function calculatePrice(params: TripParams): PriceResult {
  const { distanceKm, durationMin, pickupDateTime, isRoundTrip, origin, destination } = params;

  // 1. Forfait longue distance prioritaire
  const pkg = matchPackage(origin, destination);
  if (pkg) {
    const total = isRoundTrip ? pkg.price * 2 : pkg.price;
    return {
      total: ceilToHalfEuro(total),
      isPackage: true,
      packageId: pkg.id,
      isPeak: false,
      isNight: false,
      isRoundTrip,
    };
  }

  // 2. Calcul standard (basé sur la distance uniquement)
  const base = PRICING.PRISE_EN_CHARGE + distanceKm * PRICING.TARIF_KM;

  // 3. Majorations
  let total = base;
  const peak = isPeakHour(pickupDateTime);
  const night = isNightHour(pickupDateTime);
  if (peak) total *= 1 + PRICING.MAJORATION_HEURE_POINTE;
  if (night) total *= 1 + PRICING.MAJORATION_NUIT;

  // 4. Aller-retour
  if (isRoundTrip) total *= 2;

  // 5. Prix minimum
  total = Math.max(total, PRICING.PRIX_MINIMUM);

  // 6. Arrondi au demi-euro supérieur
  total = ceilToHalfEuro(total);

  return {
    total,
    isPackage: false,
    isPeak: peak,
    isNight: night,
    isRoundTrip,
  };
}

export { PACKAGES };
