import { useTranslations, useMessages } from 'next-intl';
import { Star } from 'lucide-react';

type Item = { name: string; city: string; text: string };

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const messages = useMessages() as any;
  const items: Item[] = messages?.testimonials?.items ?? [];

  return (
    <section id="avis" className="bg-mist section-pad overflow-hidden">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-brand sm:text-4xl">{t('title')}</h2>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-ink/70">
            <div className="flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" />
              ))}
            </div>
            <span>{t('subtitle')}</span>
          </div>
        </div>

        {/* Mobile: horizontal scroll | Desktop: grid */}
        <div className="mt-10 scroll-x -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {items.map((item, i) => (
            <figure
              key={i}
              className="w-[82vw] max-w-[320px] md:w-auto md:max-w-none flex flex-col gap-3 rounded-2xl border border-brand/8 bg-white p-5 fancy-shadow"
            >
              <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-ink/80">
                « {item.text} »
              </blockquote>
              <figcaption className="flex items-center gap-2.5 border-t border-brand/6 pt-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand">{item.name}</p>
                  <p className="text-xs text-ink/50">{item.city}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
