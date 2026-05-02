import Link from 'next/link';
import { useLocale, useTranslations, useMessages } from 'next-intl';
import { Phone, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const tc = useTranslations('common');
  const locale = useLocale();
  const messages = useMessages() as any;

  const services: string[] = messages?.footer?.servicesItems ?? [];
  const areas: string[] = messages?.footer?.areasItems ?? [];

  return (
    <footer className="border-t border-brand/10 bg-brand text-white">
      <div className="container-tight py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg font-bold">TKA driver</p>
            <p className="mt-3 text-sm text-white/70">{t('tagline')}</p>
            {/* TODO Tidiane : compléter le numéro EVTC ci-dessous */}
            <p className="mt-4 text-xs text-white/50">{t('evtc')}</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/90">
              {t('services')}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {services.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/90">
              {t('areas')}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {areas.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/90">
              {t('contact')}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>
                <a href={tc('phoneHref')} className="flex items-center gap-2 hover:text-white">
                  <Phone className="h-4 w-4" />
                  {tc('phone')}
                </a>
              </li>
              <li>
                <a href={tc('whatsapp')} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${tc('email')}`} className="flex items-center gap-2 hover:text-white">
                  <Mail className="h-4 w-4" />
                  {tc('email')}
                </a>
              </li>
            </ul>
            <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-white/90">
              {t('legal')}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>
                <Link href={`/${locale}/cgv`} className="hover:text-white">
                  {t('legalLinks.cgv')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/mentions-legales`} className="hover:text-white">
                  {t('legalLinks.mentions')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/politique-confidentialite`} className="hover:text-white">
                  {t('legalLinks.privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          {t('rights')}
        </div>
      </div>
    </footer>
  );
}
