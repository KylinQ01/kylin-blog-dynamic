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
    const { content, mood, tags } = await request.json();
    const moment = await prisma.moment.update({
      where: { id },
      data: { content, mood: mood || "", tags: tags || "" },
    });
    return NextResponse.json({ moment });
  } catch {
    return NextResponse.json({ error: "Failed to update moment" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.moment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete moment" }, { status: 500 });
  }
}
