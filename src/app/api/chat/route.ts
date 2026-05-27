import { NextResponse } from "next/server";
import { getKnowledge, addKnowledge, getCategories } from "@/lib/store";
import { chatWithAI } from "@/lib/ai";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history, categories } = body;

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const allCategories = categories || getCategories().map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }));
    const knowledge = getKnowledge();
    const recentContext = knowledge
      .slice(-20)
      .map((k: { title: string; category: string }) => `[${k.category}] ${k.title}`)
      .join("\n");

    const result = await chatWithAI(message, history || [], allCategories, recentContext);

    // If AI wants to save notes, save them
    const organized: { title: string; content: string; category: string }[] = [];
    if (result.saveItems && result.saveItems.length > 0) {
      for (const item of result.saveItems) {
        addKnowledge({
          id: uuidv4(),
          title: item.title,
          content: item.content,
          category: item.category,
        });
        organized.push(item);
      }
    }

    return NextResponse.json({
      response: result.response,
      organized,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
