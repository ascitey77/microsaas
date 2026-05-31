export interface ObsidianHeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl: string;
}

export interface ObsidianServiceItem {
  title: string;
  description: string;
  icon?: string;
}

export interface ObsidianServicesContent {
  title: string;
  subtitle: string;
  items: ObsidianServiceItem[];
}

export interface ObsidianTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface ObsidianTestimonialsContent {
  title: string;
  items: ObsidianTestimonial[];
}

export interface ObsidianCTAContent {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
}

export type SectionType =
  | "hero"
  | "services"
  | "testimonials"
  | "cta";

export interface SectionContentMap {
  hero: ObsidianHeroContent;
  services: ObsidianServicesContent;
  testimonials: ObsidianTestimonialsContent;
  cta: ObsidianCTAContent;
}

export interface EditableSection<T extends SectionType = SectionType> {
  id: string;
  type: T;
  order: number;
  content: SectionContentMap[T];
  settings: {
    animation?: "subtle" | "medium" | "bold" | "off";
    paddingY?: number;
  };
}

export interface SiteEditorData {
  siteId: string;
  siteName: string;
  slug: string;
  templateId: string;
  primaryColor: string;
  isPublished: boolean;
  plan: string;
  sections: EditableSection[];
}
