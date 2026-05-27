import { NextResponse } from "next/server";
import { getLifeCoachInsights, CoachMode } from "@/lib/ai";
import { getKnowledge } from "@/lib/store";
import { readFile } from "fs/promises";
import { join } from "path";

const VALID_MODES: CoachMode[] = ["overview", "business", "health", "communication", "relationships"];

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const mode: CoachMode = VALID_MODES.includes(body.mode) ? body.mode : "overview";

    const knowledge = getKnowledge();

    const recentNotes = knowledge
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50)
      .map((k) => `[${k.title}]: ${k.content}`)
      .join("\n\n");

    let userContext = "";
    try {
      const contextPath = join(process.cwd(), "data", "user_context.txt");
      userContext = await readFile(contextPath, "utf-8");
    } catch {
      userContext = "16-year-old entrepreneur in LA. Runs email marketing agency (Inbox Growth LA, $497/month). Freelance web designer on Fiverr ($150/client). Crypto trader. Self-taught via YouTube. Currently bulking/fitness focused. Planning to move to Israel. Dropped out of school to pursue business. No car, limited budget, AI-first solutions. Has pinkslip work permit. Jewish. Wants financial freedom.";
    }

    if (!recentNotes) {
      return NextResponse.json({
        overallScore: 0,
        summary: "No notes yet. Import your knowledge first, then I can coach you.",
        insights: [],
        mode,
      });
    }

    const insights = await getLifeCoachInsights(recentNotes, userContext, mode);
    return NextResponse.json(insights);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
