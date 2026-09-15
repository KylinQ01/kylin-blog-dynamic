import { prisma } from "@/lib/prisma";
import { CommentActions } from "@/components/admin/CommentActions";
import Link from "next/link";

export const revalidate = 0;

async function getComments() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
  });

  // 获取所有关联的文章
  const postIds = comments.filter(c => c.postId).map(c => c.postId!);
  const posts = await prisma.post.findMany({
    where: { id: { in: postIds } },
    select: { id: true, title: true, slug: true },
  });

  const postMap = new Map(posts.map(p => [p.id, p]));

  return comments.map(comment => ({
    ...comment,
    post: comment.postId ? postMap.get(comment.postId) || null : null,
  }));
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const pageNames: Record<string, string> = {
  guestbook: "留言板",
  friends: "友链",
  sponsor: "打赏",
  about: "关于",
};

export default async function AdminCommentsPage() {
  const comments = await getComments();

  return (
    <div>
      <h1 className="admin-title text-xl font-semibold mb-6">评论管理</h1>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="text-left p-3.5">作者</th>
              <th className="text-left p-3.5">内容</th>
              <th className="text-left p-3.5 hidden sm:table-cell">评论位置</th>
              <th className="text-left p-3.5 hidden md:table-cell">日期</th>
              <th className="text-right p-3.5">操作</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id}>
                <td className="p-3.5 font-medium">{comment.author}</td>
                <td className="p-3.5 max-w-xs truncate">{comment.content}</td>
                <td className="p-3.5 hidden sm:table-cell">
                  {comment.post ? (
                    <Link
                      href={`/posts/${comment.post.slug}`}
                      target="_blank"
                      className="admin-link flex items-center gap-1"
                    >
                      <span className="truncate max-w-[120px]">{comment.post.title}</span>
                      <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  ) : (
                    <span className="text-sm">
                      {pageNames[comment.page] || comment.page}
                    </span>
                  )}
                </td>
                <td className="p-3.5 hidden md:table-cell tabular-nums">{formatDate(comment.createdAt)}</td>
                <td className="p-3.5 text-right">
                  <CommentActions id={comment.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {comments.length === 0 && (
          <div className="text-center py-12 text-[var(--muted)]">暂无评论</div>
        )}
      </div>
    </div>
  );
}
