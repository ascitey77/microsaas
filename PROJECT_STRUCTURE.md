# VitrineLab — Structure du projet

```
vitrinelab/
├── .env.example
├── PROJECT_STRUCTURE.md
├── README.md
├── vercel.json
├── middleware.ts
├── next.config.mjs
├── package.json
├── tailwind.config.ts
├── tsconfig.json
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                          # Landing VitrineLab
│   ├── favicon.ico
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx               # Onboarding 3 étapes
│   │
│   ├── dashboard/
│   │   └── page.tsx                      # Liste sites, plan, upgrade CTA
│   │
│   ├── billing/
│   │   └── page.tsx                      # Stripe Billing Portal embed
│   │
│   ├── editor/
│   │   └── [siteId]/
│   │       ├── page.tsx                  # Éditeur split-screen
│   │       └── seo/page.tsx
│   │
│   ├── preview/
│   │   └── [siteId]/page.tsx
│   │
│   ├── site/
│   │   └── [slug]/[[...path]]/page.tsx   # Site client publié (ISR)
│   │
│   └── api/
│       ├── stripe/
│       │   ├── checkout/route.ts
│       │   ├── portal/route.ts
│       │   └── webhook/route.ts
│       ├── sites/route.ts
│       ├── onboarding/generate/route.ts  # Claude pré-remplissage
│       └── analytics/track/route.ts
│
├── components/
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── TemplateCarousel.tsx
│   │   ├── ComparisonTable.tsx
│   │   ├── PricingCards.tsx
│   │   └── FAQ.tsx
│   │
│   ├── editor/
│   │   ├── EditorShell.tsx
│   │   ├── EditorSidebar.tsx
│   │   ├── PreviewFrame.tsx
│   │   ├── SectionList.tsx
│   │   └── InlineEditor.tsx
│   │
│   ├── dashboard/
│   │   ├── SiteCard.tsx
│   │   └── PlanBadge.tsx
│   │
│   ├── templates/
│   │   ├── obsidian/
│   │   │   ├── ObsidianTemplate.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   └── CTASection.tsx
│   │   ├── blanc-architecte/             # Phase 2
│   │   ├── botanik/
│   │   ├── signal/
│   │   ├── velours/
│   │   └── beton/
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Accordion.tsx
│       └── SkipLink.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── stripe.ts
│   ├── plans.ts
│   ├── ratelimit.ts
│   ├── tenant.ts
│   └── utils.ts
│
└── types/
    ├── database.ts
    ├── sections.ts
    └── plans.ts
```
