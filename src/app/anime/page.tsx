import { Sidebar } from "@/components/layout/Sidebar";
import { AnimeClient } from "@/components/AnimeClient";

export const metadata = {
  title: "追番 - Kylin",
  description: "我的追番列表，数据来自 Bilibili 和 TMDB",
};

export default function AnimePage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="left" showOnPostPage />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="card-base card-padding mb-6">
          <h1 className="text-3xl font-bold mb-2">📺 追番</h1>
          <p className="text-[var(--muted)]">我的追番列表，数据来自 Bilibili</p>
        </div>

        <AnimeClient />
      </div>

      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="right" showOnPostPage />
        </div>
      </div>
    </div>
  );
}
