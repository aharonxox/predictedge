import { NextResponse } from "next/server";
import { getProjects, addProject, updateProject, deleteProject } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getProjects());
}

export async function POST(request: Request) {
  const body = await request.json();
  const { id, name, description, url, status, type } = body;

  if (!name || !id) {
    return NextResponse.json({ error: "name and id required" }, { status: 400 });
  }

  const project = addProject({
    id,
    name,
    description: description || "",
    url: url || undefined,
    status: status || "active",
    type: type || "other",
  });

  return NextResponse.json(project);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const updated = updateProject(id, updates);
  if (!updated) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const deleted = deleteProject(id);
  return NextResponse.json({ success: deleted });
}
