"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewFriendPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [siteurl, setSiteurl] = useState("");
  const [imgurl, setImgurl] = useState("");
  const [tags, setTags] = useState("");
  const [weight, setWeight] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, siteurl, imgurl, tags, weight, enabled }),
      });

      if (res.ok) {
        router.push("/admin/friends");
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
      <h1 className="admin-title text-2xl font-bold mb-6">新建友链</h1>
      <form onSubmit={handleSubmit} className="card-base card-padding space-y-4">
        <div>
          <label className="admin-label">名称 *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="admin-input" />
        </div>
        <div>
          <label className="admin-label">描述</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="admin-input" />
        </div>
        <div>
          <label className="admin-label">站点链接 *</label>
          <input type="url" value={siteurl} onChange={(e) => setSiteurl(e.target.value)} required className="admin-input" />
        </div>
        <div>
          <label className="admin-label">头像链接</label>
          <input type="url" value={imgurl} onChange={(e) => setImgurl(e.target.value)} className="admin-input" />
        </div>
        <div>
          <label className="admin-label">标签</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="admin-input" />
        </div>
        <div>
          <label className="admin-label">权重</label>
          <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="admin-input" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          <span className="text-sm">启用</span>
        </div>
        <button type="submit" disabled={submitting} className="admin-btn disabled:opacity-50">
          {submitting ? "创建中..." : "创建友链"}
        </button>
      </form>
    </div>
  );
}
