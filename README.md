# KT Chauffeur Privé — Landing page

Site Next.js 14 + Tailwind pour le service VTC de Tidiane Kane.

> Stack : Next.js 14 (App Router) · TypeScript · Tailwind · next-intl (FR/EN)
> Mapbox (autocomplete + Directions) · Stripe Checkout · Resend · React Hook Form + Zod

---

## 🏃 Lancer en local

```bash
npm install
cp .env.example .env.local       # puis remplir les vraies clés
npm run dev                      # http://localhost:3000
```

> Le site redirige automatiquement `/` → `/fr`. La version anglaise est sur `/en`.

---

## 🔑 Variables d'environnement (`.env.local`)

Toutes les clés sont à mettre dans `.env.local` (jamais commit). Voir `.env.example`.

### Mapbox — autocomplete + calcul de distance
1. Créer un compte sur https://account.mapbox.com/
2. Aller sur https://account.mapbox.com/access-tokens/
3. Copier le **Default public token** (commence par `pk.`)
4. Optionnel : créer un token serveur restreint avec scope `directions:read`
5. Variables :
   - `NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...`
   - `MAPBOX_SECRET_TOKEN=pk.eyJ1...` (peut être le même que le public au départ)

> Le free tier Mapbox couvre 100k requêtes / mois — largement suffisant.

### Stripe — paiement
1. Créer un compte sur https://dashboard.stripe.com/register
2. Récupérer les clés sur https://dashboard.stripe.com/test/apikeys
3. Renseigner :
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`
   - `STRIPE_SECRET_KEY=sk_test_...`
4. Webhook (pour les emails de confirmation) :
   - En local : `stripe listen --forward-to localhost:3000/api/webhook` puis copier le `whsec_...`
   - En prod : créer un endpoint `https://tka-driver.fr/api/webhook` sur https://dashboard.stripe.com/webhooks et écouter `checkout.session.completed`
   - Renseigner `STRIPE_WEBHOOK_SECRET=whsec_...`

### Resend — emails de confirmation
1. Créer un compte sur https://resend.com/
2. Vérifier le domaine d'envoi (DNS) sur https://resend.com/domains
3. Récupérer la clé sur https://resend.com/api-keys
4. Variables :
   - `RESEND_API_KEY=re_...`
   - `EMAIL_FROM=reservations@tka-driver.fr` (doit être sur le domaine vérifié)
   - `NOTIFICATION_EMAIL=tidiane@example.com` (où Tidiane reçoit les nouvelles résas)

### Cal.com — choix de créneau (optionnel)
- Si vide, le créneau choisi dans le simulateur est utilisé tel quel.
- Sinon, l'embed Cal.com est ajouté à la page `/reservation/creneaux` en plus du formulaire.
- Variable : `NEXT_PUBLIC_CAL_USERNAME=tka-driver`

### Site
- `NEXT_PUBLIC_SITE_URL=https://tka-driver.fr` — utilisée pour le sitemap, l'OG et les redirects Stripe.

---

## 🚀 Déploiement Vercel

1. Pousser le repo sur GitHub.
2. Sur https://vercel.com → New Project → importer le repo.
3. **Framework preset** : Next.js (détecté automatiquement).
4. **Environment Variables** : copier toutes les variables de `.env.local` dans l'onglet "Environment Variables".
5. Déployer.
6. Sur Stripe : créer un endpoint webhook sur l'URL Vercel (`/api/webhook`), écouter `checkout.session.completed`, copier le secret et l'ajouter dans Vercel.
7. Sur Mapbox : restreindre le token public au domaine `tka-driver.fr` (URL restrictions).

---

## ⚙️ Personnalisation

### Modifier les tarifs
→ `lib/pricing.ts`

```ts
export const PRICING = {
  PRISE_EN_CHARGE: 5,        // €
  TARIF_KM: 2,
  MAJORATION_HEURE_POINTE: 0.20,  // +20%
  MAJORATION_NUIT: 0.15,           // +15%
  PRIX_MINIMUM: 25,
};
```

Le tarif dépend de la **distance** (pas du temps de trajet). Heures de pointe : 7h–10h et 17h–20h. Nuit : 22h–6h.

### Modifier les forfaits longue distance
→ `lib/packages.ts`

Ajouter une entrée dans `PACKAGES`, avec ses `keywords` (tokens à matcher dans les adresses pour déclencher le forfait automatiquement).

### Ajouter de vrais avis Google Business
→ `messages/fr.json` puis `messages/en.json` → `testimonials.items`

Récupérer les vrais avis depuis Google Business → coller (en respectant le format `{ name, city, text }`).

### Remplacer les photos de Tidiane
→ Déposer les fichiers dans `public/` :
- `public/tidiane-hero.jpg` (utilisé dans le Hero)
- `public/tidiane-about.jpg` (utilisé dans la section À propos)

Puis dans `components/Hero.tsx` et `components/About.tsx`, remplacer les blocs avec `/* TODO: ... */` par `<Image src="/tidiane-hero.jpg" ... />` (composant `next/image`).

### Compléter les mentions légales / CGV / confidentialité
→ `app/[locale]/cgv/page.tsx`, `app/[locale]/mentions-legales/page.tsx`, `app/[locale]/politique-confidentialite/page.tsx`.

Les modèles existent — il reste à compléter les `[à compléter]` (n° SIRET, n° EVTC, adresse, etc.). **À faire valider par un professionnel du droit avant publication.**

---

## 🧠 Logique de réservation

```
Landing
  ↓ Le client remplit le simulateur (origine, destination, date, heure)
  ↓ /api/distance calcule km + durée via Mapbox Directions
  ↓ lib/pricing.ts calcule le prix client-side
  ↓
/reservation/creneaux?from=...&to=...&price=...
  ↓ Récap + formulaire (prénom, nom, email, téléphone)
  ↓ POST /api/checkout → Stripe session
  ↓
Stripe Checkout (paiement intégral)
  ↓ Succès → /reservation/confirmation
  ↓ Annulation → /reservation/annulation
  ↓
Stripe webhook /api/webhook
  ↓ Resend envoie 2 emails : un au client + un à Tidiane
```

---

## 🔍 SEO

- Méta + OG + Twitter Card dans `app/[locale]/layout.tsx`
- Schema.org `LocalBusiness` + `TaxiService` injecté dans le layout, `FAQPage` injecté dans la FAQ
- Sitemap auto-généré (`/sitemap.xml`) + robots (`/robots.txt`) → `app/sitemap.ts` et `app/robots.ts`
- Polices Google chargées via `next/font` (préchargement automatique)

---

## 📁 Arborescence

```
app/
  layout.tsx                  # root (fonts + metadataBase)
  globals.css
  sitemap.ts
  robots.ts
  [locale]/
    layout.tsx                # next-intl provider + Header/Footer/Whatsapp + Schema.org
    page.tsx                  # landing
    reservation/
      creneaux/page.tsx       # récap + formulaire
      confirmation/page.tsx
      annulation/page.tsx
    cgv/page.tsx
    mentions-legales/page.tsx
    politique-confidentialite/page.tsx
  api/
    distance/route.ts         # proxy Mapbox Directions
    checkout/route.ts         # création session Stripe
    webhook/route.ts          # webhook Stripe → emails Resend

components/
  Header.tsx, Hero.tsx, PriceSimulator.tsx, PackagesSection.tsx,
  WhyChooseUs.tsx, Testimonials.tsx, About.tsx, FAQ.tsx, Footer.tsx,
  WhatsAppFloatingButton.tsx, LanguageSwitcher.tsx,
  AddressAutocomplete.tsx,
  ui/ ← primitives shadcn-style (button, input, label, card, accordion, select, switch, textarea)

lib/
  pricing.ts, packages.ts, stripe.ts, mapbox.ts, utils.ts

messages/
  fr.json, en.json

i18n.ts, middleware.ts        # config next-intl
```

---

## ✅ Checklist avant mise en prod

- [ ] Remplir `.env.local` avec les vraies clés (Mapbox, Stripe, Resend)
- [ ] Compléter `[à compléter]` dans les pages légales (SIRET, EVTC, adresse)
- [ ] Ajouter `tidiane-hero.jpg` et `tidiane-about.jpg` dans `public/`
- [ ] Tester le flow complet en mode Stripe test (carte `4242 4242 4242 4242`)
- [ ] Vérifier le tarif en heure de pointe / nuit / aller-retour
- [ ] Configurer le webhook Stripe en production
- [ ] Vérifier le domaine Resend (DNS) pour pouvoir envoyer depuis `@tka-driver.fr`
- [ ] Restreindre le token Mapbox au domaine de prod
- [ ] Créer la fiche Google Business + récupérer les vrais avis → `messages/fr.json`
- [ ] Soumettre le sitemap à Google Search Console
