'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPriceEUR } from '@/lib/utils';

const Schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(8),
  pickupAddress: z.string().min(3, 'Adresse de récupération requise'),
  dropoffAddress: z.string().min(3, 'Adresse de dépôt requise'),
});
type Form = z.infer<typeof Schema>;

export default function ReservationForm() {
  const t = useTranslations('reservation');
  const locale = useLocale();
  const router = useRouter();
  const sp = useSearchParams();

  const trip = {
    from: sp.get('from') ?? '',
    to: sp.get('to') ?? '',
    date: sp.get('date') ?? '',
    time: sp.get('time') ?? '',
    passengers: sp.get('passengers') ?? '1',
    luggage: sp.get('luggage') ?? '0',
    roundTrip: sp.get('roundTrip') ?? '0',
    note: sp.get('note') ?? '',
    price: Number(sp.get('price') ?? '0'),
  };

  const calUsername = process.env.NEXT_PUBLIC_CAL_USERNAME;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(Schema),
    defaultValues: {
      pickupAddress: trip.from,
      dropoffAddress: trip.to,
    },
  });

  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(values: Form) {
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...trip,
          ...values,
          locale,
          pickupAddress: values.pickupAddress,
          dropoffAddress: values.dropoffAddress,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json.error || 'Erreur paiement');
      }
      window.location.href = json.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    }
  }

  if (trip.price <= 0) {
    return (
      <div className="container-tight max-w-2xl text-center">
        <p className="text-ink/70">Aucun trajet sélectionné.</p>
        <Link
          href={`/${locale}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-accent"
        >
          <ArrowLeft className="h-4 w-4" /> {t('confirmation.back')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-tight grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.2fr]">
      {/* Récapitulatif */}
      <aside className="rounded-2xl border border-brand/10 bg-white p-6 fancy-shadow">
        <h2 className="font-display text-xl font-semibold text-brand">{t('summary')}</h2>
        <dl className="mt-5 grid gap-3 text-sm">
          <div>
            <dt className="text-ink/50">Adresse de récupération</dt>
            <dd className="font-medium text-ink">{trip.from}</dd>
          </div>
          <div>
            <dt className="text-ink/50">Adresse de dépôt</dt>
            <dd className="font-medium text-ink">{trip.to}</dd>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <dt className="text-ink/50">{t('date')}</dt>
              <dd className="font-medium text-ink">{trip.date}</dd>
            </div>
            <div>
              <dt className="text-ink/50">{t('time')}</dt>
              <dd className="font-medium text-ink">{trip.time}</dd>
            </div>
          </div>
          <div>
            <dt className="text-ink/50">{t('passengers')}</dt>
            <dd className="font-medium text-ink">{trip.passengers}</dd>
          </div>
          {trip.note && (
            <div>
              <dt className="text-ink/50">Note</dt>
              <dd className="text-ink">{trip.note}</dd>
            </div>
          )}
        </dl>
        <div className="mt-6 border-t border-brand/10 pt-5">
          <p className="text-sm text-ink/60">{t('price')}</p>
          <p className="font-display text-4xl font-bold text-brand">
            {formatPriceEUR(trip.price)}
          </p>
        </div>

        {calUsername ? (
          <div className="mt-6 rounded-md border border-brand/10 bg-mist p-4 text-xs text-ink/60">
            Vous pouvez aussi choisir un créneau spécifique sur le calendrier ci-contre. Sinon,
            le créneau retenu est <strong>{trip.date}</strong> à <strong>{trip.time}</strong>.
          </div>
        ) : null}
      </aside>

      {/* Formulaire / Cal.com */}
      <div className="rounded-2xl border border-brand/10 bg-white p-6 fancy-shadow sm:p-8">
        <h1 className="font-display text-2xl font-bold text-brand">{t('title')}</h1>

        {calUsername ? (
          <div className="mt-5 overflow-hidden rounded-md border border-brand/10">
            {/* Cal.com inline embed (basic iframe) */}
            <iframe
              src={`https://cal.com/${calUsername}?embed=1&hideEventTypeDetails=1`}
              className="h-[420px] w-full"
              loading="lazy"
              title="Cal.com"
            />
          </div>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
          {/* Adresses exactes */}
          <div className="rounded-xl border border-brand/10 bg-mist p-4 grid gap-3">
            <h2 className="font-display text-base font-semibold text-brand">Adresses du trajet</h2>
            <div className="grid gap-2">
              <Label htmlFor="pickupAddress">Adresse exacte de récupération</Label>
              <Input
                id="pickupAddress"
                placeholder="Ex. 12 rue de Rivoli, Paris 1er — Hall B"
                {...register('pickupAddress')}
              />
              {errors.pickupAddress && (
                <p className="text-xs text-red-600">{errors.pickupAddress.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dropoffAddress">Adresse exacte de dépôt</Label>
              <Input
                id="dropoffAddress"
                placeholder="Ex. Aéroport CDG — Terminal 2E"
                {...register('dropoffAddress')}
              />
              {errors.dropoffAddress && (
                <p className="text-xs text-red-600">{errors.dropoffAddress.message}</p>
              )}
            </div>
          </div>

          <h2 className="font-display text-lg font-semibold text-brand">{t('form.title')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="firstName">{t('form.firstName')}</Label>
              <Input id="firstName" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-xs text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">{t('form.lastName')}</Label>
              <Input id="lastName" {...register('lastName')} />
              {errors.lastName && (
                <p className="text-xs text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t('form.email')}</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">{t('form.phone')}</Label>
            <Input id="phone" type="tel" {...register('phone')} />
            {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button type="submit" size="xl" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {t('form.submitting')}
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> {t('form.submit')} · {formatPriceEUR(trip.price)}
              </>
            )}
          </Button>
          <p className="text-center text-xs text-ink/50">{t('form.terms')}</p>
        </form>
      </div>
    </div>
  );
}
