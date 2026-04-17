import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { computeTrialStatus } from "@/utils/trial";
import { nvidiaChatCompletion } from "@/utils/nvidia";
import { getPredictionArenaContext } from "@/utils/prediction-arena";
import type { ChatMessage } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are PredictionEdge's research analyst for prediction markets on Kalshi and Polymarket.
You help users reason about binary YES/NO contracts with rigor: identify the question, check base rates,
compare to market price, calculate expected value versus fees and slippage, and flag settlement risk.
You explicitly exploit the favorite-longshot bias (near-settlement favorites are systematically underpriced).
You cite the publicly-known Prediction Arena benchmark (by Arcada Labs) to ground your framing when useful.
You never promise outcomes and never give financial advice; you explain probabilistic reasoning and tradeoffs.
Keep answers concise, structured, and markdown-formatted. Use bullet points and short sections.`;

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to use AI chat." },
      { status: 401 },
    );
  }

  const trialStartedAt =
    (user.user_metadata?.trial_started_at as string | undefined) ||
    user.created_at;
  const trial = computeTrialStatus(trialStartedAt);
  if (trial.expired) {
    return NextResponse.json(
      {
        error: "Your 10-day free trial has ended.",
        trial,
      },
      { status: 402 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const cleaned: ChatMessage[] = incoming
    .filter(
      (m) =>
        m &&
        typeof m.content === "string" &&
        (m.role === "user" || m.role === "assistant" || m.role === "system"),
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, 8_000) }))
    .slice(-12);

  if (cleaned.length === 0) {
    return NextResponse.json(
      { error: "Provide at least one user message." },
      { status: 400 },
    );
  }

  // Pull lightweight Prediction Arena context to ground the model's reasoning.
  const arena = await getPredictionArenaContext();
  const arenaBrief = [
    `Prediction Arena context (source: ${arena.source}, fetched ${arena.fetchedAt}):`,
    `- Venues: ${arena.overview.venues.join(", ")}`,
    `- Starting capital per agent: $${arena.overview.startingCapital.toLocaleString()}`,
    `- Trading cycle: ~${arena.overview.cycleMinutes} minutes`,
    `- Methodology highlights: ${arena.methodology.points.slice(0, 3).join(" | ")}`,
    arena.rankings.length
      ? `- Current top agents: ${arena.rankings
          .slice(0, 3)
          .map((r) => `${r.agent} ($${Math.round(r.accountValue).toLocaleString()})`)
          .join(", ")}`
      : "- Leaderboard not available this cycle.",
  ].join("\n");

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "system", content: arenaBrief },
    ...cleaned.filter((m) => m.role !== "system"),
  ];

  const result = await nvidiaChatCompletion(messages, { temperature: 0.3 });

  return NextResponse.json({
    content: result.content,
    source: result.source,
    model: result.model,
    trial,
    ok: result.ok,
  });
}
