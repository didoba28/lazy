'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Phone, Star, Car, ShieldCheck, Clock } from 'lucide-react';
import { Button } from './ui/button';

const TRUST = [
  { icon: Star, key: 'rating', color: 'text-brand-gold' },
  { icon: Car, key: 'trips', color: 'text-brand-accent' },
  { icon: ShieldCheck, key: 'payment', color: 'text-brand-accent' },
  { icon: Clock, key: 'punctuality', color: 'text-brand-accent' },
] as const;

export default function Hero() {
  const t = useTranslations('hero');
  const tc = useTranslations('common');

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Gradient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 gradient-blob" />
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-brand-gold/5 blur-3xl" />

      <div className="container-tight grid items-center gap-8 py-14 sm:py-18 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14 lg:py-24">

        {/* Left — text content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/12 bg-brand/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-accent">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-gold" />
              VTC Paris · Île-de-France
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-brand sm:text-5xl lg:text-[3.4rem]"
          >
            {t('h1')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-xl text-base leading-relaxed text-ink/65 sm:text-lg"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="xl">
              <a href="#simulateur">{t('ctaPrimary')}</a>
            </Button>
            <Button asChild variant="outline" size="xl">
              <a href={tc('phoneHref')}>
                <Phone className="h-5 w-5" />
                {t('ctaSecondary')}
              </a>
            </Button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5 text-sm text-ink/75"
          >
            {TRUST.map(({ icon: Icon, key, color }) => (
              <li key={key} className="flex items-center gap-1.5">
                <Icon className={`h-4 w-4 ${color}`} />
                {t(`trust.${key}`)}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Right — car image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-sm lg:max-w-md"
        >
          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -left-4 -top-4 z-10 hidden sm:block"
          >
            <div className="glass rounded-2xl px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-brand-gold text-brand-gold" />
                <span className="text-sm font-bold text-brand">{t('trust.rating')}</span>
                <span className="text-xs text-ink/50">· {t('trust.trips')}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="aspect-[4/3] overflow-hidden rounded-2xl fancy-shadow"
          >
            <div className="relative h-full w-full bg-white">
              <Image
                src="/NV.png"
                alt="Toyota Corolla 2021 — KT Chauffeur"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand/75 to-transparent px-5 pb-4 pt-10">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">Votre véhicule</p>
                <p className="font-display text-xl font-bold text-white">Toyota Corolla 2021</p>
                <p className="mt-0.5 text-sm text-white/80">Berline · Climatisée · Wifi</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
