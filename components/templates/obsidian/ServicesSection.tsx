"use client";

import { motion } from "framer-motion";
import type { ObsidianServicesContent } from "@/types/sections";

interface ServicesSectionProps {
  content: ObsidianServicesContent;
  primaryColor?: string;
  editable?: boolean;
}

export function ServicesSection({
  content,
  primaryColor = "#C9A84C",
  editable = false,
}: ServicesSectionProps) {
  return (
    <section
      className="bg-[#0A0A0A] px-6 py-32 text-[#F9F5EE] lg:px-12"
      aria-labelledby="obsidian-services-title"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 max-w-xl">
          <h2
            id="obsidian-services-title"
            className="font-cormorant text-4xl font-light md:text-6xl"
            contentEditable={editable}
            suppressContentEditableWarning
          >
            {content.title}
          </h2>
          <p
            className="mt-4 font-jakarta text-[#F9F5EE]/60"
            contentEditable={editable}
            suppressContentEditableWarning
          >
            {content.subtitle}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, i) => (
            <motion.article
              key={i}
              className={`group border border-[#F9F5EE]/10 p-8 transition-colors hover:border-[${primaryColor}]/40`}
              style={{
                marginTop: i % 2 === 1 ? "2rem" : 0,
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1 }}
            >
              <span
                className="font-jakarta text-xs uppercase tracking-widest"
                style={{ color: primaryColor }}
              >
                0{i + 1}
              </span>
              <h3
                className="mt-4 font-cormorant text-2xl font-light"
                contentEditable={editable}
                suppressContentEditableWarning
              >
                {item.title}
              </h3>
              <p
                className="mt-3 font-jakarta text-sm leading-relaxed text-[#F9F5EE]/60"
                contentEditable={editable}
                suppressContentEditableWarning
              >
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
