/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#05060A",
          soft: "#080A10",
          card: "#0C0F17",
          elev: "#11151F",
          ridge: "#161B28",
        },
        line: {
          DEFAULT: "#1C2230",
          soft: "#141928",
          strong: "#262D42",
        },
        ink: {
          DEFAULT: "#F2F4FA",
          soft: "#ABB1C4",
          mute: "#6B7286",
        },
        accent: {
          DEFAULT: "#7C5CFF",
          deep: "#5B3BFF",
          cyan: "#38E1FF",
          green: "#2BD9A4",
          red: "#FF5A7A",
          amber: "#F5B544",
          rose: "#FF7AC6",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
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
          "var(--font-mono)",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        display: [
          "var(--font-sans)",
          "InterVariable",
          "Inter",
          "ui-sans-serif",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,92,255,0.30), 0 10px 40px -10px rgba(124,92,255,0.45)",
        "glow-cyan":
          "0 0 0 1px rgba(56,225,255,0.25), 0 10px 40px -10px rgba(56,225,255,0.35)",
        lift: "0 24px 60px -24px rgba(0,0,0,0.7), 0 1px 0 0 rgba(255,255,255,0.04) inset",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse at top, rgba(124,92,255,0.12), transparent 60%)",
        noise:
          "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
      },
      keyframes: {
        aurora: {
          "0%,100%": { transform: "translate3d(0,0,0) rotate(0deg)" },
          "50%": { transform: "translate3d(4%,-3%,0) rotate(6deg)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "marquee-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(124,92,255,0.5)" },
          "50%": { boxShadow: "0 0 0 12px rgba(124,92,255,0)" },
        },
      },
      animation: {
        aurora: "aurora 14s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 2.8s linear infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        "marquee-x": "marquee-x 40s linear infinite",
        "pulse-ring": "pulse-ring 2.2s ease-out infinite",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
