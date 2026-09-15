import Link from "next/link";

interface Category {
  name: string;
  count: number;
}

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="card-base card-padding">
      <h4 className="font-bold text-sm mb-3">分类</h4>
      <div className="space-y-1">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/categories/${encodeURIComponent(cat.name)}`}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-[var(--accent)] transition-colors"
          >
            <span>{cat.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--muted)]">
              {cat.count}
            </span>
          </Link>
        ))}
      </div>
      <Link
        href="/categories"
        className="block text-xs text-center mt-3 hover:underline"
        style={{ color: "var(--primary)" }}
      >
        更多
      </Link>
    </div>
  );
}
