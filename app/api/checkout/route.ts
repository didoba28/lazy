import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

const Schema = z.object({
  from: z.string().min(2),
  to: z.string().min(2),
  date: z.string().min(8),
  time: z.string().min(4),
  passengers: z.string(),
  luggage: z.string(),
  roundTrip: z.string(),
  note: z.string().optional().default(''),
  pickupAddress: z.string().min(2),
  dropoffAddress: z.string().min(2),
  price: z.coerce.number().min(1),
  email: z.string().email(),
  phone: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  locale: z.enum(['fr', 'en']).default('fr'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = Schema.parse(body);

    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    const description = `TKA driver — ${data.from} → ${data.to} le ${data.date} à ${data.time}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      currency: 'eur',
      customer_email: data.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(data.price * 100),
            product_data: {
              name: 'TKA driver — réservation',
              description,
            },
          },
        },
      ],
      metadata: {
        from: data.from,
        to: data.to,
        date: data.date,
        time: data.time,
        passengers: data.passengers,
        luggage: data.luggage,
        roundTrip: data.roundTrip,
        note: data.note,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        pickupAddress: data.pickupAddress,
        dropoffAddress: data.dropoffAddress,
      },
      success_url: `${baseUrl}/${data.locale}/reservation/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${data.locale}/reservation/annulation`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
