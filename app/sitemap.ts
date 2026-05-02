import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://tka-driver.fr';
  const now = new Date();
  const locales = ['fr', 'en'];
  const paths = [
    '',
    '/cgv',
    '/mentions-legales',
    '/politique-confidentialite',
  ];
  return locales.flatMap((l) =>
    paths.map((p) => ({
      url: `${base}/${l}${p}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: p === '' ? 1 : 0.5,
    })),
  );
}
