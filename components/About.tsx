import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { BadgeCheck } from 'lucide-react';

export default function About() {
  const t = useTranslations('about');

  return (
    <section id="about" className="bg-white section-pad">
      <div className="container-tight grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="relative mx-auto w-full max-w-sm">
          <div className="aspect-square overflow-hidden rounded-2xl border border-brand/10 bg-mist fancy-shadow">
            <div className="relative h-full w-full">
              <Image
                src="/Tidiane photo.jpeg"
                alt="Tidiane Kane — Fondateur KT Chauffeur"
                fill
                className="object-cover object-top"
                priority
              />
              <div className="absolute inset-0 flex items-end bg-[linear-gradient(180deg,transparent_55%,rgba(15,42,71,0.65)_100%)]">
                <div className="p-5 text-white">
                  <p className="font-display text-xl font-semibold">Tidiane Kane</p>
                  <p className="text-sm text-white/85">Fondateur · Chauffeur</p>
                </div>
              </div>
            </div>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            <li className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-xs font-medium text-brand">
              <BadgeCheck className="h-3.5 w-3.5 text-brand-accent" />
              {t('badges.license')}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-xs font-medium text-brand">
              <BadgeCheck className="h-3.5 w-3.5 text-brand-accent" />
              {t('badges.card')}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-xs font-medium text-brand">
              <BadgeCheck className="h-3.5 w-3.5 text-brand-accent" />
              {t('badges.insurance')}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-3xl font-bold text-brand sm:text-4xl">{t('title')}</h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-ink/80">
            <p>{t('p1')}</p>
            <p>{t('p2')}</p>
            <p>{t('p3')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
