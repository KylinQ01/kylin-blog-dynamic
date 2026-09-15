import { siteConfig } from "@/lib/site-config";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommentForm } from "@/components/CommentForm";

export const metadata = {
  title: `留言 - ${siteConfig.title}`,
  description: "欢迎在这里留下你的足迹，分享你的想法和建议",
};

export default function GuestbookPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="left" showOnPostPage />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="card-base card-padding mb-6">
          <h1 className="text-3xl font-bold mb-2">留言</h1>
          <p className="text-[var(--muted)]">欢迎在这里留下你的足迹，分享你的想法和建议</p>
        </div>

        {/* Guidelines */}
        <div className="card-base card-padding mb-6">
          <h2 className="font-bold mb-4">留言指南</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-[var(--muted)]">
            <li>请保持友善和尊重，营造良好的交流氛围</li>
            <li>欢迎分享你的想法，也可以提出对网站的建议</li>
            <li>如果你也喜欢 AI、CS 或洛克王国，也欢迎来找我聊天</li>
            <li>当前留言区使用 GitHub Discussions 驱动，登录 GitHub 账号后即可留言</li>
            <li>你的每一条留言都是对我最大的支持</li>
          </ol>
        </div>

        {/* Comment Form */}
        <CommentForm page="guestbook" />
      </div>

      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="right" showOnPostPage />
        </div>
      </div>
    </div>
  );
}
