import { NextResponse } from "next/server";
import { getLifeCoachInsights } from "@/lib/ai";
import { getKnowledge } from "@/lib/store";
import { readFile } from "fs/promises";
import { join } from "path";

export async function POST() {
  try {
    const knowledge = getKnowledge();

    // Get recent notes (last 50 items worth of content)
    const recentNotes = knowledge
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50)
      .map((k) => `[${k.title}]: ${k.content}`)
      .join("\n\n");

    // Load user context file
    let userContext = "";
    try {
      const contextPath = join(process.cwd(), "data", "user_context.txt");
      userContext = await readFile(contextPath, "utf-8");
    } catch {
      userContext = "16-year-old entrepreneur in LA. Runs email marketing agency (Inbox Growth LA, $497/month). Freelance web designer on Fiverr. Crypto trader. Self-taught via YouTube. Currently bulking/fitness focused. Planning to move to Israel. Dropped out of school to pursue business.";
    }

    if (!recentNotes) {
      return NextResponse.json({
        overallScore: 0,
        summary: "No notes yet. Import your knowledge first, then I can coach you.",
        insights: [],
      });
    }

    const insights = await getLifeCoachInsights(recentNotes, userContext);
    return NextResponse.json(insights);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
