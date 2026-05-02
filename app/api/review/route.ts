import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const Schema = z.object({
  name: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5),
  email: z.string().email().optional().or(z.literal('')),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = Schema.parse(body);

    const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const from = process.env.EMAIL_FROM || 'reservations@tka-driver.fr';
      const notify = process.env.NOTIFICATION_EMAIL;

      if (notify) {
        await resend.emails.send({
          from,
          to: notify,
          subject: `Nouvel avis ${stars} — ${data.name}`,
          html: `
            <h2>Nouvel avis client reçu</h2>
            <p><strong>${data.name}</strong>${data.email ? ` · ${data.email}` : ''}</p>
            <p>Note : <strong>${stars} (${data.rating}/5)</strong></p>
            <blockquote style="border-left:3px solid #C9A961;padding-left:12px;color:#555;">
              ${data.comment}
            </blockquote>
            <p style="color:#888;font-size:12px;">À valider avant publication sur le site.</p>
          `,
        });
      }
    } else {
      console.log('[review received]', data);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
