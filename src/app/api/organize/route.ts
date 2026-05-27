import { getCategories, addManyKnowledge } from "@/lib/store";
import { organizeNotes, organizeSingleNote } from "@/lib/ai";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const body = await request.json();
  const { text, mode } = body;

  if (!text) {
    return Response.json({ error: "text is required" }, { status: 400 });
  }

  const categories = getCategories();

  try {
    if (mode === "single") {
      const organized = await organizeSingleNote(text, categories);
      const item = addManyKnowledge([
        { id: uuidv4(), title: organized.title, content: organized.content, category: organized.category },
      ]);
      return Response.json({ items: item, count: 1 });
    }

    // Bulk organize
    const organized = await organizeNotes(text, categories);
    const items = addManyKnowledge(
      organized.map((o) => ({
        id: uuidv4(),
        title: o.title,
        content: o.content,
        category: o.category,
      }))
    );

    return Response.json({ items, count: items.length });
  } catch (error) {
    console.error("Organization error:", error);
    return Response.json(
      { error: "Failed to organize notes. Please check your API key and try again." },
      { status: 500 }
    );
  }
}
