import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PostActions } from "@/components/admin/PostActions";

export const revalidate = 0;

async function getPosts() {
  return prisma.post.findMany({
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
  });
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="admin-title text-xl font-semibold tracking-tight">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="admin-btn"
        >
          新建文章
        </Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="text-left p-3.5">标题</th>
              <th className="text-left p-3.5 hidden sm:table-cell">分类</th>
              <th className="text-left p-3.5 hidden md:table-cell">日期</th>
              <th className="text-left p-3.5">状态</th>
              <th className="text-right p-3.5">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    {post.pinned && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                    <span className="font-medium">{post.title}</span>
                  </div>
                </td>
                <td className="p-3.5 hidden sm:table-cell">{post.category || "-"}</td>
                <td className="p-3.5 hidden md:table-cell tabular-nums">{formatDate(post.publishedAt)}</td>
                <td className="p-3.5">
                  <span className={`admin-badge ${
                    post.published ? "admin-badge-green" : "admin-badge-amber"
                  }`}>
                    {post.published ? "已发布" : "草稿"}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <PostActions id={post.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="text-center py-12 text-[var(--muted)]">
            暂无文章
          </div>
        )}
      </div>
    </div>
  );
}
