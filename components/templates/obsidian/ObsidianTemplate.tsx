"use client";

import { SkipLink } from "@/components/ui/SkipLink";
import { HeroSection } from "./HeroSection";
import { ServicesSection } from "./ServicesSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { CTASection } from "./CTASection";
import type {
  EditableSection,
  ObsidianCTAContent,
  ObsidianHeroContent,
  ObsidianServicesContent,
  ObsidianTestimonialsContent,
  SectionType,
} from "@/types/sections";

interface ObsidianTemplateProps {
  sections: EditableSection[];
  primaryColor?: string;
  showWatermark?: boolean;
  editable?: boolean;
  onSectionChange?: (
    sectionId: string,
    field: string,
    value: string
  ) => void;
}

function isHero(s: EditableSection): s is EditableSection<"hero"> {
  return s.type === "hero";
}
function isServices(s: EditableSection): s is EditableSection<"services"> {
  return s.type === "services";
}
function isTestimonials(
  s: EditableSection
): s is EditableSection<"testimonials"> {
  return s.type === "testimonials";
}
function isCta(s: EditableSection): s is EditableSection<"cta"> {
  return s.type === "cta";
}

export function ObsidianTemplate({
  sections,
  primaryColor = "#C9A84C",
  showWatermark = false,
  editable = false,
  onSectionChange,
}: ObsidianTemplateProps) {
  const sorted = [...sections].sort((a, b) => a.order - b.order);

  const handleHeroChange = (
    sectionId: string,
    field: keyof ObsidianHeroContent,
    value: string
  ) => onSectionChange?.(sectionId, field, value);

  const handleCtaChange = (
    sectionId: string,
    field: keyof ObsidianCTAContent,
    value: string
  ) => onSectionChange?.(sectionId, field, value);

  return (
    <div className="obsidian-template cursor-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22%3E%3Ccircle cx=%2212%22 cy=%2212%22 r=%228%22 fill=%22%23C9A84C%22/%3E%3C/svg%3E'),auto]">
      <SkipLink />
      <main id="main-content">
        {sorted.map((section) => {
          if (isHero(section)) {
            return (
              <HeroSection
                key={section.id}
                content={section.content as ObsidianHeroContent}
                primaryColor={primaryColor}
                editable={editable}
                onFieldChange={(field, value) =>
                  handleHeroChange(section.id, field, value)
                }
              />
            );
          }
          if (isServices(section)) {
            return (
              <ServicesSection
                key={section.id}
                content={section.content as ObsidianServicesContent}
                primaryColor={primaryColor}
                editable={editable}
              />
            );
          }
          if (isTestimonials(section)) {
            return (
              <TestimonialsSection
                key={section.id}
                content={section.content as ObsidianTestimonialsContent}
                primaryColor={primaryColor}
                editable={editable}
              />
            );
          }
          if (isCta(section)) {
            return (
              <CTASection
                key={section.id}
                content={section.content as ObsidianCTAContent}
                primaryColor={primaryColor}
                editable={editable}
                onFieldChange={(field, value) =>
                  handleCtaChange(section.id, field, value)
                }
              />
            );
          }
          return null;
        })}
      </main>
      {showWatermark && (
        <footer className="fixed bottom-4 right-4 z-50 rounded-full bg-black/50 px-3 py-1 font-jakarta text-[10px] text-white/40 backdrop-blur">
          Créé avec VitrineLab
        </footer>
      )}
    </div>
  );
}

export { DEFAULT_OBSIDIAN_SECTIONS } from "@/lib/templates/obsidian-defaults";
export type { SectionType };
