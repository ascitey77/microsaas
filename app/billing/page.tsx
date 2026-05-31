"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function BillingPage(): JSX.Element {
  const [loading, setLoading] = useState<string | null>(null);

  const openCheckout = async (planId: "starter" | "pro" | "agency") => {
    setLoading(planId);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    const data = (await res.json()) as { url?: string };
    if (data.url) window.location.href = data.url;
    setLoading(null);
  };

  const openPortal = async () => {
    setLoading("portal");
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = (await res.json()) as { url?: string };
    if (data.url) window.location.href = data.url;
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
          ← Dashboard
        </Link>
        <h1 className="mt-4 font-syne text-3xl font-bold">Facturation</h1>
        <p className="mt-2 text-slate-600">
          Gérez votre abonnement via Stripe (essai 14 jours sur les plans payants).
        </p>

        <div className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <Button
            onClick={() => openCheckout("starter")}
            disabled={loading !== null}
            className="w-full"
          >
            {loading === "starter" ? "Redirection…" : "Souscrire Starter — 19€/mois"}
          </Button>
          <Button
            onClick={() => openCheckout("pro")}
            disabled={loading !== null}
            variant="secondary"
            className="w-full"
          >
            {loading === "pro" ? "Redirection…" : "Souscrire Pro — 49€/mois"}
          </Button>
          <Button
            onClick={openPortal}
            disabled={loading !== null}
            variant="outline"
            className="w-full"
          >
            {loading === "portal"
              ? "Ouverture…"
              : "Portail client Stripe (upgrade / annulation)"}
          </Button>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Le plan Pro et Agency débloquent le{" "}
          <strong>domaine personnalisé (CNAME)</strong> par site, configurable
          dans l&apos;éditeur.
        </p>
      </div>
    </div>
  );
}
