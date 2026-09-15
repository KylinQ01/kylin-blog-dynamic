import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSiteSettings, saveSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ settings: getSiteSettings() });
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, subtitle, description } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "站点名称不能为空" }, { status: 400 });
    }

    saveSiteSettings({
      title: String(title),
      subtitle: subtitle ? String(subtitle) : "",
      description: description ? String(description) : "",
    });

    return NextResponse.json({ settings: getSiteSettings() });
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
