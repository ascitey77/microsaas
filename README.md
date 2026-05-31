# VitrineLab

Plateforme SaaS pour créer des sites vitrines premium en quelques minutes — Next.js 14, Supabase, Stripe, Vercel.

## Prérequis

- Node.js 20+
- Compte [Supabase](https://supabase.com)
- Compte [Stripe](https://stripe.com)
- Compte [Vercel](https://vercel.com)
- (Optionnel) [Upstash](https://upstash.com) pour le rate limiting
- (Optionnel) [Resend](https://resend.com) pour les emails de relance paiement

## Déploiement en 15 minutes

### 1. Cloner et installer (2 min)

```bash
git clone <repo> vitrinelab
cd vitrinelab
npm install
cp .env.example .env.local
```

### 2. Supabase (4 min)

1. Créez un projet Supabase.
2. SQL Editor → collez le contenu de `supabase/migrations/001_initial_schema.sql` → Run.
3. Authentication → Providers → activez Email.
4. Copiez `URL` et `anon key` dans `.env.local`.
5. Settings → API → copiez `service_role` dans `SUPABASE_SERVICE_ROLE_KEY`.

### 3. Stripe (4 min)

1. Créez 3 produits récurrents : Starter (19€), Pro (49€), Agency (149€).
2. Copiez les **Price IDs** dans `.env.local`.
3. Developers → Webhooks → endpoint :
   - Production : `https://vitrinelab.com/api/stripe/webhook`
   - Local : `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Événements : `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_failed`, `invoice.paid`
5. Copiez le signing secret dans `STRIPE_WEBHOOK_SECRET`.

### 4. Vercel + domaines (5 min)

1. Importez le repo sur Vercel.
2. Ajoutez toutes les variables de `.env.example`.
3. Domaines du projet :
   - `vitrinelab.com` (app principale)
   - `*.vitrinelab.com` (wildcard sous-domaines clients)
4. DNS chez votre registrar :
   - `A` / `CNAME` racine → Vercel
   - `CNAME` `*` → `cname.vercel-dns.com`
5. Pour chaque **domaine client custom** (plan Pro+) :
   - L'utilisateur saisit `www.monentreprise.fr` dans l'éditeur
   - CNAME `www` → `cname.vercel-dns.com`
   - Ajoutez le domaine dans Vercel → Project → Domains (ou API)

### 5. Lancer

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Architecture multi-tenant

| Route | Usage |
|-------|--------|
| `vitrinelab.com` | Landing + app SaaS |
| `{slug}.vitrinelab.com` | Site publié (sous-domaine) |
| `www.client.fr` (CNAME) | Site publié (domaine custom, Pro+) |

Le `middleware.ts` réécrit les requêtes vers `/site/[slug]` ou `/site/by-domain/[hostname]`.

## Plans et domaines

| Plan | Sites | Sous-domaine | Domaine CNAME custom |
|------|-------|--------------|----------------------|
| Free | 1 | `.vitrinelab.com` | Non |
| Starter | 1 | custom slug | Non |
| Pro | 3 | Oui | **Oui** |
| Agency | Illimité | Oui | **Oui** + whitelabel |

Configuration du domaine : **Éditeur → panneau droit → Domaine personnalisé** (visible si plan Pro/Agency).

## Structure

Voir [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

## Scripts

```bash
npm run dev        # Développement
npm run build      # Build production
npm run typecheck  # Vérification TypeScript
```

## Phase 2 (roadmap)

- Templates Blanc Architecte, Botanik, Signal, Velours, Béton
- Éditeur drag-and-drop complet
- Pré-remplissage IA (Claude) à l'onboarding
- Analytics dashboard

## Licence

Propriétaire — VitrineLab © 2026
