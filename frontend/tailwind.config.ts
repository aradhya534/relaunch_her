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
          primary: "#4F46E5",      // Slate Indigo
          accent: "#10B981",       // Mint Teal (Emerald)
          highlight: "#FF6B6B",    // Electric Coral
          bgLight: "#F8FAFC",      // Slate Ice
          dark: "#0F172A",         // Deep Slate Navy
          cardDark: "#1E293B",     // Slate Blue-Grey
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
