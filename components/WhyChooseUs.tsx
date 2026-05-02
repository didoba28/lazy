import { useTranslations } from 'next-intl';
import { Car, Droplets, BatteryCharging, Wifi, Clock } from 'lucide-react';

const ITEMS = [
  { key: 'car', icon: Car, bg: 'bg-brand/8', iconColor: 'text-brand' },
  { key: 'water', icon: Droplets, bg: 'bg-sky-50', iconColor: 'text-sky-600' },
  { key: 'chargers', icon: BatteryCharging, bg: 'bg-amber-50', iconColor: 'text-amber-600' },
  { key: 'wifi', icon: Wifi, bg: 'bg-brand-gold/10', iconColor: 'text-brand-gold' },
  { key: 'punctual', icon: Clock, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
] as const;

export default function WhyChooseUs() {
  const t = useTranslations('why');
  return (
    <section className="bg-white section-pad">
      <div className="container-tight">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-brand sm:text-4xl">{t('title')}</h2>
          <p className="mt-3 text-base text-ink/65">{t('subtitle')}</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
          {ITEMS.map(({ key, icon: Icon, bg, iconColor }) => (
            <div
              key={key}
              className="group flex flex-col gap-3 rounded-2xl border border-brand/8 bg-white p-4 sm:p-5 fancy-shadow transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/16 hover:shadow-[0_12px_36px_-8px_rgb(15_42_71/0.18)]"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div>
                <h3 className="font-display text-[15px] font-semibold leading-snug text-brand">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-ink/60">
                  {t(`items.${key}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
