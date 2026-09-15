import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { Sidebar } from "@/components/layout/Sidebar";
import Link from "next/link";

export const revalidate = 60;

export const metadata = {
  title: `分类 - ${siteConfig.title}`,
  description: "文章分类",
};

async function getCategories() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { category: true },
  });

  const categoryMap = new Map<string, number>();
  posts.forEach((post) => {
    const cat = post.category || "未分类";
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  });

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="left" showOnPostPage />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="card-base card-padding mb-6">
          <h1 className="text-3xl font-bold mb-2">分类</h1>
          <p className="text-[var(--muted)]">共 {categories.length} 个分类</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/categories/${encodeURIComponent(cat.name)}`}
              className="card-base card-padding group hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-bold group-hover:text-[var(--primary)] transition-colors">
                  {cat.name}
                </h2>
                <span className="text-sm px-3 py-1 rounded-full bg-[var(--accent)]">
                  {cat.count}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="card-base card-padding text-center py-12">
            <p className="text-[var(--muted)]">暂无分类</p>
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
