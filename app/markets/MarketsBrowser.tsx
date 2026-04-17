"use client";

import { useMemo, useState } from "react";
import type { MarketSummary, MarketVenue } from "@/types";

type VenueFilter = MarketVenue | "all";

export function MarketsBrowser({
  markets,
  children,
}: {
  markets: MarketSummary[];
  children: (filtered: MarketSummary[]) => React.ReactNode;
}) {
  const [venue, setVenue] = useState<VenueFilter>("all");
  const [category, setCategory] = useState<string>("all");
  const [q, setQ] = useState("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const m of markets) set.add(m.category);
    return ["all", ...Array.from(set).sort()];
  }, [markets]);

  const filtered = useMemo(() => {
    return markets.filter((m) => {
      if (venue !== "all" && m.venue !== venue) return false;
      if (category !== "all" && m.category !== category) return false;
      if (q.trim()) {
        const needle = q.trim().toLowerCase();
        if (!m.title.toLowerCase().includes(needle)) return false;
      }
      return true;
    });
  }, [markets, venue, category, q]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 md:items-center mb-5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search markets…"
          className="h-10 w-full md:w-80 rounded-lg border border-line bg-bg-card px-3 text-sm placeholder:text-ink-mute focus:border-accent/60 outline-none"
        />
        <div className="flex items-center gap-2">
          {(["all", "kalshi", "polymarket"] as VenueFilter[]).map((v) => (
            <button
              key={v}
              onClick={() => setVenue(v)}
              className={`rounded-lg px-3 h-10 text-sm border transition ${
                venue === v
                  ? "border-accent text-ink bg-accent/10"
                  : "border-line text-ink-soft hover:text-ink"
              }`}
            >
              {v === "all" ? "All venues" : v === "kalshi" ? "Kalshi" : "Polymarket"}
            </button>
          ))}
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 rounded-lg border border-line bg-bg-card px-3 text-sm"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c}
            </option>
          ))}
        </select>
      </div>
      {children(filtered)}
    </div>
  );
}
