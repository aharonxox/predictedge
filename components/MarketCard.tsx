import { ArrowUpRight } from "lucide-react";
import type { MarketSummary } from "@/types";

export function MarketCard({ market }: { market: MarketSummary }) {
  const venueLabel = market.venue === "kalshi" ? "Kalshi" : "Polymarket";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-bg-card/70 p-5 flex flex-col gap-4 hover:border-accent/40 hover:bg-bg-card transition">
      <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-accent-cyan/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-ink-soft flex-wrap">
          <span
            className={`rounded-full px-2 py-0.5 font-medium ${
              market.venue === "kalshi"
                ? "bg-accent-cyan/15 text-accent-cyan"
                : "bg-accent/15 text-accent"
            }`}
          >
            {venueLabel}
          </span>
          <span className="chip">{market.category}</span>
          <span className="chip capitalize">{market.liquidity} liquidity</span>
        </div>
        <a
          href={market.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="text-ink-soft hover:text-ink"
          aria-label="Open source"
        >
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      <h3 className="relative text-[15px] font-semibold leading-snug tracking-tight">
        {market.title}
      </h3>

      <div className="relative grid grid-cols-4 gap-3 text-xs">
        <Stat
          label="YES"
          mono
          value={
            <span className="text-accent-green font-semibold">
              ${market.yesPrice.toFixed(2)}
            </span>
          }
        />
        <Stat
          label="NO"
          mono
          value={
            <span className="text-accent-red font-semibold">
              ${market.noPrice.toFixed(2)}
            </span>
          }
        />
        <Stat label="24h Vol" mono value={`$${compact(market.volume24h)}`} />
        <Stat label="OI" mono value={`$${compact(market.openInterest)}`} />
      </div>

      <div className="relative flex items-center justify-between text-xs text-ink-soft">
        <span>Closes {new Date(market.closeDate).toLocaleDateString()}</span>
        <span className="font-mono text-ink-mute">{market.id}</span>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-ink-mute">{label}</span>
      <span className={`text-ink ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
