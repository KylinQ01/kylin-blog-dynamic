"use client";

import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setTitle(data.settings.title);
          setSubtitle(data.settings.subtitle);
          setDescription(data.settings.description);
        }
      })
      .catch(() => setMessage({ type: "error", text: "加载设置失败" }))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle, description }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "设置已保存" });
      } else {
        const data = await res.json().catch(() => null);
        setMessage({ type: "error", text: data?.error || "保存失败" });
      }
    } catch {
      setMessage({ type: "error", text: "保存失败" });
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="admin-title text-2xl font-bold mb-6">站点设置</h1>
      <form onSubmit={handleSubmit} className="card-base card-padding space-y-4">
        <div>
          <label className="admin-label">站点名称</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label">副标题</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label">站点描述</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="admin-input resize-none"
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <button type="submit" disabled={saving || loading} className="admin-btn disabled:opacity-50">
          {saving ? "保存中..." : "保存设置"}
        </button>
      </form>
    </div>
  );
}
