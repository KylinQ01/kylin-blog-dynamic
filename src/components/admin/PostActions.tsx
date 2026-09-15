"use client";

import { useRouter } from "next/navigation";

interface PostActionsProps {
  id: string;
}

export function PostActions({ id }: PostActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("确定要删除这篇文章吗？")) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("删除失败");
      }
    } catch {
      alert("删除失败");
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <a
        href={`/admin/posts/${id}/edit`}
        className="text-xs px-2 py-1 rounded bg-[var(--accent)] hover:bg-[var(--primary)] hover:text-white transition-colors"
      >
        编辑
      </a>
      <button
        onClick={handleDelete}
        className="text-xs px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
      >
        删除
      </button>
    </div>
  );
}
