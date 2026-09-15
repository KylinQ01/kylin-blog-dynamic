import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 代理请求 Bilibili API 避免 CORS 问题
    const response = await fetch(
      "https://api.bilibili.com/x/space/bangumi/follow/list?type=1&follow_status=0&pn=1&ps=30&vmid=574711676",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Referer: "https://space.bilibili.com/574711676",
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.code === 0 && data.data?.list) {
      const items = data.data.list.map((item: { title: string; cover: string; season_id?: number; index_show?: string; follows?: number; progress?: string }) => ({
        title: item.title,
        cover: item.cover.startsWith("//") ? "https:" + item.cover : item.cover,
        url: `https://www.bilibili.com/bangumi/play/ss${item.season_id || ""}`,
        index_show: item.index_show || "",
        follow: item.follows ? formatNumber(item.follows) : "",
        progress: item.progress || "",
      }));
      return NextResponse.json({ success: true, data: items });
    }

    return NextResponse.json({ success: false, message: data.message || "获取数据失败" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "请求失败" });
  }
}

function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "万";
  }
  return num.toString();
}
