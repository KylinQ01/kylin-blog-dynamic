import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { Sidebar } from "@/components/layout/Sidebar";
import Link from "next/link";

export const revalidate = 60;

export const metadata = {
  title: `标签 - ${siteConfig.title}`,
  description: "文章标签",
};

async function getTags() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { tags: true },
  });

  const tagMap = new Map<string, number>();
  posts.forEach((post) => {
    post.tags.split(",").forEach((tag) => {
      const t = tag.trim();
      if (t) tagMap.set(t, (tagMap.get(t) || 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

export default async function TagsPage() {
  const tags = await getTags();

  // Calculate font size based on count
  const maxCount = Math.max(...tags.map((t) => t.count), 1);
  const minCount = Math.min(...tags.map((t) => t.count), 1);

  const getFontSize = (count: number) => {
    const ratio = (count - minCount) / (maxCount - minCount || 1);
    return 0.75 + ratio * 1.25; // 0.75rem to 2rem
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky-sidebar space-y-4">
          <Sidebar position="left" showOnPostPage />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="card-base card-padding mb-6">
          <h1 className="text-3xl font-bold mb-2">标签</h1>
          <p className="text-[var(--muted)]">共 {tags.length} 个标签</p>
        </div>

        <div className="card-base card-padding">
          <div className="flex flex-wrap gap-3 justify-center">
            {tags.map((tag) => (
              <Link
                key={tag.name}
                href={`/tags/${encodeURIComponent(tag.name)}`}
                className="px-3 py-1 rounded-full hover:bg-[var(--primary)] hover:text-white transition-all"
                style={{
                  fontSize: `${getFontSize(tag.count)}rem`,
                  backgroundColor: "var(--accent)",
                }}
              >
                {tag.name}
                <span className="ml-1 text-xs opacity-60">({tag.count})</span>
              </Link>
            ))}
          </div>

          {tags.length === 0 && (
            <p className="text-center text-[var(--muted)]">暂无标签</p>
          )}
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
