import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(request: NextRequest, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const { slug, title, description, content, category, tags, pinned, published, publishedAt } = body;

    const post = await prisma.post.update({
      where: { id },
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
  } catch {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
