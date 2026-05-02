import { unstable_setRequestLocale } from 'next-intl/server';

export default function CGVPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return (
    <section className="bg-white section-pad">
      <div className="container-tight max-w-3xl prose-page">
        <h1 className="font-display text-3xl font-bold text-brand sm:text-4xl">
          Conditions Générales de Vente
        </h1>
        <p className="mt-3 text-sm italic text-ink/60">
          Modèle à compléter par Tidiane et faire valider par un professionnel du droit avant
          mise en production.
        </p>

        <h2 className="mt-10 font-display text-xl font-semibold text-brand">1. Objet</h2>
        <p className="mt-3 text-ink/80">
          Les présentes CGV régissent les prestations de transport de personnes (VTC) effectuées
          par TKA driver pour ses clients.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-brand">2. Réservation et paiement</h2>
        <p className="mt-3 text-ink/80">
          La réservation s'effectue en ligne via le site. Le paiement est intégral à la
          réservation, par carte bancaire, via la plateforme sécurisée Stripe. La devise est
          l'euro (EUR), toutes taxes comprises.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-brand">3. Tarifs</h2>
        <p className="mt-3 text-ink/80">
          Les tarifs comprennent la prise en charge, les kilomètres parcourus, la durée du trajet
          ainsi que les majorations applicables (heures de pointe, nuit). Les forfaits longue
          distance sont des prix forfaitaires affichés au moment de la réservation. Aucun
          supplément ne s'ajoute en dehors des cas mentionnés (attente prolongée).
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-brand">4. Annulation et remboursement</h2>
        <p className="mt-3 text-ink/80">
          Annulation gratuite jusqu'à 24h avant le trajet. Entre 24h et 6h avant, 50% du montant
          est remboursé. Moins de 6h avant, aucun remboursement n'est effectué. En cas de retard
          de vol justifié, aucun frais ne s'applique.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-brand">5. Attente</h2>
        <p className="mt-3 text-ink/80">
          15 minutes d'attente offertes pour un trajet standard, 60 minutes pour un vol. Au-delà,
          l'attente est facturée 0,50 €/min.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-brand">6. Responsabilité</h2>
        <p className="mt-3 text-ink/80">
          TKA driver met tout en œuvre pour assurer un service ponctuel et sécurisé. La
          responsabilité du transporteur ne saurait être engagée en cas de force majeure
          (intempéries, manifestations, restrictions de circulation imprévisibles).
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-brand">7. Droit applicable</h2>
        <p className="mt-3 text-ink/80">
          Les présentes CGV sont soumises au droit français. Tout litige sera porté devant les
          juridictions compétentes du ressort du siège du prestataire.
        </p>
      </div>
    </section>
  );
}
