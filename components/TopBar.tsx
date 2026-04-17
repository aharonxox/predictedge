"use client";

import { Clock } from "lucide-react";
import type { TrialStatus } from "@/types";

export function TopBar({
  title,
  subtitle,
  trial,
  right,
}: {
  title: string;
  subtitle?: string;
  trial?: TrialStatus;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between px-6 py-5 border-b border-line/60 bg-bg-soft/50 backdrop-blur-xl sticky top-0 z-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tightest">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-ink-soft mt-1 max-w-2xl">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        {trial ? <TrialPill trial={trial} /> : null}
        {right}
      </div>
    </div>
  );
}

function TrialPill({ trial }: { trial: TrialStatus }) {
  if (trial.expired) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-accent-red/30 bg-accent-red/10 px-3 py-1.5 text-xs text-accent-red">
        <Clock className="h-3.5 w-3.5" />
        Trial ended
      </div>
    );
  }
  const pctLeft = Math.max(
    0,
    Math.min(100, Math.round((trial.daysRemaining / trial.totalDays) * 100)),
  );
  return (
    <div className="flex items-center gap-3 rounded-full border border-line bg-bg-card/60 backdrop-blur px-3 py-1.5 text-xs">
      <span className="flex items-center gap-1.5 text-ink-soft">
        <Clock className="h-3.5 w-3.5" />
        Trial
      </span>
      <div className="h-1 w-16 rounded-full bg-line overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent-cyan"
          style={{ width: `${pctLeft}%` }}
        />
      </div>
      <span className="font-mono text-ink">
        {trial.daysRemaining}d {trial.hoursRemaining}h
      </span>
    </div>
  );
}
