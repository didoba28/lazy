import { unstable_setRequestLocale } from 'next-intl/server';
import Hero from '@/components/Hero';
import PriceSimulator from '@/components/PriceSimulator';
import PackagesSection from '@/components/PackagesSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import ReviewForm from '@/components/ReviewForm';
import About from '@/components/About';
import FAQ from '@/components/FAQ';

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return (
    <>
      <Hero />
      <PriceSimulator />
      <PackagesSection />
      <WhyChooseUs />
      <Testimonials />
      <ReviewForm />
      <About />
      <FAQ />
    </>
  );
}
