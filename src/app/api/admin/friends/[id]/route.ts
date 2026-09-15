import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

interface Context {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const { title, description, siteurl, imgurl, tags, weight, enabled } = await request.json();
    const friend = await prisma.friend.update({
      where: { id },
      data: { title, description: description || "", siteurl, imgurl: imgurl || "", tags: tags || "", weight: weight || 0, enabled: enabled !== false },
    });
    return NextResponse.json({ friend });
  } catch {
    return NextResponse.json({ error: "Failed to update friend" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.friend.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete friend" }, { status: 500 });
  }
}
