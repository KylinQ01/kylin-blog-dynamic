import { ProfileCard } from "@/components/widgets/ProfileCard";
import { MusicWidget } from "@/components/widgets/MusicWidget";
import { Announcement } from "@/components/widgets/Announcement";
import { CategoryList } from "@/components/widgets/CategoryList";
import { TagCloud } from "@/components/widgets/TagCloud";
import { StatsCard } from "@/components/widgets/StatsCard";
import { DailyQuote } from "@/components/widgets/DailyQuote";
import { TodayRecommend } from "@/components/widgets/TodayRecommend";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { TimeCalendar } from "@/components/widgets/TimeCalendar";
import { prisma } from "@/lib/prisma";

interface SidebarProps {
  position: "left" | "right";
  showOnPostPage?: boolean;
}

export async function Sidebar({ position, showOnPostPage = false }: SidebarProps) {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { category: true, tags: true },
  });

  const postCount = posts.length;

  // 处理分类
  const categoryMap = new Map<string, number>();
  const tagMap = new Map<string, number>();

  posts.forEach((post) => {
    const cat = post.category || "未分类";
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);

    post.tags.split(",").forEach((tag) => {
      const t = tag.trim();
      if (t) tagMap.set(t, (tagMap.get(t) || 0) + 1);
    });
  });

  const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }));
  const sortedTags = Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]);

  const totalWords = 2736;

  if (position === "left") {
    return (
      <aside className="space-y-4">
        <ProfileCard />
        <MusicWidget />
        <Announcement />
        <CategoryList categories={categories} />
        <TagCloud tags={sortedTags} />
        <StatsCard
          postCount={postCount}
          categoryCount={categoryMap.size}
          tagCount={sortedTags.length}
          totalWords={totalWords}
        />
      </aside>
    );
  }

  return (
    <aside className="space-y-4">
      <DailyQuote />
      <TodayRecommend />
      <WeatherWidget />
      <TimeCalendar />
      <StatsCard
        postCount={postCount}
        categoryCount={categoryMap.size}
        tagCount={sortedTags.length}
        totalWords={totalWords}
      />
      <ProfileCard />
      <Announcement />
    </aside>
  );
}
