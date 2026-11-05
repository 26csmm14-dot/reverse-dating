/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        card: "#12121c",
        cardBorder: "rgba(255, 255, 255, 0.08)",
        rose: {
          500: "#f43f5e",
          600: "#e11d48",
          glow: "rgba(244, 63, 94, 0.25)",
        },
        violet: {
          500: "#8b5cf6",
          600: "#7c3aed",
          glow: "rgba(139, 92, 246, 0.25)",
        },
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
