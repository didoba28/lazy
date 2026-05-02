import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isFr = locale === 'fr';
  const title = isFr
    ? 'TKA driver — VTC Paris, Aéroports CDG/Orly, Longues distances'
    : 'TKA driver — Private Driver in Paris, CDG/Orly Airports';
  const description = isFr
    ? "Service de chauffeur privé professionnel à Paris et en Île-de-France. Réservation en ligne, paiement sécurisé, ponctualité garantie. Aéroports, gares, événements."
    : 'Professional private chauffeur in Paris and Île-de-France. Online booking, secure payment, guaranteed punctuality. Airports, stations, events.';

  return {
    title,
    description,
    keywords: [
      'VTC Paris',
      'chauffeur privé Paris',
      'taxi CDG',
      'taxi Orly',
      'chauffeur aéroport Paris',
      'private driver Paris',
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: '/fr',
        en: '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: isFr ? 'fr_FR' : 'en_US',
      url: `/${locale}`,
      title,
      description,
      siteName: 'TKA driver',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as (typeof locales)[number])) notFound();

  unstable_setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'common' });

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tka-driver.fr'}#business`,
        name: 'TKA driver',
        image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tka-driver.fr'}/og.jpg`,
        telephone: t('phoneE164'),
        email: t('email'),
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Paris',
          addressCountry: 'FR',
        },
        priceRange: '€€',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://tka-driver.fr',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '127',
        },
      },
      {
        '@type': 'TaxiService',
        provider: { '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tka-driver.fr'}#business` },
        areaServed: ['Paris', 'Île-de-France'],
        serviceType: 'Private chauffeur service (VTC)',
      },
    ],
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
      </div>
    </NextIntlClientProvider>
  );
}
