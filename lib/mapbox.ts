/**
 * Helpers Mapbox côté client.
 *
 * - L'autocomplete est appelée directement depuis le navigateur avec le
 *   token public (NEXT_PUBLIC_MAPBOX_TOKEN), via l'API Geocoding v5.
 * - Le calcul de distance/durée passe par /api/distance pour ne pas
 *   exposer le token serveur (et pour pouvoir y poser un cache plus tard).
 */
export type MapboxFeature = {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
  text: string;
};

const GEOCODE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

export async function searchAddress(
  query: string,
  signal?: AbortSignal,
): Promise<MapboxFeature[]> {
  if (query.trim().length < 3) return [];
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) return [];

  const url =
    `${GEOCODE_URL}/${encodeURIComponent(query)}.json` +
    `?access_token=${token}` +
    `&autocomplete=true&country=fr,be&language=fr&limit=5&types=address,poi,place`;

  const res = await fetch(url, { signal });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.features ?? []).map((f: any) => ({
    id: f.id,
    place_name: f.place_name,
    center: f.center,
    text: f.text,
  }));
}

export type DistanceResult = {
  distanceKm: number;
  durationMin: number;
};

export async function fetchDistance(
  origin: [number, number],
  destination: [number, number],
): Promise<DistanceResult> {
  const res = await fetch('/api/distance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination }),
  });
  if (!res.ok) throw new Error('Distance API error');
  return res.json();
}
