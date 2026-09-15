"use client";

export function CommentActions({ id }: { id: string }) {
  const handleDelete = async () => {
    if (!confirm("确定要删除这条评论吗？")) return;
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("删除失败");
      }
    } catch {
      alert("删除失败");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-xs px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
    >
      删除
    </button>
  );
}
