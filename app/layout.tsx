import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Plus_Jakarta_Sans,
  Syne,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VitrineLab — Un site vitrine 5 étoiles. En 5 minutes.",
  description:
    "Créez des sites vitrines premium pour TPE, PME et freelances. 10x moins cher qu'une agence, qualité indiscernable d'un site sur mesure.",
  openGraph: {
    title: "VitrineLab",
    description: "Sites vitrines premium en quelques minutes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${jakarta.variable} ${syne.variable}`}
    >
      <body className="font-jakarta bg-white text-slate-900">{children}</body>
    </html>
  );
}
