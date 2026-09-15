import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 验证文件类型
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 });
    }

    // 验证文件大小（最大 10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    // 创建上传目录
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // 生成唯一文件名
    const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const filepath = path.join(uploadDir, filename);

    // 保存文件
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    // 返回文件 URL
    const url = `/uploads/${filename}`;
    return NextResponse.json({ url, filename });
  } catch {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
