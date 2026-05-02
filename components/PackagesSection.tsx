'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Plane, FerrisWheel, Waves, Building2, Wine, Flag, ArrowRight, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { PACKAGES } from '@/lib/packages';
import { formatPriceEUR } from '@/lib/utils';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  plane: Plane,
  ferris: FerrisWheel,
  beach: Waves,
  city: Building2,
  wine: Wine,
  flag: Flag,
};

export default function PackagesSection() {
  const t = useTranslations('packages');
  const locale = useLocale();
  const router = useRouter();

  function reserve(pkg: (typeof PACKAGES)[number]) {
    const params = new URLSearchParams({
      from: 'Paris',
      to: t(`items.${pkg.toLabelKey}` as any).replace(/^Paris\s*→\s*/, ''),
      date: new Date().toISOString().slice(0, 10),
      time: '12:00',
      passengers: '2',
      luggage: '1',
      roundTrip: '0',
      note: '',
      price: String(pkg.price),
      distance: '',
      duration: '',
      isPackage: '1',
      packageId: pkg.id,
    });
    router.push(`/${locale}/reservation/creneaux?${params.toString()}`);
  }

  return (
    <section id="forfaits" className="bg-mist section-pad overflow-hidden">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-brand sm:text-4xl">{t('title')}</h2>
          <p className="mt-3 text-base text-ink/65">{t('subtitle')}</p>
        </div>

        {/* Mobile: horizontal scroll | Desktop: grid */}
        <div className="mt-10 scroll-x -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {PACKAGES.map((pkg) => {
            const Icon = ICONS[pkg.icon] ?? Plane;
            return (
              <div
                key={pkg.id}
                className="group w-[72vw] max-w-[260px] md:w-auto md:max-w-none flex flex-col rounded-2xl border border-brand/10 bg-white p-5 fancy-shadow transition-all duration-200 hover:-translate-y-1 hover:border-brand-accent/25 hover:shadow-[0_16px_40px_-8px_rgb(15_42_71/0.2)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/8 text-brand group-hover:bg-brand group-hover:text-white transition-colors duration-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-ink/45">
                    <Clock className="h-3 w-3" />
                    {pkg.duration}
                  </div>
                </div>
                <h3 className="mt-4 font-display text-base font-semibold leading-snug text-brand">
                  {t(`items.${pkg.toLabelKey}` as any)}
                </h3>
                <p className="mt-2 text-sm text-ink/55">{t('from')}</p>
                <p className="font-display text-2xl font-bold text-brand">
                  {formatPriceEUR(pkg.price)}
                </p>
                <Button
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => reserve(pkg)}
                >
                  {t('cta')} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
