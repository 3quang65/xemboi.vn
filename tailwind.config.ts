import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        night: "#1d1729",
        night2: "#2b2240",
        earth: "#2e231c",
        bg: "var(--bg)",
        card: "var(--card)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        red: "var(--red)",
        gold: "var(--gold)",
        paper: "var(--paper)",
        kim: "var(--kim)",
        moc: "var(--moc)",
        thuy: "var(--thuy)",
        hoa: "var(--hoa)",
        tho: "var(--tho)",
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', "system-ui", "sans-serif"],
        serif: ['"Noto Serif"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
