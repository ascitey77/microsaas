# Publier VitrineLab — accessible 24h/24

## Option A — Domaine Vercel (gratuit, immédiat)

1. Déployez sur Vercel (voir ci-dessous).
2. URL publique : `https://vitrinelab.vercel.app` ou `https://microsaas.vercel.app`.
3. Disponible 24h/24 sans achat de domaine.

## Option B — Domaine propre (ex. vitrinelab.com)

### 1. Acheter le domaine

Registrars : Cloudflare, Gandi, OVH, Namecheap — cherchez `vitrinelab.com` (ou variante).

### 2. Lier à Vercel

Vercel → Project → **Settings → Domains** :

| Domaine | Rôle |
|---------|------|
| `vitrinelab.com` | App SaaS (landing, dashboard) |
| `www.vitrinelab.com` | Redirection → racine |
| `*.vitrinelab.com` | Sites clients `{slug}.vitrinelab.com` |

### 3. DNS (chez votre registrar)

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
CNAME   *       cname.vercel-dns.com
```

### 4. Variables Vercel (Production)

```
NEXT_PUBLIC_APP_URL=https://vitrinelab.com
NEXT_PUBLIC_APP_DOMAIN=vitrinelab.com
```

Puis **Redeploy**.

---

## Déploiement GitHub → Vercel (recommandé)

1. [vercel.com/new](https://vercel.com/new) → Import `ascitey77/microsaas`
2. Framework : **Next.js** (auto)
3. Collez les variables depuis `.env.example`
4. Deploy → site en ligne en ~2 min

### Webhook Stripe (production)

```
https://vitrinelab.com/api/stripe/webhook
```

(ou votre URL `.vercel.app` en attendant le domaine)

---

## CLI rapide

```bash
npx vercel login
npx vercel link
npx vercel env pull .env.local
# Renseigner les secrets sur vercel.com → Settings → Environment Variables
npx vercel --prod
```

---

## Checklist 24/7

- [ ] Projet Vercel en plan Hobby/Pro (pas de sleep serverless critique pour Next)
- [ ] Supabase projet actif (gratuit OK pour démarrer)
- [ ] Variables d'environnement **Production** renseignées
- [ ] Domaine racine + wildcard `*` configurés
- [ ] Stripe webhook pointant vers l'URL production
