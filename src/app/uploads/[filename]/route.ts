import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// Next.js 生产模式（next start）只服务构建时已存在于 public/ 的文件，
// 运行时通过 /api/admin/upload 新写入的文件不会被静态服务，这里兜底处理。

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

export const dynamic = "force-dynamic";

interface Context {
  params: Promise<{ filename: string }>;
}

export async function GET(request: NextRequest, { params }: Context) {
  const { filename } = await params;

  // 防路径穿越：仅允许文件名安全字符
  if (!/^[\w.-]+$/.test(filename) || filename.includes("..")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const filepath = path.join(process.cwd(), "public", "uploads", filename);

  try {
    const data = await readFile(filepath);
    const ext = path.extname(filename).toLowerCase();
    return new NextResponse(data, {
      headers: {
        "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
