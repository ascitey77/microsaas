"use client";

import { motion } from "framer-motion";

const TEMPLATES = [
  { id: "obsidian", name: "Obsidian", colors: ["#0A0A0A", "#C9A84C"], tag: "Luxe" },
  { id: "blanc", name: "Blanc Architecte", colors: ["#FFFFFF", "#1A1A1A"], tag: "Éditorial" },
  { id: "botanik", name: "Botanik", colors: ["#2D4A2D", "#C4714A"], tag: "Organique" },
  { id: "signal", name: "Signal", colors: ["#0F1B2D", "#2563EB"], tag: "Tech B2B" },
  { id: "velours", name: "Velours", colors: ["#3D1A24", "#D4956A"], tag: "Créatif" },
  { id: "beton", name: "Béton", colors: ["#FFFFFF", "#E63946"], tag: "Brutalist" },
];

export function TemplateCarousel() {
  return (
    <section id="demo" className="bg-slate-50 px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-syne text-4xl font-bold text-slate-900 md:text-5xl">
          6 templates premium
        </h2>
        <p className="mt-4 max-w-xl text-slate-600">
          Chaque esthétique est pensée pour un secteur — restaurant, cabinet,
          créatif, tech, artisan, coach.
        </p>

        <div className="mt-12 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          {TEMPLATES.map((t, i) => (
            <motion.article
              key={t.id}
              className="group relative w-72 shrink-0 snap-center cursor-pointer"
              initial={{ opacity: 0, rotateY: -8 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03, rotateY: 4 }}
              style={{ perspective: 1000 }}
            >
              <div
                className="aspect-[3/4] overflow-hidden rounded-2xl border border-slate-200 shadow-lg transition-shadow group-hover:shadow-2xl"
                style={{ backgroundColor: t.colors[0] }}
              >
                <div className="flex h-full flex-col justify-between p-6">
                  <span
                    className="inline-block w-fit rounded-full px-3 py-1 text-xs font-medium text-white/80"
                    style={{ backgroundColor: t.colors[1] }}
                  >
                    {t.tag}
                  </span>
                  <div>
                    <h3
                      className="text-2xl font-bold"
                      style={{ color: t.colors[1] }}
                    >
                      {t.name}
                    </h3>
                    {t.id !== "obsidian" && (
                      <p className="mt-1 text-xs text-white/40">Phase 2</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
