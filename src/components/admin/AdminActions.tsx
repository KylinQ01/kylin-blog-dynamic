"use client";

import { useRouter } from "next/navigation";

interface AdminActionsProps {
  id: string;
  type?: "post" | "moment" | "friend" | "album";
}

// 类型到 API 路径的映射
const typeToPath: Record<string, string> = {
  post: "posts",
  moment: "moments",
  friend: "friends",
  album: "gallery",
};

export function AdminActions({ id, type = "post" }: AdminActionsProps) {
  const router = useRouter();
  const path = typeToPath[type] || "posts";

  const handleDelete = async () => {
    if (!confirm("确定要删除吗？")) return;

    try {
      const res = await fetch(`/api/admin/${path}/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "删除失败");
      }
    } catch {
      alert("删除失败");
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <a
        href={`/admin/${path}/${id}/edit`}
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
