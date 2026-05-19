import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: "#faf6ef",
        ink: "#1a1a1a",
        accent: "#7c3a2d",
        dark: {
          bg: "#0a0a0a",
          card: "#1a1a1a",
          border: "#2a2a2a",
          text: "#e5e5e5",
          muted: "#6b7280",
        }
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
