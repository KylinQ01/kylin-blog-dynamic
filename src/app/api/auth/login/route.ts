import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken(user.id, user.username);
    // 根据实际协议决定 Cookie 是否加 Secure：HTTPS 加，HTTP 不加，
    // 否则生产模式下本地 http 预览时 Secure Cookie 不会被回传，导致后台无法使用
    const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "http";
    await setAuthCookie(token, proto === "https");

    return NextResponse.json({
      user: { id: user.id, username: user.username, name: user.name, role: user.role },
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
