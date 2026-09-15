interface StatsCardProps {
  postCount: number;
  categoryCount: number;
  tagCount: number;
  totalWords: number;
}

export function StatsCard({ postCount, categoryCount, tagCount, totalWords }: StatsCardProps) {
  const stats = [
    { label: "文章", value: postCount },
    { label: "分类", value: categoryCount },
    { label: "标签", value: tagCount },
    { label: "总字数", value: totalWords.toLocaleString() },
    { label: "运行时长", value: "0 天" },
    { label: "最后活动", value: "0 天前" },
  ];

  return (
    <div className="card-base card-padding">
      <h4 className="font-bold text-sm mb-3">站点统计</h4>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-lg font-bold" style={{ color: "var(--primary)" }}>
              {stat.value}
            </div>
            <div className="text-xs text-[var(--muted)]">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
