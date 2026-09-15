import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const albums = await prisma.galleryAlbum.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ albums });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { slug, name, description, location, date, cover, tags, photoCount } = await request.json();
    const album = await prisma.galleryAlbum.create({
      data: { slug, name, description: description || "", location: location || "", date: date || "", cover: cover || "", tags: tags || "", photoCount: photoCount || 0 },
    });
    return NextResponse.json({ album });
  } catch {
    return NextResponse.json({ error: "Failed to create album" }, { status: 500 });
  }
}
