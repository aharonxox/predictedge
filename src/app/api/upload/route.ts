import { getCategories, addManyKnowledge } from "@/lib/store";
import { organizeNotes } from "@/lib/ai";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "file is required" }, { status: 400 });
  }

  const text = await file.text();

  if (!text.trim()) {
    return Response.json({ error: "file is empty" }, { status: 400 });
  }

  const categories = getCategories();

  try {
    const organized = await organizeNotes(text, categories);
    const items = addManyKnowledge(
      organized.map((o) => ({
        id: uuidv4(),
        title: o.title,
        content: o.content,
        category: o.category,
      }))
    );

    return Response.json({ items, count: items.length, filename: file.name });
  } catch (error) {
    console.error("Upload organization error:", error);
    return Response.json(
      { error: "Failed to organize uploaded file. Please try again." },
      { status: 500 }
    );
  }
}
