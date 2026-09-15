import { prisma } from "@/lib/prisma";
import { AdminActions } from "@/components/admin/AdminActions";

export const revalidate = 0;

async function getMoments() {
  return prisma.moment.findMany({ orderBy: { createdAt: "desc" } });
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default async function AdminMomentsPage() {
  const moments = await getMoments();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="admin-title text-2xl font-bold">动态管理</h1>
        <a href="/admin/moments/new" className="btn-primary">+ 新建动态</a>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="text-left p-3">内容</th>
              <th className="text-left p-3 hidden sm:table-cell">心情</th>
              <th className="text-left p-3 hidden md:table-cell">发布日期</th>
              <th className="text-right p-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {moments.map((moment) => (
              <tr key={moment.id}>
                <td className="p-3">{moment.content.slice(0, 50)}...</td>
                <td className="p-3 hidden sm:table-cell">{moment.mood || "-"}</td>
                <td className="p-3 hidden md:table-cell">{formatDate(moment.createdAt)}</td>
                <td className="p-3 text-right">
                  <AdminActions id={moment.id} type="moment" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {moments.length === 0 && (
          <div className="text-center py-12 text-[var(--muted)]">暂无动态</div>
        )}
      </div>
    </div>
  );
}
