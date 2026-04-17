import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PredictionEdge — AI-powered prediction market analysis",
  description:
    "PredictionEdge gives traders an AI edge on Kalshi and Polymarket with daily picks, live market intelligence, and an AI research analyst powered by NVIDIA NIM.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  openGraph: {
    title: "PredictionEdge",
    description:
      "AI-powered prediction market analysis for Kalshi and Polymarket.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
