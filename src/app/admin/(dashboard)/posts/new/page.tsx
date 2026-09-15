"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [pinned, setPinned] = useState(false);
  const [published, setPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 生成 slug：如果有英文用英文，否则用时间戳
      const slugBase = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
      const slug = slugBase.length > 0 ? slugBase : `post-${Date.now()}`;

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title,
          description,
          content,
          category,
          tags,
          pinned,
          published,
          publishedAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        router.push("/admin/posts");
        router.refresh();
      } else {
        alert("创建失败");
      }
    } catch {
      alert("创建失败");
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h1 className="admin-title text-2xl font-bold mb-6">新建文章</h1>
      <form onSubmit={handleSubmit} className="card-base card-padding space-y-4">
        <div>
          <label className="admin-label">标题 *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full admin-input"
          />
        </div>
        <div>
          <label className="admin-label">描述</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full admin-input"
          />
        </div>
        <div>
          <label className="admin-label">内容 *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            className="w-full admin-input resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="admin-label">分类</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full admin-input"
            />
          </div>
          <div>
            <label className="admin-label">标签（逗号分隔）</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full admin-input"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
            <span className="text-sm">置顶</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            <span className="text-sm">发布</span>
          </label>
        </div>
        <button type="submit" disabled={submitting} className="admin-btn disabled:opacity-50">
          {submitting ? "创建中..." : "创建文章"}
        </button>
      </form>
    </div>
  );
}
