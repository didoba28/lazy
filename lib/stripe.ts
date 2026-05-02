import Stripe from 'stripe';

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  // Pas de apiVersion explicite : on laisse le SDK utiliser sa version par défaut.
  cached = new Stripe(key);
  return cached;
}
