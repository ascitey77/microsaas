import Link from "next/link";
import { Hero } from "@/components/landing/Hero";
import { TemplateCarousel } from "@/components/landing/TemplateCarousel";
import { ComparisonTable } from "@/components/landing/ComparisonTable";
import { PricingCards } from "@/components/landing/PricingCards";
import { FAQ } from "@/components/landing/FAQ";
import { SkipLink } from "@/components/ui/SkipLink";

const CLIENT_LOGOS = ["Maison L.", "Studio K.", "Atelier M.", "Cabinet D.", "Nova Tech"];

export default function LandingPage(): JSX.Element {
  return (
    <>
      <SkipLink />
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12"
          aria-label="Navigation principale"
        >
          <Link href="/" className="font-syne text-xl font-bold text-white">
            VitrineLab
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#demo" className="text-sm text-slate-300 hover:text-white">
              Templates
            </a>
            <a href="#pricing" className="text-sm text-slate-300 hover:text-white">
              Tarifs
            </a>
            <Link href="/login" className="text-sm text-slate-300 hover:text-white">
              Connexion
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Créer mon site
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content">
        <Hero />

        <section className="border-y border-slate-200 bg-white py-12">
          <p className="text-center text-sm text-slate-500">
            Ils nous font confiance
          </p>
          <div
            className="mt-6 flex flex-wrap items-center justify-center gap-12 px-6 opacity-60"
            aria-label="Logos clients"
          >
            {CLIENT_LOGOS.map((name) => (
              <span
                key={name}
                className="font-syne text-lg font-semibold text-slate-400"
              >
                {name}
              </span>
            ))}
          </div>
        </section>

        <TemplateCarousel />
        <ComparisonTable />
        <PricingCards />
        <FAQ />
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-12 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="font-syne text-lg font-bold">VitrineLab</p>
            <p className="mt-2 text-sm text-slate-500">
              © {new Date().getFullYear()} VitrineLab. Tous droits réservés.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 text-sm text-slate-600">
            <Link href="/legal/mentions" className="hover:text-slate-900">
              Mentions légales
            </Link>
            <Link href="/legal/privacy" className="hover:text-slate-900">
              Confidentialité
            </Link>
            <Link href="/legal/cgu" className="hover:text-slate-900">
              CGU
            </Link>
            <span lang="en">
              <Link href="/?lang=en" className="hover:text-slate-900">
                EN
              </Link>
              {" · "}
              <span lang="fr">FR</span>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
