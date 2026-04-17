export type TrialStatus = {
  trialStartedAt: string;
  trialEndsAt: string;
  daysRemaining: number;
  hoursRemaining: number;
  totalDays: number;
  expired: boolean;
};

export type AppUser = {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: string;
  trial: TrialStatus;
};

export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type MarketVenue = "kalshi" | "polymarket";

export type MarketSummary = {
  id: string;
  venue: MarketVenue;
  title: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  volume24h: number;
  openInterest: number;
  closeDate: string;
  liquidity: "low" | "medium" | "high";
  sourceUrl: string;
};

export type DailyPick = {
  id: string;
  rank: number;
  title: string;
  venue: MarketVenue;
  side: "YES" | "NO";
  entryPrice: number;
  targetPrice: number;
  confidence: number;
  edgePct: number;
  rationale: string;
  closeDate: string;
  sourceUrl: string;
  signals: string[];
};

export type ArenaModelRanking = {
  rank: number;
  agent: string;
  accountValue: number;
  pnl: number;
  returnPct: number;
  sharpe: number;
  winRate: number;
  trades: number;
};

export type ArenaTrade = {
  model: string;
  side: "YES" | "NO";
  ticker: string;
  qty: number;
  price: number;
  timeAgo: string;
};

export type ArenaContext = {
  source: "predictionarena.ai";
  fetchedAt: string;
  overview: {
    summary: string;
    venues: string[];
    startingCapital: number;
    cycleMinutes: number;
  };
  methodology: {
    title: string;
    points: string[];
  };
  rankings: ArenaModelRanking[];
  recentTrades: ArenaTrade[];
  marketDetails: {
    contractRange: string;
    settlement: string;
    pricingRule: string;
  };
  modelDetails: {
    promptStyle: string;
    inputs: string[];
  };
  confidenceSignals: string[];
};
