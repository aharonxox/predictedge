import { ArrowUpRight } from "lucide-react";
import type { MarketSummary } from "@/types";

export function MarketCard({ market }: { market: MarketSummary }) {
  const venueLabel = market.venue === "kalshi" ? "Kalshi" : "Polymarket";

  return (
    <div className="rounded-2xl border border-line bg-bg-card p-5 flex flex-col gap-4 hover:border-accent/40 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-ink-soft">
          <span
            className={`rounded-full px-2 py-0.5 font-medium ${
              market.venue === "kalshi"
                ? "bg-accent-cyan/10 text-accent-cyan"
                : "bg-accent/10 text-accent"
            }`}
          >
            {venueLabel}
          </span>
          <span className="rounded-full bg-bg-elev px-2 py-0.5">{market.category}</span>
          <span className="rounded-full bg-bg-elev px-2 py-0.5 capitalize">
            {market.liquidity} liquidity
          </span>
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

      <h3 className="text-[15px] font-semibold leading-snug">{market.title}</h3>

      <div className="grid grid-cols-4 gap-3 text-xs">
        <Stat
          label="YES"
          value={
            <span className="text-accent-green font-semibold">
              ${market.yesPrice.toFixed(2)}
            </span>
          }
        />
        <Stat
          label="NO"
          value={
            <span className="text-accent-red font-semibold">
              ${market.noPrice.toFixed(2)}
            </span>
          }
        />
        <Stat label="24h Vol" value={`$${compact(market.volume24h)}`} />
        <Stat label="OI" value={`$${compact(market.openInterest)}`} />
      </div>

      <div className="flex items-center justify-between text-xs text-ink-soft">
        <span>Closes {new Date(market.closeDate).toLocaleDateString()}</span>
        <span className="font-mono text-ink-mute">{market.id}</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-ink-mute">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}

function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
