import { getKnowledge, addKnowledge, deleteKnowledge, updateKnowledge } from "@/lib/store";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const items = getKnowledge();
  return Response.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, content, category } = body;

  if (!title || !content || !category) {
    return Response.json({ error: "title, content, and category are required" }, { status: 400 });
  }

  const item = addKnowledge({ id: uuidv4(), title, content, category });
  return Response.json(item, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const item = updateKnowledge(id, updates);
  if (!item) {
    return Response.json({ error: "item not found" }, { status: 404 });
  }

  return Response.json(item);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const success = deleteKnowledge(id);
  if (!success) {
    return Response.json({ error: "item not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
