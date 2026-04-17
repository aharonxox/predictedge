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
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between px-6 py-5 border-b border-line/70 bg-bg/40 backdrop-blur sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-ink-soft mt-1 max-w-2xl">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        {trial ? (
          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
              trial.expired
                ? "border-accent-red/30 text-accent-red bg-accent-red/10"
                : "border-line text-ink-soft bg-bg-card"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            {trial.expired
              ? "Trial ended"
              : `Trial: ${trial.daysRemaining}d ${trial.hoursRemaining}h left`}
          </div>
        ) : null}
        {right}
      </div>
    </div>
  );
}
