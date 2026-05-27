import { getCategories, addCategory, updateCategory, deleteCategory } from "@/lib/store";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const categories = getCategories();
  return Response.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, description, color } = body;

  if (!name) {
    return Response.json({ error: "name is required" }, { status: 400 });
  }

  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || uuidv4();
  const cat = addCategory({ id, name, description: description || "", color: color || "#6b7280" });
  return Response.json(cat, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const cat = updateCategory(id, updates);
  if (!cat) {
    return Response.json({ error: "category not found" }, { status: 404 });
  }

  return Response.json(cat);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const success = deleteCategory(id);
  if (!success) {
    return Response.json({ error: "category not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
