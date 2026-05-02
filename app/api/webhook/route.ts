import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { Resend } from 'resend';

export const runtime = 'nodejs';

async function sendEmails(session: Stripe.Checkout.Session) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[webhook] RESEND_API_KEY missing — skipping email');
    return;
  }
  const from = process.env.EMAIL_FROM || 'reservations@tka-driver.fr';
  const notify = process.env.NOTIFICATION_EMAIL;
  const resend = new Resend(apiKey);

  const md = (session.metadata ?? {}) as Record<string, string>;
  const customer = session.customer_details?.email ?? md.email;
  const total = ((session.amount_total ?? 0) / 100).toFixed(2);

  const summary = `
    <p>Trajet : <strong>${md.from} → ${md.to}</strong></p>
    <p>📍 Récupération : <strong>${md.pickupAddress || md.from}</strong></p>
    <p>🏁 Dépôt : <strong>${md.dropoffAddress || md.to}</strong></p>
    <p>Date : ${md.date} à ${md.time}</p>
    <p>Passagers : ${md.passengers} · Bagages : ${md.luggage}</p>
    ${md.roundTrip === '1' ? '<p>Aller-retour</p>' : ''}
    ${md.note ? `<p>Note : ${md.note}</p>` : ''}
    <p>Montant payé : <strong>${total} €</strong></p>
  `;

  if (customer) {
    await resend.emails.send({
      from,
      to: customer,
      subject: 'Votre réservation TKA driver est confirmée',
      html: `
        <h2>Merci ${md.firstName ?? ''} !</h2>
        <p>Votre réservation est confirmée. Tidiane vous contactera 30 min avant le départ.</p>
        ${summary}
        <p>📞 06 76 63 66 47 — contact@tka-driver.fr</p>
      `,
    });
  }

  if (notify) {
    await resend.emails.send({
      from,
      to: notify,
      subject: `Nouvelle réservation : ${md.from} → ${md.to}`,
      html: `
        <h2>Nouvelle réservation payée</h2>
        <p>${md.firstName ?? ''} ${md.lastName ?? ''} · ${md.phone ?? ''} · ${customer ?? ''}</p>
        ${summary}
      `,
    });
  }
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = headers().get('stripe-signature');

  if (!secret || !sig) {
    return NextResponse.json({ error: 'Webhook misconfigured' }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bad signature';
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      await sendEmails(event.data.object as Stripe.Checkout.Session);
    }
  } catch (err) {
    console.error('[webhook] handler error', err);
  }

  return NextResponse.json({ received: true });
}
