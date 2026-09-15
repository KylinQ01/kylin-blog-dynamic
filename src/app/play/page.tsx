import { Sidebar } from "@/components/layout/Sidebar";
import { siteConfig } from "@/lib/site-config";
import { GamesClient } from "@/components/GamesClient";

export const metadata = {
  title: `小游戏 - ${siteConfig.title}`,
  description: "休闲小游戏",
};

export default function PlayPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="left" showOnPostPage />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="card-base card-padding mb-6">
          <h1 className="text-3xl font-bold mb-2">🎮 小游戏</h1>
          <p className="text-[var(--muted)]">休闲小游戏，放松一下心情</p>
        </div>

        <GamesClient />
      </div>

      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="right" showOnPostPage />
        </div>
      </div>
    </div>
  );
}
