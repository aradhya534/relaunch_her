import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          primary: "#2D1B69",      // Deep indigo
          accent: "#00C9B1",       // Electric teal
          highlight: "#F5A623",    // Warm gold
          bgLight: "#F0EBF8",      // Lavender white
          dark: "#1A0F3D",         // Dark text
          cardDark: "#3D2880",     // Card bg dark
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
