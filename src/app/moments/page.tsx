import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { Sidebar } from "@/components/layout/Sidebar";

export const revalidate = 60;

export const metadata = {
  title: `碎碎念 - ${siteConfig.title}`,
  description: "记录日常、灵感和游戏时刻的小动态",
};

async function getMoments() {
  return prisma.moment.findMany({
    orderBy: { createdAt: "desc" },
  });
}

function formatDate(date: Date) {
  const d = new Date(date);
  return {
    full: d.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }),
    monthDay: d.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }),
    weekday: d.toLocaleDateString("zh-CN", { weekday: "long" }),
  };
}

export default async function MomentsPage() {
  const moments = await getMoments();

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="left" showOnPostPage />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="card-base card-padding mb-6">
          <h1 className="text-3xl font-bold mb-2">碎碎念</h1>
          <p className="text-[var(--muted)]">这里记录一些日常心情、AI 折腾、游戏时刻和灵感碎片。</p>
        </div>

        <div className="space-y-4">
          {moments.map((moment) => {
            const date = formatDate(moment.createdAt);
            return (
              <article key={moment.id} className="card-base card-padding">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 text-center">
                    <div className="text-lg font-bold" style={{ color: "var(--primary)" }}>
                      {date.monthDay.split("-")[1]}
                    </div>
                    <div className="text-xs text-[var(--muted)]">{date.monthDay.split("-")[0]}月</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-[var(--muted)]">{date.weekday}</span>
                      {moment.mood && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]">{moment.mood}</span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{moment.content}</p>
                    {moment.tags && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {moment.tags.split(",").map((tag) => (
                          <span key={tag.trim()} className="text-xs text-[var(--muted)]">#{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {moments.length === 0 && (
          <div className="card-base card-padding text-center py-12">
            <p className="text-[var(--muted)]">暂无动态</p>
          </div>
        )}
      </div>

      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="right" showOnPostPage />
        </div>
      </div>
    </div>
  );
}
