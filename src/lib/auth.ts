import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "kylin-blog-secret-key-2026";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string, username: string): string {
  return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string): {
  userId: string;
  username: string;
} | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, username: true, name: true, role: true },
  });

  return user;
}

export async function setAuthCookie(token: string, secure = false) {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: 60 * 60, // 1 小时
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}
