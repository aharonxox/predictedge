/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#07080B",
          soft: "#0B0D12",
          card: "#0F1218",
          elev: "#141820",
        },
        line: {
          DEFAULT: "#1C2230",
          soft: "#151A24",
        },
        ink: {
          DEFAULT: "#E6E8EE",
          soft: "#A7ADBB",
          mute: "#6B7280",
        },
        accent: {
          DEFAULT: "#7C5CFF",
          cyan: "#38E1FF",
          green: "#2BD9A4",
          red: "#FF5A7A",
          amber: "#F5B544",
        },
      },
      fontFamily: {
        sans: [
          "InterVariable",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,92,255,0.25), 0 8px 30px rgba(124,92,255,0.12)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse at top, rgba(124,92,255,0.12), transparent 60%)",
      },
    },
  },
  plugins: [],
};
