import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { content: { contains: query } },
        { tags: { contains: query } },
      ],
    },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
    },
    take: 10,
  });

  return NextResponse.json({ results: posts });
}
