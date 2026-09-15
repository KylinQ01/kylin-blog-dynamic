"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function NewAlbumPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [cover, setCover] = useState("");
  const [tags, setTags] = useState("");
  const [photoCount, setPhotoCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 预览
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // 上传
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setCover(data.url);
      } else {
        alert(data.error || "上传失败");
      }
    } catch {
      alert("上传失败");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const slugBase = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
      const slug = slugBase.length > 0 ? slugBase : `album-${Date.now()}`;

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name,
          description,
          location,
          date,
          cover,
          tags,
          photoCount,
        }),
      });

      if (res.ok) {
        router.push("/admin/gallery");
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
      <h1 className="admin-title text-2xl font-bold mb-6">新建相册</h1>
      <form onSubmit={handleSubmit} className="card-base card-padding space-y-4">
        <div>
          <label className="admin-label">名称 *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="admin-input" />
        </div>
        <div>
          <label className="admin-label">描述</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="admin-input" />
        </div>
        <div>
          <label className="admin-label">位置</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="admin-input" />
        </div>
        <div>
          <label className="admin-label">日期</label>
          <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="2026-06-01" className="admin-input" />
        </div>

        {/* 图片上传 */}
        <div>
          <label className="admin-label">封面图片</label>
          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="btn-secondary text-sm disabled:opacity-50"
              >
                {uploading ? "上传中..." : "选择图片"}
              </button>
              {cover && <span className="text-xs text-[var(--muted)]">已上传</span>}
            </div>
            {preview && (
              <div className="w-32 h-32 rounded-lg overflow-hidden border" style={{ borderColor: "var(--card-border)" }}>
                <img src={preview} alt="预览" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              type="text"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="或手动输入图片路径"
              className="admin-input text-sm"
            />
          </div>
        </div>

        <div>
          <label className="admin-label">标签</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="admin-input" />
        </div>
        <div>
          <label className="admin-label">照片数量</label>
          <input type="number" value={photoCount} onChange={(e) => setPhotoCount(Number(e.target.value))} className="admin-input" />
        </div>
        <button type="submit" disabled={submitting} className="admin-btn disabled:opacity-50">
          {submitting ? "创建中..." : "创建相册"}
        </button>
      </form>
    </div>
  );
}
