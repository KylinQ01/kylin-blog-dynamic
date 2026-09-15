import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getPostsByCategory(slug: string) {
  const category = decodeURIComponent(slug);
  return prisma.post.findMany({
    where: {
      published: true,
      category,
    },
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
      tags: true,
      pinned: true,
      publishedAt: true,
    },
  });
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const posts = await getPostsByCategory(slug);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="left" showOnPostPage />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="card-base card-padding mb-6">
          <h1 className="text-3xl font-bold mb-2">分类：{decodeURIComponent(slug)}</h1>
          <p className="text-[var(--muted)]">共 {posts.length} 篇文章</p>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="card-base card-padding group article-card cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {post.pinned && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        置顶
                      </span>
                    )}
                    <span className="text-xs text-[var(--muted)]">{formatDate(post.publishedAt)}</span>
                    {post.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold mb-2 group-hover:text-[var(--primary)] transition-colors">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h2>
                  {post.description && (
                    <p className="text-sm text-[var(--muted)] line-clamp-2 mb-3">{post.description}</p>
                  )}
                  {post.tags && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.split(",").slice(0, 4).map((tag) => (
                        <Link
                          key={tag.trim()}
                          href={`/tags/${encodeURIComponent(tag.trim())}`}
                          className="text-xs text-[var(--muted)] hover:text-[var(--primary)]"
                        >
                          #{tag.trim()}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="right" showOnPostPage />
        </div>
      </div>
    </div>
  );
}
