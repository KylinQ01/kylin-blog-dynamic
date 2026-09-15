import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.post.findMany({
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
  });

  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { slug, title, description, content, category, tags, pinned, published, publishedAt } = body;

    const post = await prisma.post.create({
      data: {
        slug,
        title,
        description: description || null,
        content: content || "",
        category: category || null,
        tags: tags || "",
        pinned: pinned || false,
        published: published !== false,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
