import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 代理请求 Bangumi API 避免 CORS 问题
    const response = await fetch(
      "https://api.bgm.tv/v0/users/1143164/collections?limit=50&offset=0",
      {
        headers: {
          "User-Agent": "KylinBlog/1.0 (https://kylinqaq.xyz)",
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    if (Array.isArray(data.data)) {
      return NextResponse.json({ success: true, data: data.data });
    } else if (Array.isArray(data)) {
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ success: false, message: "获取数据失败" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "请求失败" });
  }
}
