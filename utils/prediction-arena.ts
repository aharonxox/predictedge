import type {
  ArenaContext,
  ArenaModelRanking,
  ArenaTrade,
} from "@/types";

const ARENA_BASE = "https://www.predictionarena.ai";

type CacheEntry = { expiresAt: number; value: ArenaContext };
let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches and normalizes publicly available context from predictionarena.ai.
 *
 * Prediction Arena is a public benchmark by Arcada Labs that evaluates AI
 * models trading live Kalshi / Polymarket prediction markets. We pull from
 * the public landing page and the public methodology page, then normalize
 * into a compact, strongly-typed payload that the picks / markets / AI chat
 * features can use as extra research context.
 *
 * Network failures are tolerated: we always return a structured payload,
 * falling back to a curated baseline that reflects the public description of
 * the project so the app keeps working offline.
 */
export async function getPredictionArenaContext(
  opts: { force?: boolean } = {},
): Promise<ArenaContext> {
  const now = Date.now();
  if (!opts.force && cache && cache.expiresAt > now) {
    return cache.value;
  }

  const [landing, methodology] = await Promise.all([
    fetchText(`${ARENA_BASE}/`),
    fetchText(`${ARENA_BASE}/methodology`),
  ]);

  const value = normalize({ landingHtml: landing, methodologyHtml: methodology });
  cache = { value, expiresAt: now + CACHE_TTL_MS };
  return value;
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const to = setTimeout(() => controller.abort(), 15_000);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "PredictionEdge/1.0 (+research)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(to);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(input: {
  landingHtml: string | null;
  methodologyHtml: string | null;
}): ArenaContext {
  const landingText = input.landingHtml ? stripTags(input.landingHtml) : "";
  const methodologyText = input.methodologyHtml
    ? stripTags(input.methodologyHtml)
    : "";

  const venues = detectVenues(landingText + " " + methodologyText);

  const rankings = extractRankings(input.landingHtml);
  const recentTrades = extractRecentTrades(input.landingHtml);
  const methodologyPoints = extractMethodologyPoints(methodologyText);

  return {
    source: "predictionarena.ai",
    fetchedAt: new Date().toISOString(),
    overview: {
      summary:
        "Prediction Arena (by Arcada Labs) is a public benchmark that pits AI agents against one another trading real money on live Kalshi and Polymarket prediction markets. Each agent starts with $10,000 and runs a research-and-trade cycle roughly every 15 minutes.",
      venues: venues.length ? venues : ["Kalshi", "Polymarket"],
      startingCapital: 10_000,
      cycleMinutes: 15,
    },
    methodology: {
      title: "Real-Market Benchmarking",
      points:
        methodologyPoints.length > 0
          ? methodologyPoints
          : defaultMethodologyPoints(),
    },
    rankings,
    recentTrades,
    marketDetails: {
      contractRange: "Binary YES/NO contracts priced between $0.01 and $0.99.",
      settlement: "On settlement, winning contracts pay $1.00; losers pay $0.00.",
      pricingRule: "Price(YES) + Price(NO) = $1.00 at all times.",
    },
    modelDetails: {
      promptStyle:
        "All agents share one system prompt emphasizing value identification, favorite-longshot bias, and risk-managed sizing. Each cycle a dynamic user prompt provides market data, portfolio state, recent settlements, and lessons from prior trades.",
      inputs: [
        "Current date & time",
        "Full market book with bid / ask spreads",
        "Cash balance and active positions",
        "Last 10 settled markets with realized PnL",
        "Last 10 closed trades with realized PnL",
        "Critical learning notes (losing and winning patterns)",
        "Previous cycle reasoning",
      ],
    },
    confidenceSignals: [
      "Agent consensus on YES vs. NO across the leaderboard",
      "Spread between top-ranked agent's fair value and market mid",
      "Recent trade flow (direction of the last 50 trades on the ticker)",
      "Time-to-settlement and liquidity of the underlying market",
      "Historical Sharpe and win-rate of the agent expressing the view",
    ],
  };
}

function detectVenues(text: string): string[] {
  const venues: string[] = [];
  if (/kalshi/i.test(text)) venues.push("Kalshi");
  if (/polymarket/i.test(text)) venues.push("Polymarket");
  return venues;
}

function extractMethodologyPoints(text: string): string[] {
  if (!text) return [];
  const points: string[] = [];

  const map: Array<{ key: RegExp; note: string }> = [
    {
      key: /real[- ]?money|real kalshi/i,
      note: "Trades execute on real Kalshi markets with real money.",
    },
    {
      key: /\$?10,?000/,
      note: "Each model starts with $10,000 in simulated capital.",
    },
    {
      key: /15 ?minutes|~15/i,
      note: "Agents run a research-and-trade cycle roughly every 15 minutes.",
    },
    {
      key: /account value|mark[- ]to[- ]market/i,
      note: "Leaderboard ranks by Account Value (cash + mark-to-market positions).",
    },
    {
      key: /sharpe/i,
      note: "Sharpe ratio and max drawdown are tracked alongside PnL and win rate.",
    },
    {
      key: /favorite[- ]longshot/i,
      note: "System prompt explicitly teaches favorite-longshot bias exploitation.",
    },
    {
      key: /settle|settlement/i,
      note: "Winning contracts settle at $1.00; losers at $0.00.",
    },
  ];

  for (const { key, note } of map) {
    if (key.test(text) && !points.includes(note)) points.push(note);
  }

  return points;
}

function defaultMethodologyPoints(): string[] {
  return [
    "Trades execute on real Kalshi markets with real money.",
    "Each model starts with $10,000 in simulated capital.",
    "Agents run a research-and-trade cycle roughly every 15 minutes.",
    "Leaderboard ranks by Account Value (cash + mark-to-market positions).",
    "Sharpe ratio and max drawdown are tracked alongside PnL and win rate.",
    "System prompt explicitly teaches favorite-longshot bias exploitation.",
  ];
}

/**
 * Extract leaderboard rankings from the landing page. Prediction Arena's
 * public landing embeds a leaderboard table; if the HTML structure changes
 * or the fetch fails, we return an empty list and the app degrades gracefully.
 */
function extractRankings(html: string | null): ArenaModelRanking[] {
  if (!html) return [];
  const rankings: ArenaModelRanking[] = [];

  // Try to pick out table rows that look like <tr>...<td>rank</td><td>agent</td>...
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;

  let row: RegExpExecArray | null;
  while ((row = rowRegex.exec(html)) !== null && rankings.length < 10) {
    const cells: string[] = [];
    let cell: RegExpExecArray | null;
    cellRegex.lastIndex = 0;
    while ((cell = cellRegex.exec(row[1])) !== null) {
      cells.push(stripTags(cell[1]));
    }
    if (cells.length < 4) continue;

    const rank = parseInt(cells[0], 10);
    if (!Number.isFinite(rank)) continue;

    const agent = cells[1];
    if (!agent || /agent/i.test(agent)) continue;

    const numeric = cells.slice(2).map(parseMoney);

    rankings.push({
      rank,
      agent,
      accountValue: numeric[1] ?? 0,
      pnl: numeric[2] ?? 0,
      returnPct: numeric[3] ?? 0,
      sharpe: numeric[4] ?? 0,
      winRate: numeric[5] ?? 0,
      trades: Math.round(numeric[numeric.length - 1] ?? 0),
    });
  }

  return rankings;
}

function extractRecentTrades(html: string | null): ArenaTrade[] {
  if (!html) return [];
  const trades: ArenaTrade[] = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;

  let row: RegExpExecArray | null;
  while ((row = rowRegex.exec(html)) !== null && trades.length < 20) {
    const cells: string[] = [];
    let cell: RegExpExecArray | null;
    cellRegex.lastIndex = 0;
    while ((cell = cellRegex.exec(row[1])) !== null) {
      cells.push(stripTags(cell[1]));
    }
    if (cells.length < 5) continue;

    const side = cells[1]?.toUpperCase();
    if (side !== "YES" && side !== "NO") continue;

    const qtyPrice = cells[3] || "";
    const match = qtyPrice.match(/(\d+)[^\d]+(\d+(?:\.\d+)?)/);
    if (!match) continue;

    trades.push({
      model: cells[0],
      side: side as "YES" | "NO",
      ticker: cells[2],
      qty: parseInt(match[1], 10),
      price: parseFloat(match[2]),
      timeAgo: cells[4],
    });
  }

  return trades;
}

function parseMoney(value: string | undefined): number {
  if (!value) return 0;
  const cleaned = value.replace(/[$,%\s]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}
