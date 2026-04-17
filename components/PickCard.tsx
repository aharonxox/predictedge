import { ArrowUpRight, Flame } from "lucide-react";
import type { DailyPick } from "@/types";

export function PickCard({ pick }: { pick: DailyPick }) {
  const venueLabel = pick.venue === "kalshi" ? "Kalshi" : "Polymarket";
  const sideColor =
    pick.side === "YES" ? "text-accent-green" : "text-accent-red";
  const edgeColor =
    pick.edgePct >= 10
      ? "text-accent-green"
      : pick.edgePct >= 5
        ? "text-accent-cyan"
        : "text-ink-soft";

  return (
    <div className="rounded-2xl border border-line bg-bg-card p-5 flex flex-col gap-4 hover:border-accent/40 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 text-accent px-2 py-0.5 font-medium">
            <Flame className="h-3 w-3" /> #{pick.rank}
          </span>
          <span className="rounded-full bg-bg-elev px-2 py-0.5">{venueLabel}</span>
          <span className="rounded-full bg-bg-elev px-2 py-0.5">
            Closes {new Date(pick.closeDate).toLocaleDateString()}
          </span>
        </div>
        <a
          href={pick.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="text-ink-soft hover:text-ink"
          aria-label="Open source"
        >
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      <h3 className="text-[15px] font-semibold leading-snug">{pick.title}</h3>

      <div className="grid grid-cols-4 gap-3 text-xs">
        <Stat label="Side" value={<span className={`font-semibold ${sideColor}`}>{pick.side}</span>} />
        <Stat label="Entry" value={`$${pick.entryPrice.toFixed(2)}`} />
        <Stat label="Target" value={`$${pick.targetPrice.toFixed(2)}`} />
        <Stat
          label="Edge"
          value={<span className={`font-semibold ${edgeColor}`}>{pick.edgePct.toFixed(1)}%</span>}
        />
      </div>

      <div className="h-px bg-line" />

      <div className="flex items-center gap-2 text-[11px] text-ink-soft flex-wrap">
        {pick.signals.map((s) => (
          <span key={s} className="rounded-full bg-bg-elev px-2 py-0.5">
            {s}
          </span>
        ))}
      </div>

      <p className="text-sm text-ink-soft leading-relaxed">{pick.rationale}</p>

      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-mute">Confidence</span>
        <span className="font-medium text-ink">{pick.confidence}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-bg-elev overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-cyan to-accent"
          style={{ width: `${pick.confidence}%` }}
        />
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
