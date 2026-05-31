import type { EditableSection } from "@/types/sections";

export const DEFAULT_OBSIDIAN_SECTIONS: EditableSection[] = [
  {
    id: "hero-1",
    type: "hero",
    order: 0,
    content: {
      eyebrow: "Excellence & Raffinement",
      title: "L'art de sublimer votre image",
      subtitle:
        "Une présence digitale d'exception, pensée pour les marques qui exigent l'extraordinaire.",
      ctaText: "Découvrir",
      ctaUrl: "#contact",
      imageUrl:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
    },
    settings: { animation: "medium" },
  },
  {
    id: "services-1",
    type: "services",
    order: 1,
    content: {
      title: "Nos expertises",
      subtitle: "Des services sur mesure pour une image irréprochable.",
      items: [
        {
          title: "Direction artistique",
          description:
            "Identité visuelle cohérente et mémorable pour votre marque premium.",
        },
        {
          title: "Stratégie digitale",
          description:
            "Parcours client optimisé pour convertir chaque visite en opportunité.",
        },
        {
          title: "Production contenu",
          description:
            "Photographie et rédaction d'exception pour une narration captivante.",
        },
      ],
    },
    settings: { animation: "subtle" },
  },
  {
    id: "testimonials-1",
    type: "testimonials",
    order: 2,
    content: {
      title: "Ils nous font confiance",
      items: [
        {
          quote:
            "Un résultat à la hauteur des plus grandes maisons. Notre image n'a jamais été aussi forte.",
          author: "Sophie Laurent",
          role: "Directrice, Maison Laurent",
        },
        {
          quote:
            "Rapide, élégant, efficace. Exactement ce qu'attendait notre clientèle exigeante.",
          author: "Marc Duval",
          role: "Fondateur, Duval & Associés",
        },
      ],
    },
    settings: { animation: "medium" },
  },
  {
    id: "cta-1",
    type: "cta",
    order: 3,
    content: {
      title: "Prêt à briller ?",
      subtitle: "Réservez votre consultation privée dès aujourd'hui.",
      ctaText: "Prendre rendez-vous",
      ctaUrl: "#contact",
    },
    settings: { animation: "bold" },
  },
];
