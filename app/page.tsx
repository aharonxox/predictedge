import Link from "next/link";
import {
  Sparkles,
  Target,
  LineChart,
  ShieldCheck,
  Brain,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Logo />
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/login" className="text-ink-soft hover:text-ink px-3 py-2">
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-accent to-[#6a4bff] px-4 py-2 font-medium text-white shadow-glow hover:brightness-110"
          >
            Start free trial <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero-grid">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-card/60 px-3 py-1 text-xs text-ink-soft">
            <Sparkles className="h-3.5 w-3.5 text-accent-cyan" />
            Powered by NVIDIA NIM · grounded in Prediction Arena
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            An AI edge on
            <br />
            <span className="bg-gradient-to-r from-accent-cyan via-accent to-[#b39bff] bg-clip-text text-transparent">
              prediction markets.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-ink-soft text-[15px] md:text-base leading-relaxed">
            PredictionEdge turns live Kalshi &amp; Polymarket data into actionable
            research: daily top-5 picks, market intelligence, and an AI analyst
            you can chat with. Start with a 10-day free trial — no billing, no
            credit card.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-accent to-[#6a4bff] px-5 py-2.5 font-medium text-white shadow-glow hover:brightness-110"
            >
              Start 10-day free trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-5 py-2.5 text-ink-soft hover:text-ink hover:bg-bg-elev"
            >
              I already have an account
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-xs text-ink-soft">
            <Stat label="Daily top picks" value="5" />
            <Stat label="Markets tracked" value="Kalshi + Polymarket" />
            <Stat label="Free trial" value="10 days" />
            <Stat label="Billing" value="None" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-4">
          <Feature
            Icon={Target}
            title="Top 5 daily picks"
            desc="Highest-edge binary contracts across Kalshi and Polymarket, with entry, target, rationale, and confidence — refreshed every trading day."
          />
          <Feature
            Icon={LineChart}
            title="Live market intelligence"
            desc="Browse categorized markets with YES / NO, 24h volume, open interest, liquidity, and the exact settlement window."
          />
          <Feature
            Icon={Brain}
            title="AI research analyst"
            desc="Chat with an NVIDIA NIM-powered analyst grounded in Prediction Arena methodology, favorite-longshot bias, and EV reasoning."
          />
          <Feature
            Icon={Clock}
            title="Real trial, fairly tracked"
            desc="A 10-day free trial tracked server-side from signup. You always know exactly how long you have."
          />
          <Feature
            Icon={ShieldCheck}
            title="Secure Supabase auth"
            desc="Email + password, password reset, protected routes, and JWT sessions — the patterns your team already trusts."
          />
          <Feature
            Icon={Sparkles}
            title="Dark, fast, responsive"
            desc="A Linear / Perplexity-style UI built in Next.js 14 and Tailwind. Ships on Vercel."
          />
        </div>
      </section>

      <footer className="border-t border-line/60">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-mute">
          <div className="flex items-center gap-2">
            <Logo size={22} />
            <span>© {new Date().getFullYear()} PredictionEdge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/signup" className="hover:text-ink">
              Get started
            </Link>
            <Link href="/login" className="hover:text-ink">
              Log in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-bg-card/60 px-4 py-3">
      <div className="text-ink text-sm font-medium">{value}</div>
      <div className="mt-0.5">{label}</div>
    </div>
  );
}

function Feature({
  Icon,
  title,
  desc,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-bg-card p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">{desc}</p>
    </div>
  );
}
