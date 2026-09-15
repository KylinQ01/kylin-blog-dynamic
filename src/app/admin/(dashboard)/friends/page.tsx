import { prisma } from "@/lib/prisma";
import { AdminActions } from "@/components/admin/AdminActions";

export const revalidate = 0;

async function getFriends() {
  return prisma.friend.findMany({ orderBy: { weight: "desc" } });
}

export default async function AdminFriendsPage() {
  const friends = await getFriends();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="admin-title text-2xl font-bold">友链管理</h1>
        <a href="/admin/friends/new" className="btn-primary">+ 新建友链</a>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="text-left p-3">名称</th>
              <th className="text-left p-3 hidden sm:table-cell">描述</th>
              <th className="text-left p-3 hidden md:table-cell">链接</th>
              <th className="text-left p-3">状态</th>
              <th className="text-right p-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {friends.map((friend) => (
              <tr key={friend.id}>
                <td className="p-3 font-medium">{friend.title}</td>
                <td className="p-3 hidden sm:table-cell">{friend.description.slice(0, 30)}...</td>
                <td className="p-3 hidden md:table-cell">{friend.siteurl}</td>
                <td className="p-3">
                  <span className={`admin-badge ${friend.enabled ? "admin-badge-green" : "admin-badge-amber"}`}>
                    {friend.enabled ? "启用" : "禁用"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <AdminActions id={friend.id} type="friend" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {friends.length === 0 && (
          <div className="text-center py-12 text-[var(--muted)]">暂无友链</div>
        )}
      </div>
    </div>
  );
}
