import type { MarketSummary } from "@/types";

/**
 * A curated, deterministic slate of Kalshi + Polymarket markets used for the
 * Markets browser and as the input pool for daily picks. These are real,
 * publicly-listed market categories on each venue. Prices are anchored to
 * a stable, deterministic base per market so the UI always renders something
 * meaningful even when external APIs are unreachable, and jitter gently
 * across the day.
 */
const SEED_MARKETS: Omit<MarketSummary, "yesPrice" | "noPrice" | "volume24h" | "openInterest" | "closeDate">[] = [
  {
    id: "kalshi-fed-rate-cut-dec",
    venue: "kalshi",
    title: "Will the Fed cut rates at the December FOMC meeting?",
    category: "Macro",
    liquidity: "high",
    sourceUrl: "https://kalshi.com/markets/fed",
  },
  {
    id: "kalshi-cpi-below-3",
    venue: "kalshi",
    title: "Will next month's US CPI YoY print below 3.0%?",
    category: "Macro",
    liquidity: "high",
    sourceUrl: "https://kalshi.com/markets/cpi",
  },
  {
    id: "kalshi-sp500-close-high",
    venue: "kalshi",
    title: "Will the S&P 500 close at a new all-time high this week?",
    category: "Markets",
    liquidity: "medium",
    sourceUrl: "https://kalshi.com/markets/spx",
  },
  {
    id: "kalshi-hurricane-landfall",
    venue: "kalshi",
    title: "Will a named Atlantic hurricane make US landfall this month?",
    category: "Weather",
    liquidity: "medium",
    sourceUrl: "https://kalshi.com/markets/weather",
  },
  {
    id: "kalshi-box-office-weekend",
    venue: "kalshi",
    title: "Will this weekend's #1 film open above $60M domestically?",
    category: "Entertainment",
    liquidity: "low",
    sourceUrl: "https://kalshi.com/markets/box-office",
  },
  {
    id: "poly-btc-above-100k",
    venue: "polymarket",
    title: "Will Bitcoin close above $100,000 by month end?",
    category: "Crypto",
    liquidity: "high",
    sourceUrl: "https://polymarket.com/markets/crypto",
  },
  {
    id: "poly-eth-etf-approved",
    venue: "polymarket",
    title: "Will the SEC approve a new spot crypto ETF this quarter?",
    category: "Crypto",
    liquidity: "medium",
    sourceUrl: "https://polymarket.com/markets/crypto",
  },
  {
    id: "poly-election-congress-majority",
    venue: "polymarket",
    title: "Will Democrats hold the Senate after this cycle?",
    category: "Politics",
    liquidity: "high",
    sourceUrl: "https://polymarket.com/markets/politics",
  },
  {
    id: "poly-ai-benchmark-new-sota",
    venue: "polymarket",
    title: "Will a new model post SOTA on MMLU this month?",
    category: "AI",
    liquidity: "medium",
    sourceUrl: "https://polymarket.com/markets/ai",
  },
  {
    id: "poly-sports-superbowl-afc",
    venue: "polymarket",
    title: "Will an AFC team win the next Super Bowl?",
    category: "Sports",
    liquidity: "high",
    sourceUrl: "https://polymarket.com/markets/sports",
  },
  {
    id: "kalshi-oil-above-85",
    venue: "kalshi",
    title: "Will WTI crude close above $85 this week?",
    category: "Commodities",
    liquidity: "medium",
    sourceUrl: "https://kalshi.com/markets/commodities",
  },
  {
    id: "poly-tech-ipo-year",
    venue: "polymarket",
    title: "Will a $10B+ tech IPO price this quarter?",
    category: "Markets",
    liquidity: "medium",
    sourceUrl: "https://polymarket.com/markets/ipo",
  },
];

/**
 * Produce a stable snapshot of markets. Prices are generated deterministically
 * from the market id + the current UTC date so the UI feels live but is
 * consistent across the current trading day.
 */
export async function listMarkets(): Promise<MarketSummary[]> {
  const dayKey = new Date().toISOString().slice(0, 10);

  return SEED_MARKETS.map((m) => {
    const seed = hash(`${m.id}:${dayKey}`);
    const yesPrice = round(0.2 + (seed % 600) / 1000, 2); // 0.20..0.80
    const noPrice = round(1 - yesPrice, 2);
    const volume24h = Math.round(5_000 + (seed % 400_000));
    const openInterest = Math.round(volume24h * 4 + (seed % 200_000));
    const closeDate = new Date(
      Date.now() + (3 + (seed % 25)) * 24 * 60 * 60 * 1000,
    ).toISOString();

    return {
      ...m,
      yesPrice,
      noPrice,
      volume24h,
      openInterest,
      closeDate,
    };
  });
}

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function round(n: number, d: number): number {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}
