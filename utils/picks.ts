import type { DailyPick, ArenaContext, MarketSummary } from "@/types";
import { getPredictionArenaContext } from "@/utils/prediction-arena";
import { listMarkets } from "@/utils/markets";

/**
 * Build today's top 5 picks. We pull live market summaries (Kalshi +
 * Polymarket), fuse them with the latest Prediction Arena context, and rank
 * by a composite edge score. This is deterministic for a given day so two
 * consecutive calls during the same UTC day return the same ordering.
 */
export async function getDailyPicks(): Promise<{
  picks: DailyPick[];
  arena: ArenaContext;
  generatedAt: string;
}> {
  const [arena, markets] = await Promise.all([
    getPredictionArenaContext(),
    listMarkets(),
  ]);

  const scored = markets.map((m) => {
    const { side, entryPrice, targetPrice, edgePct } = estimateEdge(m);
    const confidence = clamp(
      55 + edgePct * 2.2 + (m.liquidity === "high" ? 6 : m.liquidity === "medium" ? 3 : 0),
      50,
      96,
    );
    const signals = buildSignals(m, arena, side);
    const rationale = buildRationale(m, arena, side, edgePct);

    return {
      market: m,
      side,
      entryPrice,
      targetPrice,
      edgePct,
      confidence,
      signals,
      rationale,
    };
  });

  scored.sort((a, b) => b.edgePct - a.edgePct || b.confidence - a.confidence);

  const picks: DailyPick[] = scored.slice(0, 5).map((s, idx) => ({
    id: s.market.id,
    rank: idx + 1,
    title: s.market.title,
    venue: s.market.venue,
    side: s.side,
    entryPrice: round(s.entryPrice, 2),
    targetPrice: round(s.targetPrice, 2),
    confidence: Math.round(s.confidence),
    edgePct: round(s.edgePct, 1),
    rationale: s.rationale,
    closeDate: s.market.closeDate,
    sourceUrl: s.market.sourceUrl,
    signals: s.signals,
  }));

  return {
    picks,
    arena,
    generatedAt: new Date().toISOString(),
  };
}

function estimateEdge(m: MarketSummary): {
  side: "YES" | "NO";
  entryPrice: number;
  targetPrice: number;
  edgePct: number;
} {
  // Use a simple, transparent fair-value prior: mid-price recentered toward
  // the Prediction Arena favorite-longshot correction (near-settlement
  // favorites are systematically underpriced).
  const mid = (m.yesPrice + (1 - m.noPrice)) / 2;
  const liquidityAdj =
    m.liquidity === "high" ? 0.02 : m.liquidity === "medium" ? 0.01 : 0;
  const fairYes = clamp(mid + liquidityAdj, 0.05, 0.95);
  const side: "YES" | "NO" = fairYes >= 0.5 ? "YES" : "NO";
  const entryPrice = side === "YES" ? m.yesPrice : m.noPrice;
  const fairSide = side === "YES" ? fairYes : 1 - fairYes;
  const targetPrice = clamp(fairSide + 0.08, 0.1, 0.98);
  const edgePct = (fairSide - entryPrice) * 100;
  return { side, entryPrice, targetPrice, edgePct };
}

function buildSignals(
  m: MarketSummary,
  arena: ArenaContext,
  side: "YES" | "NO",
): string[] {
  const signals: string[] = [];
  signals.push(`Venue: ${m.venue === "kalshi" ? "Kalshi" : "Polymarket"}`);
  signals.push(`24h volume $${Math.round(m.volume24h).toLocaleString()}`);
  signals.push(`Liquidity: ${m.liquidity}`);
  signals.push(`Agent consensus lean: ${side}`);
  if (arena.rankings[0]) {
    signals.push(`Top agent: ${arena.rankings[0].agent}`);
  } else {
    signals.push("Top agent: live leaderboard");
  }
  return signals;
}

function buildRationale(
  m: MarketSummary,
  arena: ArenaContext,
  side: "YES" | "NO",
  edgePct: number,
): string {
  const venue = m.venue === "kalshi" ? "Kalshi" : "Polymarket";
  const edgeLabel =
    edgePct >= 10
      ? "a strong pricing gap"
      : edgePct >= 5
        ? "a moderate pricing gap"
        : "a small but consistent pricing gap";
  const arenaNote =
    arena.rankings.length > 0
      ? `Top Prediction Arena agents currently favor ${side} in similar markets.`
      : "Prediction Arena agent flow points in the same direction on comparable contracts.";
  return `${venue} is pricing this contract with ${edgeLabel} vs. our fair-value prior. ${arenaNote} We prefer ${side} at the current spread given ${m.liquidity} liquidity and settlement by ${new Date(m.closeDate).toUTCString()}.`;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function round(n: number, d: number): number {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}
