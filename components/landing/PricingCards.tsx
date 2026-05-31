"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "0€",
    description: "Pour découvrir VitrineLab",
    features: [
      "1 site",
      "Sous-domaine .vitrinelab.com",
      "3 sections max",
      "Watermark discret",
    ],
    cta: "Commencer gratuit",
    href: "/signup",
    highlighted: false,
  },
  {
    id: "starter",
    name: "Starter",
    price: "19€",
    period: "/mois",
    description: "Pour les indépendants",
    features: [
      "1 site · sous-domaine custom",
      "Sections illimitées",
      "Analytics & formulaires",
      "SSL inclus",
    ],
    cta: "Essai 14 jours",
    href: "/signup?plan=starter",
    highlighted: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "49€",
    period: "/mois",
    description: "Pour les pros exigeants",
    features: [
      "3 sites",
      "Domaine CNAME custom",
      "Tous les templates",
      "Sans watermark",
    ],
    cta: "Passer Pro",
    href: "/signup?plan=pro",
    highlighted: false,
  },
];

export function PricingCards() {
  return (
    <section id="pricing" className="bg-slate-950 px-6 py-24 text-white lg:px-12">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-syne text-4xl font-bold md:text-5xl">
          Tarifs transparents
        </h2>
        <p className="mt-4 text-slate-400">
          Essai Pro 14 jours · Annulation à tout moment
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`rounded-2xl border p-8 text-left ${
                plan.highlighted
                  ? "border-blue-500 bg-slate-900 ring-2 ring-blue-500"
                  : "border-slate-700 bg-slate-900/50"
              }`}
            >
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-2 text-4xl font-bold">
                {plan.price}
                {"period" in plan && (
                  <span className="text-lg font-normal text-slate-400">
                    {plan.period}
                  </span>
                )}
              </p>
              <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-blue-400" aria-hidden="true">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className="mt-8 block">
                <Button
                  variant={plan.highlighted ? "primary" : "outline"}
                  className={
                    !plan.highlighted
                      ? "w-full border-slate-600 text-white hover:bg-slate-800"
                      : "w-full"
                  }
                >
                  {plan.cta}
                </Button>
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-slate-500">
          Plan Agency 149€/mois — sites illimités, whitelabel, export HTML.{" "}
          <Link href="/signup?plan=agency" className="text-blue-400 hover:underline">
            En savoir plus
          </Link>
        </p>
      </div>
    </section>
  );
}
