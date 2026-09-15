import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { Sidebar } from "@/components/layout/Sidebar";
import Link from "next/link";

export const revalidate = 60;

export const metadata = {
  title: `归档 - ${siteConfig.title}`,
  description: "文章归档",
};

async function getPosts() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
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

export default async function ArchivePage() {
  const posts = await getPosts();

  // Group by year
  const grouped = posts.reduce((acc, post) => {
    const year = new Date(post.publishedAt).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="left" showOnPostPage />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="card-base card-padding mb-6">
          <h1 className="text-3xl font-bold mb-2">归档</h1>
          <p className="text-[var(--muted)]">共 {posts.length} 篇文章</p>
        </div>

        {years.map((year) => (
          <div key={year} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span style={{ color: "var(--primary)" }}>{year}</span>
              <span className="text-sm font-normal text-[var(--muted)]">
                ({grouped[year].length} 篇)
              </span>
            </h2>
            <div className="space-y-3">
              {grouped[year].map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--accent)] transition-colors"
                >
                  <span className="text-xs text-[var(--muted)] w-20 shrink-0">
                    {formatDate(post.publishedAt)}
                  </span>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="flex-1 font-medium hover:text-[var(--primary)] transition-colors"
                  >
                    {post.pinned && <span className="text-red-500 mr-1">📌</span>}
                    {post.title}
                  </Link>
                  {post.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)] shrink-0">
                      {post.category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="card-base card-padding text-center py-12">
            <p className="text-[var(--muted)]">暂无文章</p>
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
