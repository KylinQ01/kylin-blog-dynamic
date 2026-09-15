import { Sidebar } from "@/components/layout/Sidebar";
import { siteConfig } from "@/lib/site-config";
import { TypeClient } from "@/components/TypeClient";

export const metadata = {
  title: `打字测试 - ${siteConfig.title}`,
  description: "测试你的打字速度和准确率",
};

export default function TypePage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="left" showOnPostPage />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="card-base card-padding mb-6">
          <h1 className="text-3xl font-bold mb-2">⌨️ 打字测试</h1>
          <p className="text-[var(--muted)]">测试你的打字速度和准确率</p>
        </div>

        <TypeClient />
      </div>

      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="right" showOnPostPage />
        </div>
      </div>
    </div>
  );
}
