import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const moments = await prisma.moment.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ moments });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { content, mood, tags } = await request.json();
    const moment = await prisma.moment.create({
      data: { content, mood: mood || "", tags: tags || "" },
    });
    return NextResponse.json({ moment });
  } catch {
    return NextResponse.json({ error: "Failed to create moment" }, { status: 500 });
  }
}
