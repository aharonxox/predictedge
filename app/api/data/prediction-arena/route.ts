import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { computeTrialStatus } from "@/utils/trial";
import { getPredictionArenaContext } from "@/utils/prediction-arena";
import { getDailyPicks } from "@/utils/picks";
import { listMarkets } from "@/utils/markets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Unified Prediction Arena intelligence endpoint.
 *
 * Returns:
 *   - arena context (overview, methodology, rankings, recent trades, confidence signals)
 *   - today's top 5 daily picks (fused from live market snapshot + arena context)
 *   - a normalized market list (Kalshi + Polymarket)
 *
 * Authenticated, trial-gated.
 */
export async function GET(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in." },
      { status: 401 },
    );
  }

  const trialStartedAt =
    (user.user_metadata?.trial_started_at as string | undefined) ||
    user.created_at;
  const trial = computeTrialStatus(trialStartedAt);
  if (trial.expired) {
    return NextResponse.json(
      { error: "Your 10-day free trial has ended.", trial },
      { status: 402 },
    );
  }

  const url = new URL(request.url);
  const section = url.searchParams.get("section"); // optional filter

  const [arena, picksBundle, markets] = await Promise.all([
    getPredictionArenaContext(),
    getDailyPicks(),
    listMarkets(),
  ]);

  if (section === "arena") {
    return NextResponse.json({ arena, trial });
  }
  if (section === "picks") {
    return NextResponse.json({ picks: picksBundle.picks, generatedAt: picksBundle.generatedAt, trial });
  }
  if (section === "markets") {
    return NextResponse.json({ markets, trial });
  }

  return NextResponse.json({
    arena,
    picks: picksBundle.picks,
    picksGeneratedAt: picksBundle.generatedAt,
    markets,
    trial,
  });
}
