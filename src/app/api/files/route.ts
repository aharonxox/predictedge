import { NextResponse } from "next/server";
import { writeFile, readdir, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const IS_VERCEL = process.env.VERCEL === "1";
const UPLOAD_DIR = IS_VERCEL ? "/tmp/uploads" : path.join(process.cwd(), "public", "uploads");

async function ensureDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(request: Request) {
  try {
    await ensureDir();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = path.extname(file.name) || "";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
    const timestamp = Date.now();
    const filename = `${timestamp}-${baseName}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({
      filename,
      url: `/uploads/${filename}`,
      originalName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await ensureDir();
    const files = await readdir(UPLOAD_DIR);
    const fileList = files
      .filter((f) => !f.startsWith("."))
      .map((f) => ({
        filename: f,
        url: `/uploads/${f}`,
      }));
    return NextResponse.json(fileList);
  } catch {
    return NextResponse.json([]);
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ error: "filename required" }, { status: 400 });
  }

  try {
    const filepath = path.join(UPLOAD_DIR, filename);
    await unlink(filepath);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
