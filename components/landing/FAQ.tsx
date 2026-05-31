"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Puis-je utiliser mon propre nom de domaine ?",
    a: "Oui, à partir du plan Pro. Ajoutez un enregistrement CNAME pointant vers notre infrastructure Vercel. Le domaine est lié à chaque site depuis l'éditeur.",
  },
  {
    q: "Combien de temps pour publier un site ?",
    a: "L'onboarding prend environ 90 secondes avec pré-remplissage IA. La publication en 1 clic déploie votre site sur notre CDN global.",
  },
  {
    q: "Les templates sont-ils personnalisables ?",
    a: "Oui — couleurs, typographies, contenus WYSIWYG inline, médias et sections réordonnables (Phase 2 pour le drag-and-drop complet).",
  },
  {
    q: "Y a-t-il un essai gratuit ?",
    a: "Le plan Free est permanent. Les plans payants incluent 14 jours d'essai via Stripe Checkout.",
  },
  {
    q: "Puis-je exporter mon site ?",
    a: "Le plan Agency inclut l'export HTML/CSS complet et l'accès API.",
  },
  {
    q: "Comment fonctionne la facturation ?",
    a: "Paiement sécurisé par Stripe. Gérez votre abonnement via le portail client intégré (upgrade, downgrade, annulation).",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Isolation multi-tenant via Row Level Security Supabase. Chaque requête est filtrée par utilisateur.",
  },
  {
    q: "Support en français ?",
    a: "Oui — interface FR/EN, support prioritaire pour les plans Pro et Agency.",
  },
];

export function FAQ() {
  return (
    <section className="px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-syne text-4xl font-bold">
          Questions fréquentes
        </h2>
        <Accordion.Root
          type="single"
          collapsible
          className="mt-12 space-y-2"
        >
          {FAQ_ITEMS.map((item, i) => (
            <Accordion.Item
              key={i}
              value={`item-${i}`}
              className="overflow-hidden rounded-xl border border-slate-200"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between px-6 py-4 text-left font-medium hover:bg-slate-50">
                  {item.q}
                  <ChevronDown
                    className="h-5 w-5 shrink-0 transition-transform group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <p className="px-6 pb-4 text-slate-600">{item.a}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
