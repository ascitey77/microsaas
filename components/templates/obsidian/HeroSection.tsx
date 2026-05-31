"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ObsidianHeroContent } from "@/types/sections";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  content: ObsidianHeroContent;
  primaryColor?: string;
  editable?: boolean;
  onFieldChange?: (field: keyof ObsidianHeroContent, value: string) => void;
}

export function HeroSection({
  content,
  primaryColor = "#C9A84C",
  editable = false,
  onFieldChange,
}: HeroSectionProps) {
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-[#F9F5EE]"
      aria-labelledby="obsidian-hero-title"
    >
      <div className="grain-overlay absolute inset-0 z-10" aria-hidden="true" />
      <div className="relative z-20 mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="mb-6 font-jakarta text-xs uppercase tracking-[0.3em]"
            style={{ color: primaryColor }}
            contentEditable={editable}
            suppressContentEditableWarning
            onBlur={(e) =>
              onFieldChange?.("eyebrow", e.currentTarget.textContent ?? "")
            }
          >
            {content.eyebrow}
          </p>
          <h1
            id="obsidian-hero-title"
            className="font-cormorant text-5xl font-light leading-[1.05] md:text-7xl lg:text-8xl"
            contentEditable={editable}
            suppressContentEditableWarning
            onBlur={(e) =>
              onFieldChange?.("title", e.currentTarget.textContent ?? "")
            }
          >
            <span className="text-mask-scroll">{content.title}</span>
          </h1>
          <p
            className="mt-8 max-w-md font-jakarta text-lg text-[#F9F5EE]/70"
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
            className={cn(
              "mt-10 inline-block border px-8 py-4 font-jakarta text-sm uppercase tracking-widest transition-colors",
              "hover:bg-[#F9F5EE] hover:text-[#0A0A0A]"
            )}
            style={{ borderColor: primaryColor, color: primaryColor }}
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

        <motion.div
          className="relative aspect-[4/5] overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <Image
            src={content.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEA/ALdu6t7u3S4tY1miQKqKBgD2p//Z"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"
            aria-hidden="true"
          />
        </motion.div>
      </div>
    </section>
  );
}
