import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import Link from "next/link";

export const revalidate = 0;

async function getStats() {
  const [postCount, momentCount, friendCount, albumCount, commentCount, totalViews] = await Promise.all([
    prisma.post.count(),
    prisma.moment.count(),
    prisma.friend.count({ where: { enabled: true } }),
    prisma.galleryAlbum.count(),
    prisma.comment.count(),
    prisma.post.aggregate({ _sum: { viewCount: true } }),
  ]);

  return { postCount, momentCount, friendCount, albumCount, commentCount, totalViews: totalViews._sum.viewCount || 0 };
}

async function getRecentData() {
  const [recentPosts, recentComments, draftCount, unpublishedComments] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, published: true, createdAt: true, viewCount: true },
    }),
    prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, author: true, content: true, createdAt: true },
    }),
    prisma.post.count({ where: { published: false } }),
    prisma.comment.count(),
  ]);

  return { recentPosts, recentComments, draftCount, unpublishedComments };
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const { recentPosts, recentComments, draftCount } = await getRecentData();

  const cards = [
    { label: "文章", value: stats.postCount, href: "/admin/posts" },
    { label: "动态", value: stats.momentCount, href: "/admin/moments" },
    { label: "友链", value: stats.friendCount, href: "/admin/friends" },
    { label: "相册", value: stats.albumCount, href: "/admin/gallery" },
    { label: "评论", value: stats.commentCount, href: "/admin/comments" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold admin-title">仪表盘</h1>
          <p className="text-sm text-stone-500 mt-1">欢迎回来，这是您的站点概览</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="admin-btn-ghost"
          >
            查看站点
          </Link>
          <Link
            href="/admin/posts/new"
            className="admin-btn"
          >
            新建文章
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="admin-card p-4 hover:-translate-y-0.5"
          >
            <p className="admin-stat-label mb-1">{card.label}</p>
            <p className="admin-stat-value text-2xl">{card.value}</p>
          </Link>
        ))}
        <div className="admin-card p-4 bg-gradient-to-br from-slate-900 to-slate-800 border-transparent hover:-translate-y-0.5">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">总浏览</p>
          <p className="text-2xl font-semibold text-white tabular-nums">{stats.totalViews}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">前端页面</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "首页", href: "/" },
            { label: "留言板", href: "/guestbook" },
            { label: "相册", href: "/gallery" },
            { label: "追番", href: "/anime" },
            { label: "番组计划", href: "/bangumi" },
            { label: "关于", href: "/about" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              className="admin-btn-ghost px-3 py-1.5"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="col-span-1 admin-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-900">最近文章</h2>
            <Link href="/admin/posts" className="admin-link">全部</Link>
          </div>
          <div className="space-y-2">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <Link key={post.id} href={`/admin/posts/${post.id}/edit`} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0 hover:bg-stone-50 -mx-2 px-2 rounded transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${post.published ? "bg-emerald-500" : "bg-amber-500"}`} />
                    <span className="text-sm text-stone-700 truncate">{post.title}</span>
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">{post.viewCount} 阅</span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-stone-400">暂无文章</p>
            )}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="col-span-1 admin-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-900">最近评论</h2>
            <Link href="/admin/comments" className="admin-link">全部</Link>
          </div>
          <div className="space-y-3">
            {recentComments.length > 0 ? (
              recentComments.map((comment) => (
                <div key={comment.id} className="py-2 border-b border-stone-100 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-stone-700">{comment.author}</span>
                  </div>
                  <p className="text-sm text-stone-500 truncate">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-400">暂无评论</p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-span-1 space-y-4">
          <div className="admin-card p-5">
            <h2 className="font-semibold text-stone-900 mb-3">待处理</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500">草稿</span>
                <span className="font-medium text-amber-600">{draftCount} 篇</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500">评论</span>
                <span className="font-medium text-stone-900">{stats.commentCount} 条</span>
              </div>
            </div>
          </div>

          <div className="admin-card p-5">
            <h2 className="font-semibold text-stone-900 mb-3">站点信息</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">名称</span>
                <span className="font-medium text-stone-900 truncate ml-2">{siteConfig.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">URL</span>
                <span className="font-medium text-stone-900 truncate ml-2">{siteConfig.siteUrl.replace("https://", "")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
