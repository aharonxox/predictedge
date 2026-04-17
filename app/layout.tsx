import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "PredictionEdge — An AI edge on prediction markets",
  description:
    "PredictionEdge gives traders an AI edge on Kalshi and Polymarket — daily picks, live market intelligence, and an NVIDIA NIM-powered research analyst grounded in Prediction Arena.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  openGraph: {
    title: "PredictionEdge",
    description:
      "AI-powered prediction market analysis for Kalshi and Polymarket.",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%237C5CFF'/><stop offset='100%' stop-color='%2338E1FF'/></linearGradient></defs><rect width='32' height='32' rx='8' fill='%23070810'/><path d='M6 22 L12 14 L16 18 L22 8 L26 12' stroke='url(%23g)' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/></svg>",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-bg text-ink font-sans antialiased selection:bg-accent/30 selection:text-ink">
        {children}
      </body>
    </html>
  );
}
