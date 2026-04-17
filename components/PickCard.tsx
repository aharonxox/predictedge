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
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-bg-card/70 p-5 flex flex-col gap-4 hover:border-accent/40 hover:bg-bg-card transition">
      <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-accent/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-ink-soft flex-wrap">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 text-accent px-2 py-0.5 font-medium">
            <Flame className="h-3 w-3" /> #{pick.rank}
          </span>
          <span className="chip">{venueLabel}</span>
          <span className="chip">
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

      <h3 className="relative text-[15px] font-semibold leading-snug tracking-tight">
        {pick.title}
      </h3>

      <div className="relative grid grid-cols-4 gap-3 text-xs">
        <Stat
          label="Side"
          value={<span className={`font-semibold ${sideColor}`}>{pick.side}</span>}
        />
        <Stat label="Entry" value={`$${pick.entryPrice.toFixed(2)}`} mono />
        <Stat label="Target" value={`$${pick.targetPrice.toFixed(2)}`} mono />
        <Stat
          label="Edge"
          mono
          value={
            <span className={`font-semibold ${edgeColor}`}>
              {pick.edgePct.toFixed(1)}%
            </span>
          }
        />
      </div>

      <div className="relative h-px bg-line" />

      <div className="relative flex items-center gap-1.5 text-[11px] text-ink-soft flex-wrap">
        {pick.signals.map((s) => (
          <span key={s} className="chip">
            {s}
          </span>
        ))}
      </div>

      <p className="relative text-sm text-ink-soft leading-relaxed">
        {pick.rationale}
      </p>

      <div className="relative flex items-center justify-between text-xs">
        <span className="text-ink-mute">Confidence</span>
        <span className="font-medium text-ink font-mono">
          {pick.confidence}%
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-line overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-cyan via-accent to-accent-rose"
          style={{ width: `${pick.confidence}%` }}
        />
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
