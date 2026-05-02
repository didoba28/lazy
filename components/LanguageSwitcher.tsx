'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { locales } from '@/i18n';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: string) {
    if (next === locale) return;
    // Remplace le préfixe locale dans l'URL
    const segments = pathname.split('/');
    if (locales.includes(segments[1] as (typeof locales)[number])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    router.push(segments.join('/') || `/${next}`);
  }

  return (
    <div className="flex items-center gap-1 rounded-md border border-brand/10 bg-white p-0.5 text-xs">
      <Globe className="ml-1 h-3.5 w-3.5 text-brand-accent" />
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={cn(
            'rounded px-2 py-1 font-medium uppercase transition-colors',
            l === locale ? 'bg-brand text-white' : 'text-ink hover:bg-mist',
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
