'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Loader2, Users, Briefcase } from 'lucide-react';
import AddressAutocomplete from './AddressAutocomplete';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { calculatePrice, type PriceResult } from '@/lib/pricing';
import { fetchDistance } from '@/lib/mapbox';
import { formatPriceEUR } from '@/lib/utils';

type Coords = [number, number];

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export default function PriceSimulator() {
  const t = useTranslations('simulator');
  const locale = useLocale();
  const router = useRouter();

  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [fromCoords, setFromCoords] = React.useState<Coords | null>(null);
  const [toCoords, setToCoords] = React.useState<Coords | null>(null);
  const [date, setDate] = React.useState(todayISO());
  const [time, setTime] = React.useState('12:00');
  const [passengers, setPassengers] = React.useState('2');
  const [luggage, setLuggage] = React.useState('1');
  const [roundTrip, setRoundTrip] = React.useState(false);
  const [returnTime, setReturnTime] = React.useState('12:00');
  const [note, setNote] = React.useState('');

  const [distance, setDistance] = React.useState<{ km: number; min: number } | null>(null);
  const [calcLoading, setCalcLoading] = React.useState(false);
  const [calcError, setCalcError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  // Recalculer la distance dès que les deux adresses ont des coordonnées
  React.useEffect(() => {
    if (!fromCoords || !toCoords) {
      setDistance(null);
      return;
    }
    let cancelled = false;
    setCalcLoading(true);
    setCalcError(null);
    fetchDistance(fromCoords, toCoords)
      .then((res) => {
        if (cancelled) return;
        setDistance({ km: res.distanceKm, min: res.durationMin });
      })
      .catch(() => {
        if (cancelled) return;
        setCalcError(t('errorMapbox'));
        setDistance(null);
      })
      .finally(() => {
        if (!cancelled) setCalcLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fromCoords, toCoords, t]);

  const pickupDateTime = React.useMemo(() => {
    if (!date || !time) return null;
    const [hh, mm] = time.split(':').map(Number);
    const [yy, mo, dd] = date.split('-').map(Number);
    const d = new Date(yy, (mo ?? 1) - 1, dd ?? 1, hh ?? 0, mm ?? 0, 0, 0);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [date, time]);

  const result: PriceResult | null = React.useMemo(() => {
    if (!pickupDateTime) return null;
    // Forfait peut être détecté par texte sans avoir besoin de la distance
    const hasDistance = distance !== null;
    const hasAddresses = from.trim().length > 0 && to.trim().length > 0;
    if (!hasDistance && !hasAddresses) return null;
    return calculatePrice({
      distanceKm: distance?.km ?? 0,
      durationMin: distance?.min ?? 0,
      pickupDateTime,
      isRoundTrip: roundTrip,
      origin: from,
      destination: to,
    });
  }, [distance, pickupDateTime, roundTrip, from, to]);

  // Si forfait détecté, on n'a pas besoin de distance Mapbox
  const showResult =
    result !== null && (result.isPackage || (distance !== null && pickupDateTime !== null));

  function handleReserve() {
    if (!result || submitting) return;
    setSubmitting(true);
    const params = new URLSearchParams({
      from,
      to,
      date,
      time,
      passengers,
      luggage,
      roundTrip: roundTrip ? '1' : '0',
      returnTime: roundTrip ? returnTime : '',
      note,
      price: String(result.total),
      distance: distance ? String(distance.km) : '',
      duration: distance ? String(distance.min) : '',
      isPackage: result.isPackage ? '1' : '0',
      packageId: result.packageId ?? '',
    });
    router.push(`/${locale}/reservation/creneaux?${params.toString()}`);
  }

  return (
    <section id="simulateur" className="relative bg-white section-pad section-glow-blue">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-brand-gold/[0.03] blur-3xl" />
        <div className="absolute -left-20 bottom-10 h-48 w-48 rounded-full bg-brand-accent/[0.04] blur-3xl" />
      </div>
      <div className="container-tight relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-brand sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-3 text-base text-ink/70">{t('subtitle')}</p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-brand/10 bg-white p-6 fancy-shadow-pulse sm:p-8">
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="from">{t('fields.from')}</Label>
              <AddressAutocomplete
                id="from"
                value={from}
                placeholder={t('fields.fromPlaceholder')}
                onChange={(v, f) => {
                  setFrom(v);
                  setFromCoords(f?.center ?? null);
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="to">{t('fields.to')}</Label>
              <AddressAutocomplete
                id="to"
                value={to}
                placeholder={t('fields.toPlaceholder')}
                onChange={(v, f) => {
                  setTo(v);
                  setToCoords(f?.center ?? null);
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="date">{t('fields.date')}</Label>
                <Input
                  id="date"
                  type="date"
                  min={todayISO()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">{t('fields.time')}</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>{t('fields.passengers')}</Label>
                <Select value={passengers} onValueChange={setPassengers}>
                  <SelectTrigger>
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-brand-accent" />
                      <SelectValue />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {['1', '2', '3', '4'].map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{t('fields.luggage')}</Label>
                <Select value={luggage} onValueChange={setLuggage}>
                  <SelectTrigger>
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-brand-accent" />
                      <SelectValue />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {['0', '1', '2', '3', '4'].map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-brand/10 bg-mist px-4 py-3">
              <Label htmlFor="roundTrip" className="cursor-pointer font-medium">
                {t('fields.roundTrip')}
              </Label>
              <Switch id="roundTrip" checked={roundTrip} onCheckedChange={setRoundTrip} />
            </div>

            {roundTrip && (
              <div className="grid gap-2 animate-slide-in">
                <Label htmlFor="returnTime">Heure de retour</Label>
                <Input
                  id="returnTime"
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="note">{t('fields.note')}</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t('fields.notePlaceholder')}
                rows={3}
              />
            </div>
          </div>

          {/* Résultat */}
          <div className="mt-8 rounded-xl border border-brand/10 bg-mist p-6 text-center">
            {calcLoading && !showResult ? (
              <div className="flex items-center justify-center gap-2 text-ink/70">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('loading')}
              </div>
            ) : calcError ? (
              <p className="text-sm text-red-600">{calcError}</p>
            ) : showResult && result ? (
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-ink/60">
                  {t('estimate')}
                </p>
                <p className="font-display text-5xl font-bold text-brand sm:text-6xl">
                  {formatPriceEUR(result.total)}
                </p>
                <p className="mt-2 text-[12px] italic text-slate-500">{t('allInclusive')}</p>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-[12px] italic text-slate-500">
                  {result.isPackage && <span>({t('tagPackage')})</span>}
                  {result.isPeak && <span>({t('tagPeak')})</span>}
                  {result.isNight && <span>({t('tagNight')})</span>}
                </div>
                <div className="mt-6">
                  <Button size="xl" className="w-full sm:w-auto" onClick={handleReserve} disabled={submitting}>
                    {t('cta')} <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-ink/60">{t('errorAddresses')}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
