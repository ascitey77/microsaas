"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 pb-24 pt-32 text-white lg:px-12 lg:pb-32 lg:pt-40">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, #2563EB, transparent)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-blue-400">
            Plateforme SaaS · TPE & PME
          </p>
          <h1 className="font-syne text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            Un site vitrine{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              5 étoiles.
            </span>{" "}
            En 5 minutes.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-400">
            Créez des sites premium indiscernables d&apos;un développement sur
            mesure — pour 10x moins cher qu&apos;une agence traditionnelle.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/signup">
              <Button size="lg">Créer mon site — gratuit</Button>
            </Link>
            <a href="#demo">
              <Button variant="outline" size="lg" className="border-slate-600 text-white hover:bg-slate-800">
                Voir la démo
              </Button>
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            <strong className="text-slate-300">2 847</strong> sites créés cette
            semaine · Essai Pro 14 jours
          </p>
        </motion.div>

        <motion.div
          className="relative mx-auto mt-16 max-w-5xl"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 p-2 shadow-2xl backdrop-blur">
            <div className="flex gap-2 border-b border-slate-700/50 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-4 font-mono text-xs text-slate-500">
                editor.vitrinelab.com
              </span>
            </div>
            <div className="grid aspect-video grid-cols-5 gap-2 p-4">
              <div className="col-span-2 rounded-lg bg-slate-800 p-3">
                <div className="mb-2 h-2 w-16 rounded bg-slate-600" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 rounded bg-slate-700/80" />
                  ))}
                </div>
              </div>
              <div className="col-span-3 overflow-hidden rounded-lg bg-[#0A0A0A]">
                <div className="flex h-full flex-col justify-center p-8">
                  <p className="font-cormorant text-2xl text-[#C9A84C]">
                    Obsidian
                  </p>
                  <p className="font-cormorant text-4xl font-light text-[#F9F5EE]">
                    L&apos;art de sublimer
                  </p>
                </div>
              </div>
            </div>
          </div>
          <motion.div
            className="absolute -right-4 -top-4 rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-xs shadow-lg"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            ✨ Publié en 47s
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
