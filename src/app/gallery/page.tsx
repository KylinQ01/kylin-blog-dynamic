import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { Sidebar } from "@/components/layout/Sidebar";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60;

export const metadata = {
  title: `相册 - ${siteConfig.title}`,
  description: "记录生活中的美好瞬间",
};

async function getAlbums() {
  return prisma.galleryAlbum.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function GalleryPage() {
  const albums = await getAlbums();

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="left" showOnPostPage />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="card-base card-padding mb-6">
          <h1 className="text-3xl font-bold mb-2">相册</h1>
          <p className="text-[var(--muted)]">记录生活中的美好瞬间</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => (
            <Link key={album.id} href={`/gallery/${album.slug}`} className="card-base overflow-hidden group hover:shadow-lg transition-all">
              <div className="aspect-video relative overflow-hidden">
                <Image src={album.cover || "/assets/images/placeholder.svg"} alt={album.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold">{album.name}</h3>
                  {album.photoCount > 0 && <p className="text-xs opacity-80">{album.photoCount} 张照片</p>}
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-[var(--muted)] line-clamp-2">{album.description}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-[var(--muted-foreground)]">
                  <span>{album.date}</span>
                  {album.location && <span>&middot; {album.location}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {albums.length === 0 && (
          <div className="card-base card-padding text-center py-12">
            <p className="text-[var(--muted)]">暂无相册</p>
          </div>
        )}
      </div>

      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="right" showOnPostPage />
        </div>
      </div>
    </div>
  );
}
