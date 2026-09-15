import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommentForm } from "@/components/CommentForm";
import Image from "next/image";

export const revalidate = 60;

export const metadata = {
  title: `友链 - ${siteConfig.title}`,
  description: "这里是我的朋友们，欢迎互相访问交流",
};

async function getFriends() {
  return prisma.friend.findMany({
    where: { enabled: true },
    orderBy: { weight: "desc" },
  });
}

export default async function FriendsPage() {
  const friends = await getFriends();

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="left" showOnPostPage />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="card-base card-padding mb-6">
          <h1 className="text-3xl font-bold mb-2">友链</h1>
          <p className="text-[var(--muted)]">这里是我的朋友们，欢迎互相访问交流</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {friends.map((friend) => (
            <a
              key={friend.id}
              href={friend.siteurl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-base card-padding group hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 relative">
                  <Image src={friend.imgurl} alt={friend.title} fill className="object-cover" unoptimized />
                </div>
                <div>
                  <h3 className="font-bold group-hover:text-[var(--primary)] transition-colors">{friend.title}</h3>
                </div>
              </div>
              <p className="text-sm text-[var(--muted)] line-clamp-2">{friend.description}</p>
              {friend.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {friend.tags.split(",").map((tag) => (
                    <span key={tag.trim()} className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]">{tag.trim()}</span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>

        {friends.length === 0 && (
          <div className="card-base card-padding text-center py-12">
            <p className="text-[var(--muted)]">暂无友链</p>
          </div>
        )}

        <div className="card-base card-padding mb-6">
          <h2 className="font-bold text-lg mb-4">申请友链</h2>
          <ol className="list-decimal list-inside space-y-3 text-sm text-[var(--muted)]">
            <li>
              <strong>Add our link first:</strong> Please add our site to your friends page first.
              <div className="mt-2 p-3 rounded-lg bg-[var(--accent)] text-xs font-mono">
                <p>站点名称：Kylin</p>
                <p>站点描述：一只会写代码的Kylin</p>
                <p>站点链接：{siteConfig.siteUrl}</p>
                <p>头像链接：{siteConfig.siteUrl}{siteConfig.profile.avatar}</p>
              </div>
            </li>
            <li>Send application email to: <a href="mailto:2686536946@qq.com" style={{ color: "var(--primary)" }}>2686536946@qq.com</a></li>
            <li>Waiting for review</li>
          </ol>

          <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--card-border)" }}>
            <h3 className="font-medium text-sm mb-2">注意事项</h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-[var(--muted)]">
              <li>互换原则：请先将本站添加到您的友链页面</li>
              <li>链接维护：友链网站长期无法访问或内容违规，将会被移除</li>
              <li>内容要求：内容积极向上，不含违法违规内容</li>
              <li>站点要求：支持 HTTPS，以原创内容为主</li>
            </ul>
          </div>
        </div>

        <CommentForm page="friends" />
      </div>

      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="right" showOnPostPage />
        </div>
      </div>
    </div>
  );
}
