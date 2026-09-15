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
    const { slug, name, description, location, date, cover, tags, photoCount } = await request.json();
    const album = await prisma.galleryAlbum.update({
      where: { id },
      data: { slug, name, description: description || "", location: location || "", date: date || "", cover: cover || "", tags: tags || "", photoCount: photoCount || 0 },
    });
    return NextResponse.json({ album });
  } catch {
    return NextResponse.json({ error: "Failed to update album" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.galleryAlbum.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete album" }, { status: 500 });
  }
}
