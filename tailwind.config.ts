import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          bg: "#0A0A0A",
          gold: "#C9A84C",
          cream: "#F9F5EE",
        },
        vitrine: {
          ink: "#0F172A",
          accent: "#2563EB",
          muted: "#64748B",
        },
      },
      fontFamily: {
        "cormorant": ["var(--font-cormorant)", "serif"],
        "jakarta": ["var(--font-jakarta)", "sans-serif"],
        "syne": ["var(--font-syne)", "sans-serif"],
      },
      animation: {
        "gradient-shift": "gradient-shift 8s ease infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
