import Link from "next/link";

interface TagCloudProps {
  tags: [string, number][];
}

export function TagCloud({ tags }: TagCloudProps) {
  const displayTags = tags.slice(0, 16);
  const hasMore = tags.length > 16;

  return (
    <div className="card-base card-padding">
      <h4 className="font-bold text-sm mb-3">标签</h4>
      <div className="flex flex-wrap gap-2">
        {displayTags.map(([tag]) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="tag text-xs"
          >
            {tag}
          </Link>
        ))}
      </div>
      {hasMore && (
        <Link
          href="/tags"
          className="block text-xs text-center mt-3 hover:underline"
          style={{ color: "var(--primary)" }}
        >
          更多
        </Link>
      )}
    </div>
  );
}
