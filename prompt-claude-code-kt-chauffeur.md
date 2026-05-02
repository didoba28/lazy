# 🚗 PROMPT CLAUDE CODE — LANDING PAGE "KT CHAUFFEUR PRIVÉ"

> Copie-colle ce prompt entier dans Claude Code (terminal) après avoir créé un dossier vide `kt-chauffeur-prive/` et lancé `claude` dedans.

---

## 📋 BRIEF COMPLET

Tu vas développer une landing page professionnelle, moderne et conversionnelle pour **KT Chauffeur Privé**, service VTC tenu par Tidiane Kane à Paris. L'objectif principal : **maximiser les réservations et les appels**.

### 🎯 Objectif business
Un visiteur doit pouvoir, en moins de 60 secondes :
1. Comprendre l'offre (chauffeur privé pro, dispo, fiable)
2. Simuler le prix de son trajet
3. Réserver et payer en ligne (ou appeler/WhatsApp directement)

---

## 🛠️ STACK TECHNIQUE

- **Framework** : Next.js 14 (App Router) + TypeScript
- **Styling** : Tailwind CSS + shadcn/ui pour les composants
- **Carte/Distance** : Mapbox GL JS + Mapbox Directions API (free tier 100k req/mois) avec autocomplétion d'adresses françaises
- **Calendrier** : Cal.com embed (pas Calendly — meilleure intégration Stripe)
- **Paiement** : Stripe Checkout (mode `payment`, devise EUR, paiement 100% à la réservation)
- **i18n** : next-intl (FR par défaut, EN secondaire)
- **Déploiement cible** : Vercel
- **Formulaires** : React Hook Form + Zod
- **Animations** : Framer Motion (légères, pas tape-à-l'œil)
- **Icônes** : Lucide React

---

## 🎨 IDENTITÉ VISUELLE

**Nom** : KT Chauffeur Privé
**Baseline suggérée** : *"Votre chauffeur privé à Paris, où vous voulez, quand vous voulez."*

**Palette couleurs** :
- Primaire : Bleu marine `#0F2A47` (couleur dominante, headers, CTA secondaires)
- Accent : Bleu marine plus clair `#1E4976` (hover, liens)
- Gris foncé : `#2D3748` (textes principaux)
- Gris clair : `#F7FAFC` (backgrounds sections)
- Or discret : `#C9A961` (uniquement pour détails premium, étoiles avis)
- Blanc : `#FFFFFF`
- Vert WhatsApp : `#25D366` (uniquement bouton WhatsApp)

**Typographie** :
- Headings : `Inter` ou `Plus Jakarta Sans` (700)
- Body : `Inter` (400/500)
- Pas de fioritures, ton pro mais amical

**Style** : élégant, épuré, rassurant. **Pas de néon, pas de gradients criards, pas d'emojis dans les titres.** Un VTC haut de gamme abordable.

---

## 📐 ARCHITECTURE DU SITE (single page + pages annexes)

```
kt-chauffeur-prive/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                 # Landing principale
│   │   ├── reservation/
│   │   │   ├── creneaux/page.tsx    # Choix créneau Cal.com
│   │   │   ├── confirmation/page.tsx # Page après Stripe success
│   │   │   └── annulation/page.tsx   # Page après Stripe cancel
│   │   ├── mentions-legales/page.tsx
│   │   ├── cgv/page.tsx
│   │   └── politique-confidentialite/page.tsx
│   ├── api/
│   │   ├── checkout/route.ts        # Création session Stripe
│   │   ├── webhook/route.ts         # Webhook Stripe
│   │   └── distance/route.ts        # Proxy Mapbox (cache les clés)
├── components/
│   ├── Hero.tsx
│   ├── PriceSimulator.tsx           # ⭐ Composant central
│   ├── WhyChooseUs.tsx
│   ├── Testimonials.tsx
│   ├── About.tsx
│   ├── FAQ.tsx
│   ├── PackagesSection.tsx
│   ├── Footer.tsx
│   ├── WhatsAppFloatingButton.tsx
│   ├── LanguageSwitcher.tsx
│   └── ui/ (shadcn)
├── lib/
│   ├── pricing.ts                   # ⭐ Logique de calcul tarif
│   ├── packages.ts                  # Forfaits longue distance
│   ├── stripe.ts
│   └── mapbox.ts
├── messages/
│   ├── fr.json
│   └── en.json
└── public/
    ├── tidiane-hero.jpg             # Photo bureau (taille modérée)
    ├── tidiane-about.jpg            # Photo À propos
    └── corolla.png                  # Photo véhicule (fournie par Tidiane)
```

---

## 🏠 SECTIONS DE LA LANDING PAGE (ordre exact)

### 1. **Header / Navbar** (sticky)
- Logo "KT Chauffeur Privé" à gauche
- Liens : Simulateur · Forfaits · À propos · Avis · FAQ
- À droite : `📞 06 76 63 66 47` (clic-to-call) + sélecteur langue FR/EN
- CTA principal "Réserver" (bouton bleu marine)

### 2. **Hero**
- **Background** : photo Tidiane en costume (fournie : `tidiane-hero.jpg`) — placée à droite en taille modérée (max ~400px largeur sur desktop, pas plein écran). Côté gauche : texte.
- **Titre H1** : "Votre chauffeur privé à Paris, où vous voulez, quand vous voulez."
- **Sous-titre** : "Aéroports, gares, événements, longues distances. Réservation en ligne, paiement sécurisé, ponctualité garantie."
- **2 CTA** :
  - Bouton primaire : **"Simuler mon trajet"** (scroll vers simulateur)
  - Bouton secondaire (téléphone) : **"📞 06 76 63 66 47"**
- **Trust badges** sous les CTA : ⭐ 4,9/5 · 🚗 +500 trajets · ✅ Paiement sécurisé · 🕒 Ponctualité garantie

### 3. **Simulateur de prix** ⭐ (LE CŒUR DU SITE)

**Composant `PriceSimulator.tsx` — comportement détaillé :**

#### Champs du formulaire :
1. **Adresse de départ** (autocomplétion Mapbox, biaisée France)
2. **Adresse d'arrivée** (autocomplétion Mapbox)
3. **Date** (date picker, pas de date dans le passé)
4. **Heure** (sélecteur 24h)
5. **Nombre de passagers** (1 à 4 — Toyota Corolla)
6. **Nombre de bagages** (info uniquement, pas de surcoût)
7. **Trajet aller-retour ?** (toggle, multiplie x2)
8. **Note pour le chauffeur** (textarea optionnel)

#### Logique de calcul (`lib/pricing.ts`) :

```typescript
// CONSTANTES TARIFAIRES (modifiables facilement)
export const PRICING = {
  PRISE_EN_CHARGE: 5,        // €
  TARIF_KM: 2,                // €/km
  TARIF_MINUTE: 0.35,         // €/min
  MAJORATION_HEURE_POINTE: 0.20, // +20%
  MAJORATION_NUIT: 0.15,      // +15%
  PRIX_MINIMUM: 25,           // course minimum
};

// HEURES DE POINTE : 7h-10h ET 17h-20h
// NUIT : 22h-6h

export function calculatePrice({
  distanceKm,
  durationMin,
  pickupDateTime,
  isRoundTrip
}: TripParams): PriceResult {
  // 1. Vérifier si forfait longue distance applicable (priorité)
  const packagePrice = checkPackage(origin, destination);
  if (packagePrice) return { total: packagePrice, isPackage: true };
  
  // 2. Calcul standard
  const base = PRICING.PRISE_EN_CHARGE 
             + (distanceKm * PRICING.TARIF_KM) 
             + (durationMin * PRICING.TARIF_MINUTE);
  
  // 3. Appliquer majorations
  let total = base;
  const hour = pickupDateTime.getHours();
  
  if ((hour >= 7 && hour < 10) || (hour >= 17 && hour < 20)) {
    total *= (1 + PRICING.MAJORATION_HEURE_POINTE);
  }
  if (hour >= 22 || hour < 6) {
    total *= (1 + PRICING.MAJORATION_NUIT);
  }
  
  // 4. Aller-retour
  if (isRoundTrip) total *= 2;
  
  // 5. Prix minimum
  total = Math.max(total, PRICING.PRIX_MINIMUM);
  
  // 6. Arrondir au demi-euro supérieur (ex: 47,32€ → 47,50€)
  total = Math.ceil(total * 2) / 2;
  
  return { total, isPackage: false };
}
```

#### Affichage du résultat :
- **Gros prix en bleu marine** : "Estimation : **65 €**"
- **Sous le prix, en italique gris très petit (12px)** : *"Toutes taxes et prise en charge incluses."*
- ⚠️ **NE JAMAIS détailler les composantes du prix au client** (pas de "5€ prise en charge + 30€ km..."). C'est tout inclus, point.
- Si majoration appliquée, juste indiquer discrètement : *"(tarif heure de pointe)"* ou *"(tarif nuit)"* en italique.
- Bouton CTA géant : **"Réserver ce trajet →"** qui mène à `/reservation/creneaux?tripData=...`

#### UX :
- Calcul automatique en temps réel dès que origine + destination + date+heure sont remplis
- Loader pendant l'appel Mapbox
- Si erreur Mapbox → fallback "Contactez-nous au 06 76 63 66 47 pour un devis"
- Mobile-first : tous les champs empilés, gros boutons, clavier numérique pour heure

### 4. **Forfaits longue distance** (`PackagesSection.tsx`)

Cards avec 8 forfaits prédéfinis. Données dans `lib/packages.ts` :

```typescript
export const PACKAGES = [
  { id: 'cdg', from: 'Paris', to: 'CDG', price: 65, duration: '40 min', icon: '✈️' },
  { id: 'orly', from: 'Paris', to: 'Orly', price: 55, duration: '30 min', icon: '✈️' },
  { id: 'beauvais', from: 'Paris', to: 'Beauvais', price: 130, duration: '1h15', icon: '✈️' },
  { id: 'disney', from: 'Paris', to: 'Disneyland', price: 75, duration: '45 min', icon: '🎡' },
  { id: 'deauville', from: 'Paris', to: 'Deauville', price: 280, duration: '2h15', icon: '🏖️' },
  { id: 'lille', from: 'Paris', to: 'Lille', price: 350, duration: '2h30', icon: '🏙️' },
  { id: 'reims', from: 'Paris', to: 'Reims', price: 250, duration: '1h45', icon: '🍾' },
  { id: 'bruxelles', from: 'Paris', to: 'Bruxelles', price: 600, duration: '3h30', icon: '🇧🇪' },
];
```

**Important** : Au-dessus des cards, mettre un commentaire `{/* Prix ajustables : modifier lib/packages.ts */}` pour que Tidiane puisse facilement les changer.

Chaque card : icône, "Paris → CDG", "À partir de **65€**", durée estimée, bouton "Réserver".

### 5. **Pourquoi nous choisir** (`WhyChooseUs.tsx`)

Grille 6 cards avec icônes Lucide :
1. 🚗 **Toyota Corolla 2021** récente, propre, climatisée
2. 💧 **Bouteille d'eau offerte** à chaque trajet
3. 🔌 **Chargeurs USB iPhone & Android** disponibles
4. 📶 **Wifi à bord** gratuit
5. 👶 **Siège enfant sur demande** (à préciser à la réservation)
6. ⏱️ **Ponctualité garantie** ou geste commercial

### 6. **Avis clients** (`Testimonials.tsx`)
- 6 témoignages crédibles avec prénom + initiale + ville (générer du contenu réaliste)
- ⭐ 4,9/5 visible
- Format carousel sur mobile, grille 3x2 sur desktop
- **TODO comment** dans le code : "Remplacer par de vrais avis Google Business une fois récoltés"

### 7. **À propos de Tidiane** (`About.tsx`)
- Photo de Tidiane (fournie : `tidiane-about.jpg`) à gauche, texte à droite
- Texte court (3 paragraphes) : présentation, expérience, philosophie service
- Sous la photo : badges "Permis B+", "Carte VTC", "Assurance professionnelle"

### 8. **FAQ** (`FAQ.tsx`)
Accordéon avec 8 questions essentielles :
1. Comment réserver ?
2. Quels sont les modes de paiement ?
3. Puis-je annuler ma réservation ?
4. Combien de bagages puis-je emporter ?
5. Que se passe-t-il si mon vol a du retard ?
6. Le chauffeur attend-il en cas de retard ?
7. Y a-t-il un siège enfant disponible ?
8. Couvrez-vous les longues distances et l'international ?

**Politique d'annulation** (réponse Q3) :
> "Annulation gratuite jusqu'à 24h avant le trajet. Entre 24h et 6h avant, 50% du montant remboursé. Moins de 6h avant, le montant n'est pas remboursable. En cas de retard de vol, aucun frais ne s'applique."

### 9. **Footer**
- Logo + baseline
- Colonnes : Services · Zones desservies · Légal (CGV, mentions légales, politique confidentialité)
- Contact : 📞 06 76 63 66 47 · WhatsApp · email
- N° EVTC : `[À COMPLÉTER PAR TIDIANE]` (commentaire HTML clair)
- Mention "© 2026 KT Chauffeur Privé. Tous droits réservés."

### 10. **Bouton WhatsApp flottant**
- Icône WhatsApp en bas à droite (vert #25D366)
- Lien : `https://wa.me/33676636647?text=Bonjour%2C%20je%20souhaite%20une%20information%20sur%20vos%20services`
- Visible sur toutes les pages, animation pulse douce

---

## 💳 FLOW DE RÉSERVATION COMPLET

```
[Landing] 
    ↓ Le client remplit le simulateur
    ↓ Voit "Estimation : 65€"
    ↓ Clique "Réserver ce trajet"
    ↓ 
[/reservation/creneaux?data=...]  
    ↓ Récap du trajet en haut (départ, arrivée, date, prix)
    ↓ Embed Cal.com en dessous
    ↓ Le client choisit un créneau
    ↓ Cal.com déclenche un webhook → on crée une session Stripe
    ↓
[Stripe Checkout]
    ↓ Le client paie 100% du montant
    ↓ Si succès → redirect /reservation/confirmation
    ↓ Si annulation → redirect /reservation/annulation
    ↓
[/reservation/confirmation]
    ↓ "Merci ! Votre réservation est confirmée."
    ↓ Récap complet du trajet
    ↓ "Tidiane vous contactera 30 min avant le départ."
    ↓ Email de confirmation envoyé (Resend ou Nodemailer)
    ↓ SMS de notification à Tidiane (Twilio en option)
```

### Détails Stripe :
- Mode `payment` (one-shot, pas subscription)
- Métadonnées Stripe : trajet, client_email, client_phone, datetime, distance
- Webhook : sur `payment_intent.succeeded` → email confirmation client + email/SMS à Tidiane
- Devise : EUR
- Description Stripe : "KT Chauffeur Privé — [Origine] → [Destination] le [Date]"

### Variables d'environnement (`.env.local`) :
```bash
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx
MAPBOX_SECRET_TOKEN=sk.xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_CAL_USERNAME=kt-chauffeur-prive
NEXT_PUBLIC_SITE_URL=https://kt-chauffeur.fr
RESEND_API_KEY=re_xxx
NOTIFICATION_EMAIL=tidiane@example.com
NOTIFICATION_PHONE=+33676636647
```

---

## 🌍 INTERNATIONALISATION (i18n)

- Toutes les strings dans `messages/fr.json` et `messages/en.json`
- Switcher de langue dans le header (drapeau ou texte FR | EN)
- URLs : `/fr/...` et `/en/...`
- SEO : `<html lang>` dynamique, balises hreflang

---

## 🔍 SEO

- **Meta title** : "KT Chauffeur Privé — VTC Paris, Aéroports CDG/Orly, Longues distances"
- **Meta description** : "Service de chauffeur privé professionnel à Paris et en Île-de-France. Réservation en ligne, paiement sécurisé, ponctualité garantie. Aéroports, gares, événements."
- **Schema.org** : `LocalBusiness` + `TaxiService`
- **Open Graph** : image avec le logo + Toyota Corolla
- **Sitemap.xml** + **robots.txt** générés automatiquement
- **Mots-clés à intégrer naturellement** : VTC Paris, chauffeur privé Paris, taxi CDG, taxi Orly, chauffeur aéroport Paris

---

## 📱 RESPONSIVE & PERFORMANCE

- **Mobile-first absolu** (la majorité des réservations VTC se font sur mobile)
- Score Lighthouse cible : **>90 sur tous les axes**
- Images : `next/image` avec lazy loading et formats AVIF/WebP
- Police : `next/font` avec preload
- Pas de bibliothèque lourde inutile (pas de Material UI, etc.)

---

## ✅ CHECKLIST DE LIVRAISON

Une fois le code terminé, le projet doit fournir :

1. ✅ Landing page complète et responsive
2. ✅ Simulateur fonctionnel avec calcul exact
3. ✅ Forfaits longue distance affichés
4. ✅ Tunnel réservation Cal.com → Stripe complet
5. ✅ Webhook Stripe + emails de confirmation
6. ✅ FR + EN
7. ✅ SEO de base (meta, sitemap, schema)
8. ✅ Page mentions légales / CGV / politique confidentialité (templates à compléter)
9. ✅ README.md détaillé avec :
   - Comment lancer en local (`npm install`, `npm run dev`)
   - Comment configurer les variables d'env (étape par étape)
   - Comment obtenir les clés Mapbox / Stripe / Cal.com (liens directs)
   - Comment déployer sur Vercel (one-click si possible)
   - Comment modifier les tarifs (`lib/pricing.ts`)
   - Comment modifier les forfaits (`lib/packages.ts`)
   - Comment ajouter de vrais avis clients
10. ✅ `.env.example` complet et commenté

---

## 🚀 COMMANDES À EXÉCUTER

Démarre par :
```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias "@/*"
```

Puis installe :
```bash
npm install @stripe/stripe-js stripe mapbox-gl @types/mapbox-gl react-hook-form @hookform/resolvers zod next-intl framer-motion lucide-react resend date-fns
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input label card accordion dialog form select toast
```

---

## 💡 NOTES IMPORTANTES POUR TOI, CLAUDE CODE

1. **Le prix de prise en charge (5€) ne doit JAMAIS être affiché en grand** — il est intégré dans le total, c'est tout. Mention en italique petit gris uniquement si vraiment nécessaire dans les CGV.
2. **L'objectif numéro 1 est la conversion**. Chaque section doit pousser à l'action (réserver ou appeler).
3. **Ton** : pro mais chaleureux. "Vous" toujours. Pas de jargon. Phrases courtes.
4. **Trust signals partout** : avis, paiement sécurisé, ponctualité, photo de Tidiane.
5. **Mobile** > Desktop : optimise d'abord pour iPhone/Android.
6. Si tu as un doute sur une décision design ou tech, **prends le choix le plus simple et le plus testé**. Pas d'expérimentation.
7. **Commits Git** : structure ton travail en commits clairs au fur et à mesure (`feat: add price simulator`, `feat: integrate stripe checkout`, etc.)
8. À la fin, lance `npm run build` pour valider qu'il n'y a aucune erreur.

---

## 🎬 GO !

Démarre maintenant. Crée d'abord la structure du projet, puis attaque section par section dans l'ordre listé. Demande-moi des précisions seulement si quelque chose est vraiment ambigu — sinon, prends les meilleures décisions par défaut et avance.

À la fin, fais-moi un récap de ce qui a été fait et de ce qu'il reste à configurer côté Tidiane (clés API à obtenir, contenus à remplacer, etc.).
