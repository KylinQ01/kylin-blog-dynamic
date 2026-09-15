"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [pinned, setPinned] = useState(false);
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/posts/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.post) {
          setTitle(data.post.title);
          setDescription(data.post.description || "");
          setContent(data.post.content);
          setCategory(data.post.category || "");
          setTags(data.post.tags);
          setPinned(data.post.pinned);
          setPublished(data.post.published);
        }
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/posts/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
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
        alert("保存失败");
      }
    } catch {
      alert("保存失败");
    }
    setSubmitting(false);
  };

  if (loading) return <div className="card-base card-padding">加载中...</div>;

  return (
    <div>
      <h1 className="admin-title text-2xl font-bold mb-6">编辑文章</h1>
      <form onSubmit={handleSubmit} className="card-base card-padding space-y-4">
        <div>
          <label className="admin-label">标题 *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full admin-input" />
        </div>
        <div>
          <label className="admin-label">描述</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full admin-input" />
        </div>
        <div>
          <label className="admin-label">内容 *</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={10} className="w-full admin-input resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="admin-label">分类</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full admin-input" />
          </div>
          <div>
            <label className="admin-label">标签（逗号分隔）</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full admin-input" />
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
          {submitting ? "保存中..." : "保存修改"}
        </button>
      </form>
    </div>
  );
}
