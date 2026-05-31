"use client";

import { motion } from "framer-motion";
import type { ObsidianTestimonialsContent } from "@/types/sections";

interface TestimonialsSectionProps {
  content: ObsidianTestimonialsContent;
  primaryColor?: string;
  editable?: boolean;
}

export function TestimonialsSection({
  content,
  primaryColor = "#C9A84C",
  editable = false,
}: TestimonialsSectionProps) {
  const doubled = [...content.items, ...content.items];

  return (
    <section
      className="overflow-hidden bg-[#0A0A0A] py-24"
      aria-labelledby="obsidian-testimonials-title"
    >
      <h2 id="obsidian-testimonials-title" className="sr-only">
        {content.title}
      </h2>
      <p
        className="mb-12 text-center font-cormorant text-3xl text-[#F9F5EE] md:text-4xl"
        aria-hidden={content.title === ""}
      >
        {content.title}
      </p>

      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex gap-8 px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: { repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" },
          }}
          aria-label="Témoignages clients"
        >
          {doubled.map((item, i) => (
            <blockquote
              key={i}
              className="w-[min(90vw,420px)] shrink-0 border border-[#F9F5EE]/10 p-8"
            >
              <p
                className="font-cormorant text-xl italic leading-relaxed text-[#F9F5EE]"
                contentEditable={editable}
                suppressContentEditableWarning
              >
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-6 font-jakarta text-sm">
                <cite
                  className="not-italic font-medium"
                  style={{ color: primaryColor }}
                >
                  {item.author}
                </cite>
                <span className="block text-[#F9F5EE]/50">{item.role}</span>
              </footer>
            </blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
