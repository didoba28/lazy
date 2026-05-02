import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

export default async function ConfirmationPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'reservation.confirmation' });

  return (
    <section className="bg-mist section-pad">
      <div className="container-tight max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-brand sm:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-4 text-base text-ink/75">{t('lead')}</p>
        <p className="mt-1 text-sm text-ink/60">{t('emailSent')}</p>
        <Link
          href={`/${locale}`}
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-medium text-white hover:bg-brand-accent"
        >
          {t('back')} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
