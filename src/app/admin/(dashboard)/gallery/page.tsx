import { prisma } from "@/lib/prisma";
import { AdminActions } from "@/components/admin/AdminActions";

export const revalidate = 0;

async function getAlbums() {
  return prisma.galleryAlbum.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function AdminGalleryPage() {
  const albums = await getAlbums();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="admin-title text-2xl font-bold">相册管理</h1>
        <a href="/admin/gallery/new" className="btn-primary">+ 新建相册</a>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="text-left p-3">名称</th>
              <th className="text-left p-3 hidden sm:table-cell">描述</th>
              <th className="text-left p-3 hidden md:table-cell">日期</th>
              <th className="text-left p-3">照片数</th>
              <th className="text-right p-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {albums.map((album) => (
              <tr key={album.id}>
                <td className="p-3 font-medium">{album.name}</td>
                <td className="p-3 hidden sm:table-cell">{album.description.slice(0, 30)}...</td>
                <td className="p-3 hidden md:table-cell">{album.date}</td>
                <td className="p-3">{album.photoCount}</td>
                <td className="p-3 text-right">
                  <AdminActions id={album.id} type="album" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {albums.length === 0 && (
          <div className="text-center py-12 text-[var(--muted)]">暂无相册</div>
        )}
      </div>
    </div>
  );
}
