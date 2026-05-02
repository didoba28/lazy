import { unstable_setRequestLocale } from 'next-intl/server';

export default function MentionsLegalesPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return (
    <section className="bg-white section-pad">
      <div className="container-tight max-w-3xl prose-page">
        <h1 className="font-display text-3xl font-bold text-brand sm:text-4xl">Mentions légales</h1>
        <p className="mt-3 text-sm italic text-ink/60">
          Modèle à compléter par Tidiane avec les informations exactes (n° SIRET, adresse, etc.).
        </p>

        <h2 className="mt-10 font-display text-xl font-semibold text-brand">Éditeur du site</h2>
        <p className="mt-3 text-ink/80">
          TKA driver — entreprise individuelle gérée par M. Tidiane Kane.
          <br />
          Adresse : [à compléter]
          <br />
          SIRET : [à compléter]
          <br />
          N° EVTC : [à compléter]
          <br />
          Téléphone : 06 76 63 66 47
          <br />
          Email : contact@tka-driver.fr
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-brand">Hébergement</h2>
        <p className="mt-3 text-ink/80">
          Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-brand">Propriété intellectuelle</h2>
        <p className="mt-3 text-ink/80">
          L'ensemble des contenus présents sur ce site (textes, images, logos) est protégé par le
          droit de la propriété intellectuelle. Toute reproduction sans autorisation préalable est
          interdite.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-brand">Contact</h2>
        <p className="mt-3 text-ink/80">
          Pour toute question, contactez-nous à contact@tka-driver.fr.
        </p>
      </div>
    </section>
  );
}
