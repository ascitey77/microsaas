"use client";

import { motion } from "framer-motion";
import type { ObsidianCTAContent } from "@/types/sections";

interface CTASectionProps {
  content: ObsidianCTAContent;
  primaryColor?: string;
  editable?: boolean;
  onFieldChange?: (field: keyof ObsidianCTAContent, value: string) => void;
}

export function CTASection({
  content,
  primaryColor = "#C9A84C",
  editable = false,
  onFieldChange,
}: CTASectionProps) {
  return (
    <section
      className="relative flex min-h-[70vh] items-center justify-center bg-[#0A0A0A] px-6"
      aria-labelledby="obsidian-cta-title"
    >
      <div className="grain-overlay absolute inset-0" aria-hidden="true" />
      <motion.div
        className="relative z-10 max-w-3xl text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2
          id="obsidian-cta-title"
          className="font-cormorant text-5xl font-light text-[#F9F5EE] md:text-7xl"
          contentEditable={editable}
          suppressContentEditableWarning
          onBlur={(e) =>
            onFieldChange?.("title", e.currentTarget.textContent ?? "")
          }
        >
          {content.title}
        </h2>
        <p
          className="mt-6 font-jakarta text-lg text-[#F9F5EE]/60"
          contentEditable={editable}
          suppressContentEditableWarning
          onBlur={(e) =>
            onFieldChange?.("subtitle", e.currentTarget.textContent ?? "")
          }
        >
          {content.subtitle}
        </p>
        <a
          href={content.ctaUrl}
          className="mt-10 inline-block px-12 py-5 font-jakarta text-sm uppercase tracking-widest text-[#0A0A0A] transition-transform hover:scale-105"
          style={{ backgroundColor: primaryColor }}
        >
          <span
            contentEditable={editable}
            suppressContentEditableWarning
            onBlur={(e) =>
              onFieldChange?.("ctaText", e.currentTarget.textContent ?? "")
            }
          >
            {content.ctaText}
          </span>
        </a>
      </motion.div>
    </section>
  );
}
