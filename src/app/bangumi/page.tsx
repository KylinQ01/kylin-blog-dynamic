import { Sidebar } from "@/components/layout/Sidebar";
import { BangumiClient } from "@/components/BangumiClient";

export const metadata = {
  title: "番组计划 - Kylin",
  description: "记录我的二次元之旅",
};

export default function BangumiPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="left" showOnPostPage />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="card-base card-padding mb-6">
          <h1 className="text-3xl font-bold mb-2">🎬 番组计划</h1>
          <p className="text-[var(--muted)]">记录我的二次元之旅，数据来自 Bangumi 番组计划</p>
        </div>

        <BangumiClient />
      </div>

      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="right" showOnPostPage />
        </div>
      </div>
    </div>
  );
}
