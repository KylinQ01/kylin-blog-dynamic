import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");
  const postId = searchParams.get("postId");

  const where = postId
    ? { postId }
    : { page: page || "guestbook" };

  const comments = await prisma.comment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, author, email, url, page, postId } = body;

    if (!content?.trim() || !author?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        author: author.trim(),
        email: email?.trim() || "",
        url: url?.trim() || "",
        page: page || "guestbook",
        postId: postId || null,
      },
    });

    return NextResponse.json({ comment });
  } catch {
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
