import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-void": "#060A12",
        "bg-deep": "#0D1520",
        "bg-surface": "#141D2E",
        saffron: {
          DEFAULT: "#D4590A",
          bright: "#F07030",
          glow: "rgba(212, 89, 10, 0.30)",
          subtle: "rgba(212, 89, 10, 0.08)",
        },
        teal: {
          DEFAULT: "#0B6E72",
          light: "#12A8AE",
          glow: "rgba(11, 110, 114, 0.25)",
        },
        gold: {
          DEFAULT: "#B8922A",
          light: "#D4AF55",
          glow: "rgba(184, 146, 42, 0.20)",
        },
        "text-primary": "#F2EDE4",
        "text-secondary": "#9A8F82",
        "text-mono": "#7AB3B5",
        "text-dim": "#4A4540",
        score: {
          high: "#2EC97A",
          mid: "#F5A623",
          low: "#E8453C",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
        sans: ["var(--font-sora)", "sans-serif"],
      },
      boxShadow: {
        glass: "0 4px 16px rgba(0, 0, 0, 0.20), 0 16px 40px rgba(0, 0, 0, 0.30), 0 48px 96px rgba(0, 0, 0, 0.20)",
        "glass-hover": "0 8px 24px rgba(0, 0, 0, 0.30), 0 32px 64px rgba(0, 0, 0, 0.40)",
      },
      animation: {
        "sine-float": "sine-float 6s ease-in-out infinite",
      },
      keyframes: {
        "sine-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      transitionTimingFunction: {
        primary: "cubic-bezier(0.23, 1, 0.32, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
