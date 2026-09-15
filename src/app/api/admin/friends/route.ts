import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const friends = await prisma.friend.findMany({ orderBy: { weight: "desc" } });
  return NextResponse.json({ friends });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, description, siteurl, imgurl, tags, weight, enabled } = await request.json();
    const friend = await prisma.friend.create({
      data: { title, description: description || "", siteurl, imgurl: imgurl || "", tags: tags || "", weight: weight || 0, enabled: enabled !== false },
    });
    return NextResponse.json({ friend });
  } catch {
    return NextResponse.json({ error: "Failed to create friend" }, { status: 500 });
  }
}
