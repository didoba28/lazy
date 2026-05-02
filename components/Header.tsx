'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Phone, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import LanguageSwitcher from './LanguageSwitcher';
import { cn } from '@/lib/utils';

export default function Header() {
  const t = useTranslations('header');
  const tc = useTranslations('common');
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#simulateur', label: t('nav.simulator') },
    { href: '#forfaits', label: t('nav.packages') },
    { href: '#about', label: t('nav.about') },
    { href: '#avis', label: t('nav.reviews') },
    { href: '#faq', label: t('nav.faq') },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-transparent bg-white/85 backdrop-blur transition-all',
        scrolled && 'border-brand/10 shadow-sm',
      )}
    >
      <div className="container-tight flex h-16 items-center justify-between gap-4">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="font-display text-lg font-bold tracking-tight text-brand">
            TKA <span className="font-medium text-brand-accent">driver</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-ink hover:text-brand">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={tc('phoneHref')}
            className="flex items-center gap-1.5 text-sm font-medium text-brand-accent hover:text-brand"
          >
            <Phone className="h-4 w-4" />
            {tc('phone')}
          </a>
          <LanguageSwitcher />
          <Button asChild size="sm">
            <a href="#simulateur">{t('cta')}</a>
          </Button>
        </div>

        <button
          aria-label="Menu"
          className="rounded-md border border-brand/10 p-2 text-brand md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-brand/10 bg-white md:hidden">
          <div className="container-tight flex flex-col gap-3 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-ink hover:bg-mist"
              >
                {l.label}
              </a>
            ))}
            <a
              href={tc('phoneHref')}
              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-brand-accent"
            >
              <Phone className="h-4 w-4" />
              {tc('phone')}
            </a>
            <div className="flex items-center justify-between gap-3">
              <LanguageSwitcher />
              <Button asChild size="sm" className="flex-1">
                <a href="#simulateur" onClick={() => setOpen(false)}>
                  {t('cta')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
