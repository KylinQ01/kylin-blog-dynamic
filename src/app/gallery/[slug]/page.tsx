import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60;

interface GalleryPageProps {
  params: Promise<{ slug: string }>;
}

// Map of album slug to their actual image files
const albumImages: Record<string, string[]> = {
  luoke: [
    "/gallery/luoke/luoke-20.png",
    "/gallery/luoke/luoke-21.png",
    "/gallery/luoke/luoke-22.jpg",
    "/gallery/luoke/luoke-23.jpg",
    "/gallery/luoke/luoke-24.jpg",
    "/gallery/luoke/luoke-25.jpg",
    "/gallery/luoke/luoke-26.jpg",
    "/gallery/luoke/luoke-27.jpg",
    "/gallery/luoke/luoke-28.jpg",
    "/gallery/luoke/luoke-29.jpg",
    "/gallery/luoke/luoke-30.jpg",
    "/gallery/luoke/luoke-31.jpg",
    "/gallery/luoke/luoke-32.jpg",
    "/gallery/luoke/luoke-33.jpg",
    "/gallery/luoke/luoke-34.jpg",
    "/gallery/luoke/luoke-35.jpg",
    "/gallery/luoke/luoke-36.jpg",
    "/gallery/luoke/luoke-37.jpg",
    "/gallery/luoke/luoke-38.jpg",
    "/gallery/luoke/luoke-39.png",
  ],
  gugugaga: [
    "/gallery/gugugaga/gugugaga-107.jpg",
  ],
};

export default async function GalleryAlbumPage({ params }: GalleryPageProps) {
  const { slug } = await params;
  const album = await prisma.galleryAlbum.findUnique({
    where: { slug },
  });

  if (!album) {
    notFound();
  }

  const images = albumImages[slug] || [];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="left" showOnPostPage />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="card-base card-padding mb-6">
          <Link href="/gallery" className="text-sm text-[var(--muted)] hover:text-[var(--primary)] mb-2 inline-block">
            ← 返回相册
          </Link>
          <h1 className="text-3xl font-bold mb-2">{album.name}</h1>
          <p className="text-[var(--muted)]">{album.description}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-[var(--muted-foreground)]">
            <span>{album.date}</span>
            {album.location && <span>· {album.location}</span>}
            <span>· {images.length} 张照片</span>
          </div>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((src, index) => (
            <div
              key={index}
              className="aspect-square rounded-xl overflow-hidden bg-[var(--accent)] group cursor-pointer hover:shadow-lg transition-all"
            >
              <Image
                src={src}
                alt={`${album.name} - ${index + 1}`}
                width={300}
                height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="card-base card-padding text-center py-12">
            <div className="text-4xl mb-4">📷</div>
            <p className="text-[var(--muted)]">暂无照片</p>
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
