import { unstable_setRequestLocale } from 'next-intl/server';

export default function PolitiqueConfidentialitePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return (
    <section className="bg-white section-pad">
      <div className="container-tight max-w-3xl prose-page">
        <h1 className="font-display text-3xl font-bold text-brand sm:text-4xl">
          Politique de confidentialité
        </h1>
        <p className="mt-3 text-sm italic text-ink/60">
          Modèle à compléter et faire valider avant publication.
        </p>

        <h2 className="mt-10 font-display text-xl font-semibold text-brand">Données collectées</h2>
        <p className="mt-3 text-ink/80">
          Lors d'une réservation, nous collectons : nom, prénom, email, téléphone, adresses de
          départ et d'arrivée, date et heure souhaitées, et toute note ajoutée. Le paiement est
          traité par Stripe ; nous ne stockons jamais les données de carte bancaire.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-brand">Finalité</h2>
        <p className="mt-3 text-ink/80">
          Ces données sont utilisées uniquement pour exécuter la prestation de transport et pour
          vous contacter le jour J. Elles ne sont ni revendues, ni utilisées à des fins
          marketing sans consentement explicite.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-brand">Sous-traitants</h2>
        <p className="mt-3 text-ink/80">
          Stripe (paiement), Resend (envoi d'emails transactionnels), Vercel (hébergement),
          Mapbox (calcul d'itinéraire). Tous sont conformes au RGPD.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-brand">Durée de conservation</h2>
        <p className="mt-3 text-ink/80">
          Les données de réservation sont conservées 3 ans à compter de la dernière course, puis
          archivées pour les obligations comptables (10 ans).
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-brand">Vos droits</h2>
        <p className="mt-3 text-ink/80">
          Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'opposition
          et de suppression de vos données. Pour les exercer, écrivez à
          contact@tka-driver.fr.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-brand">Cookies</h2>
        <p className="mt-3 text-ink/80">
          Le site utilise uniquement des cookies techniques nécessaires à son fonctionnement.
          Aucun cookie publicitaire n'est déposé.
        </p>
      </div>
    </section>
  );
}
