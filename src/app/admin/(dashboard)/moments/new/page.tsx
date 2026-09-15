"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewMomentPage() {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/moments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mood, tags }),
      });

      if (res.ok) {
        router.push("/admin/moments");
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
      <h1 className="admin-title text-2xl font-bold mb-6">新建动态</h1>
      <form onSubmit={handleSubmit} className="card-base card-padding space-y-4">
        <div>
          <label className="admin-label">内容 *</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={5} className="admin-input resize-none" />
        </div>
        <div>
          <label className="admin-label">心情</label>
          <input type="text" value={mood} onChange={(e) => setMood(e.target.value)} className="admin-input" />
        </div>
        <div>
          <label className="admin-label">标签（逗号分隔）</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="admin-input" />
        </div>
        <button type="submit" disabled={submitting} className="admin-btn disabled:opacity-50">
          {submitting ? "创建中..." : "创建动态"}
        </button>
      </form>
    </div>
  );
}
