import Link from "next/link";
import {
  Sparkles,
  Target,
  LineChart,
  ShieldCheck,
  Brain,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Zap,
  Activity,
  TrendingUp,
  TrendingDown,
  Check,
  Terminal,
  Bot,
  Radar,
} from "lucide-react";
import { Logo } from "@/components/Logo";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* ------------------------------------------------------------ */}
      {/* Top navigation                                               */}
      {/* ------------------------------------------------------------ */}
      <header className="sticky top-0 z-50 px-4 md:px-6 py-3">
        <div className="mx-auto max-w-6xl rounded-full glass flex items-center justify-between px-3 py-2">
          <Link href="/" className="flex items-center gap-2 pl-2">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-[13px] text-ink-soft">
            <a href="#features" className="px-3 py-1.5 rounded-full hover:text-ink hover:bg-white/5">
              Features
            </a>
            <a href="#edge" className="px-3 py-1.5 rounded-full hover:text-ink hover:bg-white/5">
              The edge
            </a>
            <a href="#analyst" className="px-3 py-1.5 rounded-full hover:text-ink hover:bg-white/5">
              AI analyst
            </a>
            <a href="#faq" className="px-3 py-1.5 rounded-full hover:text-ink hover:bg-white/5">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-[13px] text-ink-soft hover:text-ink px-3 py-1.5 rounded-full"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="group inline-flex items-center gap-1.5 rounded-full bg-white text-bg px-4 py-1.5 text-[13px] font-medium hover:bg-ink-soft transition"
            >
              Start free trial
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------ */}
      {/* Hero                                                          */}
      {/* ------------------------------------------------------------ */}
      <section className="relative">
        <div className="absolute inset-0 hero-grid" />
        <div className="absolute inset-0 aurora" />
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-28 text-center">
          <div className="inline-flex items-center gap-2 chip mb-6 animate-fade-up">
            <span className="dot" />
            Live · Powered by NVIDIA NIM · grounded in Prediction Arena
          </div>

          <h1 className="text-[40px] leading-[1.02] md:text-[76px] md:leading-[0.98] font-semibold tracking-tightest text-gradient animate-fade-up">
            An AI edge on
            <br />
            prediction markets.
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-[15px] md:text-lg text-ink-soft leading-relaxed animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            PredictionEdge turns live Kalshi &amp; Polymarket data into sharp
            research: top-5 daily picks, streaming market intelligence, and an
            AI analyst you can chat with. Ten-day free trial. No billing. No
            card.
          </p>

          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-up"
            style={{ animationDelay: "220ms" }}
          >
            <Link
              href="/signup"
              className="group inline-flex items-center gap-1.5 rounded-full bg-white text-bg px-5 py-2.5 text-sm font-medium hover:bg-ink-soft transition shadow-lift"
            >
              Start 10-day free trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#edge"
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-white/[0.02] px-5 py-2.5 text-sm text-ink-soft hover:text-ink hover:bg-white/[0.05] transition"
            >
              See how the edge works
            </Link>
          </div>

          <p
            className="mt-5 text-xs text-ink-mute animate-fade-up"
            style={{ animationDelay: "320ms" }}
          >
            No Stripe. No subscription. No credit card. Just research.
          </p>

          {/* Ticker */}
          <div
            className="mt-14 marquee-mask overflow-hidden animate-fade-up"
            style={{ animationDelay: "420ms" }}
          >
            <div className="flex gap-3 w-max animate-marquee-x">
              {[...SAMPLE_TICKER, ...SAMPLE_TICKER].map((t, i) => (
                <TickerPill key={i} {...t} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Bento grid                                                    */}
      {/* ------------------------------------------------------------ */}
      <section id="features" className="relative max-w-6xl mx-auto px-6 py-24">
        <SectionEyebrow>Product</SectionEyebrow>
        <SectionTitle>
          A research desk, not a <span className="text-gradient-soft">dashboard</span>.
        </SectionTitle>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Everything you need to reason probabilistically about Kalshi and
          Polymarket contracts — woven into one calm, fast workspace.
        </p>

        <div className="mt-12 grid grid-cols-12 gap-4 auto-rows-[180px]">
          {/* Big: Daily picks preview */}
          <BentoCard className="col-span-12 md:col-span-8 md:row-span-2 group">
            <div className="relative h-full flex flex-col p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                    <Target className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Top 5 daily picks</span>
                </div>
                <span className="chip">
                  <span className="dot" />
                  refreshed · hourly
                </span>
              </div>
              <p className="mt-2 max-w-md text-sm text-ink-soft">
                Highest-edge binary contracts, ranked transparently. Entry,
                target, confidence, rationale, signals.
              </p>
              <div className="relative mt-6 flex-1">
                <div className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2 gap-3 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
                  {SAMPLE_PICKS.map((p, i) => (
                    <PickPreview key={i} {...p} />
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* AI analyst */}
          <BentoCard className="col-span-12 md:col-span-4 md:row-span-1">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-accent-cyan/15 text-accent-cyan flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">AI research analyst</span>
              </div>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                Chat with an NVIDIA NIM-powered analyst grounded in Prediction
                Arena methodology — EV, favorite-longshot, base rates.
              </p>
            </div>
          </BentoCard>

          {/* Trial */}
          <BentoCard className="col-span-12 md:col-span-4 md:row-span-1">
            <div className="p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-accent-green/15 text-accent-green flex items-center justify-center">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">10-day free trial</span>
                </div>
                <p className="mt-2 text-sm text-ink-soft">
                  Server-tracked. Fair. No billing anywhere in the app.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-line overflow-hidden">
                  <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-accent to-accent-cyan" />
                </div>
                <span className="font-mono text-xs text-ink-soft">6 / 10d</span>
              </div>
            </div>
          </BentoCard>

          {/* Markets */}
          <BentoCard className="col-span-12 md:col-span-4 md:row-span-1">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-accent-rose/15 text-accent-rose flex items-center justify-center">
                  <LineChart className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Kalshi + Polymarket</span>
              </div>
              <p className="mt-2 text-sm text-ink-soft">
                Both venues, side by side. Filter by category, search, liquidity.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="chip">Macro</span>
                <span className="chip">AI</span>
                <span className="chip">Markets</span>
                <span className="chip">+9</span>
              </div>
            </div>
          </BentoCard>

          {/* Arena intelligence */}
          <BentoCard className="col-span-12 md:col-span-8 md:row-span-1">
            <div className="p-6 h-full flex items-center gap-6">
              <div className="relative shrink-0 h-24 w-24 rounded-2xl border border-line overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(124,92,255,0.4),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(56,225,255,0.35),transparent_60%)]" />
                <Radar className="absolute inset-0 m-auto h-10 w-10 text-ink-soft" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Prediction Arena intelligence</span>
                  <span className="chip">live</span>
                </div>
                <p className="mt-1 text-sm text-ink-soft leading-relaxed max-w-md">
                  Methodology, rankings, recent agent trades and confidence
                  signals — scraped, normalized, and fused into every pick.
                </p>
              </div>
            </div>
          </BentoCard>

          {/* Security */}
          <BentoCard className="col-span-6 md:col-span-4 md:row-span-1">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-accent-amber/15 text-accent-amber flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Supabase auth</span>
              </div>
              <p className="mt-2 text-sm text-ink-soft">
                Email + password, JWT sessions, protected routes, password
                reset.
              </p>
            </div>
          </BentoCard>

          {/* Speed */}
          <BentoCard className="col-span-6 md:col-span-4 md:row-span-1">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                  <Zap className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Built for speed</span>
              </div>
              <p className="mt-2 text-sm text-ink-soft">
                Next.js 14, server components, edge-ready. Cold starts are not
                your problem.
              </p>
            </div>
          </BentoCard>

          {/* Premium UI */}
          <BentoCard className="col-span-12 md:col-span-4 md:row-span-1">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-accent-cyan/15 text-accent-cyan flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Dark premium UI</span>
              </div>
              <p className="mt-2 text-sm text-ink-soft">
                Linear / Perplexity-style interface. Fluid on mobile and
                desktop.
              </p>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* How the edge is built (code-brutalism section)                */}
      {/* ------------------------------------------------------------ */}
      <section id="edge" className="relative max-w-6xl mx-auto px-6 py-24">
        <SectionEyebrow>How</SectionEyebrow>
        <SectionTitle>
          The edge, <span className="text-gradient-soft">deconstructed</span>.
        </SectionTitle>
        <p className="mt-3 max-w-2xl text-ink-soft">
          PredictionEdge fuses four layers of intelligence into every pick. No
          black boxes — every score is traceable.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          <div className="gradient-border">
            <div className="p-6">
              <div className="chip">
                <Terminal className="h-3.5 w-3.5" />
                <span className="font-mono text-[11px]">pipeline.ts</span>
              </div>
              <pre className="mt-5 font-mono text-[12px] leading-relaxed text-ink-soft overflow-x-auto">
{`// ------- edge pipeline
const arena  = await fetchPredictionArena();   // methodology + agents
const quotes = await listMarkets();             // kalshi + polymarket
const fair   = estimateFairValue(quote, arena);
const edge   = fair - quote.entry;              // bps of edge
const conf   = confidence(edge, liquidity, arena.signals);

return {
  rank: byEdge(picks).slice(0, 5),
  rationale: explain(picks, arena),
};`}
              </pre>
            </div>
          </div>

          <div className="grid gap-4">
            <StepCard
              n="01"
              title="Scrape & normalize"
              desc="We pull methodology, rankings, recent trades, and confidence signals from Prediction Arena every few minutes."
            />
            <StepCard
              n="02"
              title="Score the edge"
              desc="Fair-value vs. entry price, adjusted for liquidity, favorite-longshot bias, and agent consensus from Arena."
            />
            <StepCard
              n="03"
              title="Explain it"
              desc="Every pick ships with rationale, signals, entry/target, and confidence. You see why, not just what."
            />
            <StepCard
              n="04"
              title="Talk to the analyst"
              desc="Ask the NVIDIA NIM-powered chat for a second opinion, context on a specific contract, or a research checklist."
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* AI analyst showcase                                           */}
      {/* ------------------------------------------------------------ */}
      <section id="analyst" className="relative max-w-6xl mx-auto px-6 py-24">
        <SectionEyebrow>Analyst</SectionEyebrow>
        <SectionTitle>
          Ask it anything. <span className="text-gradient-soft">It reasons out loud.</span>
        </SectionTitle>

        <div className="mt-10 gradient-border">
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Research chat</span>
              </div>
              <span className="chip font-mono text-[11px]">meta/llama-3.1-70b</span>
            </div>
            <div className="mt-5 space-y-4">
              <ChatLine
                from="user"
                body="Walk me through pricing a Fed December rate-cut contract on Kalshi."
              />
              <ChatLine
                from="ai"
                body={`**Base rate.** Start with the market-implied probability from the current Fed funds future — call it ~46%.

**Adjust.** Weight by (a) next CPI surprise direction, (b) FOMC dot-plot skew, (c) liquidity — this contract on Kalshi has thin OI, so your fair value should be wider.

**Cross-check.** Polymarket has the same event at **52¢ YES**. That's a ~6¢ spread.

**Action.** If you think CPI prints soft, bias YES at ≤ **48¢** on Kalshi with a target ~**56¢** and a 30% sizing given liquidity. Walk away if it ticks above **51¢**.`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Numbers                                                       */}
      {/* ------------------------------------------------------------ */}
      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile value="5" label="Daily picks" />
          <StatTile value="Kalshi + Polymarket" label="Venues tracked" />
          <StatTile value="10 days" label="Free trial" />
          <StatTile value="0" label="Billing screens" />
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* FAQ                                                           */}
      {/* ------------------------------------------------------------ */}
      <section id="faq" className="relative max-w-3xl mx-auto px-6 py-24">
        <SectionEyebrow>FAQ</SectionEyebrow>
        <SectionTitle>
          Good questions, <span className="text-gradient-soft">short answers.</span>
        </SectionTitle>

        <div className="mt-10 divide-y divide-line border-y border-line">
          <FAQ
            q="Is there billing?"
            a="No — there's no Stripe, no subscription, no checkout anywhere in the product. Every account gets a 10-day free trial tracked from signup."
          />
          <FAQ
            q="Where do the picks come from?"
            a="A deterministic edge score over Kalshi + Polymarket contracts, blended with live research context scraped from Prediction Arena (methodology, rankings, recent agent trades, and confidence signals)."
          />
          <FAQ
            q="What powers the AI chat?"
            a="NVIDIA NIM's OpenAI-compatible /v1/chat/completions endpoint with meta/llama-3.1-70b-instruct, grounded via a system prompt built from normalized Arena context. If the upstream is down, we render a structured fallback response."
          />
          <FAQ
            q="Is this financial advice?"
            a="No — PredictionEdge is a research tool. Signals, edges, and rationales are explicit and transparent, but every trade is your decision."
          />
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* CTA                                                           */}
      {/* ------------------------------------------------------------ */}
      <section className="relative max-w-6xl mx-auto px-6 pb-24">
        <div className="gradient-border">
          <div className="relative overflow-hidden p-10 md:p-14 text-center">
            <div className="absolute inset-0 aurora opacity-60" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tightest text-gradient">
                Your 10 days start now.
              </h2>
              <p className="mt-3 max-w-xl mx-auto text-ink-soft">
                Sign up, open the dashboard, read your first five picks. Zero
                friction, zero billing.
              </p>
              <div className="mt-7 flex items-center justify-center gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-bg px-5 py-2.5 text-sm font-medium hover:bg-ink-soft transition shadow-lift"
                >
                  Start free trial <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink-soft hover:text-ink transition"
                >
                  I already have an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line/60">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-mute">
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
            <span className="font-mono">v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Sub-components (landing-page local)                                   */
/* -------------------------------------------------------------------- */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs text-ink-mute">
      <span className="h-px w-8 bg-gradient-to-r from-accent to-transparent" />
      <span className="font-mono uppercase tracking-[0.2em]">{children}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tightest leading-[1.05]">
      {children}
    </h2>
  );
}

function BentoCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-line bg-bg-card/70 hover:border-line-strong hover:bg-bg-card transition ${className}`}
    >
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      {children}
    </div>
  );
}

function PickPreview({
  title,
  venue,
  side,
  price,
  edge,
  signal,
}: {
  title: string;
  venue: "Kalshi" | "Polymarket";
  side: "YES" | "NO";
  price: number;
  edge: number;
  signal: "up" | "down";
}) {
  return (
    <div className="rounded-xl border border-line bg-bg-elev/70 p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-ink-mute">
        <span>{venue}</span>
        <span className="font-mono">+{edge.toFixed(1)}% edge</span>
      </div>
      <div className="text-[13px] text-ink line-clamp-2 leading-snug">
        {title}
      </div>
      <div className="flex items-center justify-between">
        <span
          className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md ${
            side === "YES"
              ? "bg-accent-green/15 text-accent-green"
              : "bg-accent-red/15 text-accent-red"
          }`}
        >
          {side}
        </span>
        <div className="flex items-center gap-1 font-mono text-xs">
          <span className="text-ink">{price}¢</span>
          {signal === "up" ? (
            <TrendingUp className="h-3.5 w-3.5 text-accent-green" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-accent-red" />
          )}
        </div>
      </div>
    </div>
  );
}

function TickerPill({
  venue,
  title,
  price,
  delta,
}: {
  venue: "Kalshi" | "Polymarket";
  title: string;
  price: number;
  delta: number;
}) {
  const up = delta >= 0;
  return (
    <div className="flex items-center gap-3 rounded-full border border-line bg-bg-card/60 backdrop-blur px-4 py-1.5 whitespace-nowrap">
      <span className="text-[11px] font-mono text-ink-mute">{venue}</span>
      <span className="text-[12px] text-ink-soft">{title}</span>
      <span className="text-[12px] font-mono text-ink">{price}¢</span>
      <span
        className={`text-[11px] font-mono ${
          up ? "text-accent-green" : "text-accent-red"
        }`}
      >
        {up ? "+" : ""}
        {delta.toFixed(1)}%
      </span>
    </div>
  );
}

function StepCard({
  n,
  title,
  desc,
}: {
  n: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-bg-card p-5">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-ink-mute">{n}</span>
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="mt-2 text-sm text-ink-soft">{desc}</p>
    </div>
  );
}

function ChatLine({ from, body }: { from: "user" | "ai"; body: string }) {
  if (from === "user") {
    return (
      <div className="flex gap-3 justify-end">
        <div className="max-w-[80%] rounded-2xl bg-accent text-white px-4 py-3 text-sm">
          {body}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-accent/15 text-accent flex items-center justify-center">
        <Bot className="h-4 w-4" />
      </div>
      <div className="max-w-[80%] rounded-2xl bg-bg-elev text-ink px-4 py-3 text-sm leading-relaxed">
        {body.split("\n").map((line, i) => {
          const t = line.trim();
          if (!t) return <br key={i} />;
          const parts = t.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p key={i} className="my-1">
              {parts.map((p, j) =>
                /^\*\*[^*]+\*\*$/.test(p) ? (
                  <strong key={j}>{p.replace(/\*\*/g, "")}</strong>
                ) : (
                  <span key={j}>{p}</span>
                ),
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="gradient-border">
      <div className="p-5">
        <div className="font-semibold text-lg md:text-xl tracking-tight">
          {value}
        </div>
        <div className="mt-1 text-xs text-ink-mute">{label}</div>
      </div>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-5">
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <span className="text-[15px] font-medium">{q}</span>
        <span className="h-7 w-7 rounded-full border border-line grid place-items-center text-ink-soft group-open:rotate-45 transition">
          <Check className="h-3.5 w-3.5" />
        </span>
      </summary>
      <p className="mt-3 text-sm text-ink-soft leading-relaxed">{a}</p>
    </details>
  );
}

/* -------------------------------------------------------------------- */
/* Sample preview data (marketing only — real data lives server-side)    */
/* -------------------------------------------------------------------- */

const SAMPLE_PICKS = [
  {
    title: "Fed cuts by 25bps at December meeting",
    venue: "Kalshi" as const,
    side: "YES" as const,
    price: 48,
    edge: 6.4,
    signal: "up" as const,
  },
  {
    title: "BTC closes above $125k on Dec 31",
    venue: "Polymarket" as const,
    side: "NO" as const,
    price: 61,
    edge: 4.1,
    signal: "down" as const,
  },
  {
    title: "S&P 500 makes new ATH this week",
    venue: "Kalshi" as const,
    side: "YES" as const,
    price: 37,
    edge: 5.8,
    signal: "up" as const,
  },
  {
    title: "Best Picture goes to `The Brutalist`",
    venue: "Polymarket" as const,
    side: "YES" as const,
    price: 22,
    edge: 3.7,
    signal: "up" as const,
  },
];

const SAMPLE_TICKER = [
  { venue: "Kalshi" as const, title: "Fed cuts Dec", price: 48, delta: 1.4 },
  { venue: "Polymarket" as const, title: "BTC > $125k", price: 61, delta: -0.9 },
  { venue: "Kalshi" as const, title: "S&P new ATH", price: 37, delta: 2.1 },
  { venue: "Polymarket" as const, title: "US GDP > 2.4%", price: 29, delta: 0.6 },
  { venue: "Kalshi" as const, title: "NYC mayor D", price: 82, delta: -0.2 },
  { venue: "Polymarket" as const, title: "Apple M5 Q1", price: 54, delta: 1.8 },
  { venue: "Kalshi" as const, title: "CPI > 2.9%", price: 40, delta: -1.2 },
  { venue: "Polymarket" as const, title: "Msft > $4T", price: 33, delta: 0.4 },
];
