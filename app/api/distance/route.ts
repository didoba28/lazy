import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const DIRECTIONS_URL = 'https://api.mapbox.com/directions/v5/mapbox/driving';

export async function POST(req: Request) {
  try {
    const { origin, destination } = (await req.json()) as {
      origin?: [number, number];
      destination?: [number, number];
    };

    if (
      !origin || !destination ||
      origin.length !== 2 || destination.length !== 2 ||
      origin.some((n) => typeof n !== 'number') ||
      destination.some((n) => typeof n !== 'number')
    ) {
      return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }

    const token = process.env.MAPBOX_SECRET_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Mapbox token missing' }, { status: 500 });
    }

    const url =
      `${DIRECTIONS_URL}/${origin[0]},${origin[1]};${destination[0]},${destination[1]}` +
      `?access_token=${token}&geometries=geojson&overview=false`;

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Mapbox error' }, { status: 502 });
    }
    const data = await res.json();
    const route = data.routes?.[0];
    if (!route) {
      return NextResponse.json({ error: 'No route found' }, { status: 404 });
    }
    return NextResponse.json({
      distanceKm: route.distance / 1000,
      durationMin: route.duration / 60,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
