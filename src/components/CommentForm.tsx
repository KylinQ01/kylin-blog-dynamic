"use client";

import { useState } from "react";
import { CommentList } from "@/components/CommentList";

interface CommentFormProps {
  page?: string;
  postId?: string;
}

export function CommentForm({ page = "guestbook", postId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !author.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, author, email, page, postId }),
      });

      if (res.ok) {
        setSuccess(true);
        setContent("");
        setAuthor("");
        setEmail("");
        setRefreshKey(k => k + 1); // 刷新评论列表
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      // Handle error
    }
    setSubmitting(false);
  };

  return (
    <div className="card-base card-padding">
      <h3 className="font-bold mb-4">评论区</h3>

      {/* 评论列表 */}
      <div className="mb-6">
        <CommentList page={page} postId={postId} key={refreshKey} />
      </div>

      <p className="text-sm text-[var(--muted)] mb-4">分享你的想法，与大家交流讨论</p>

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm">
          评论提交成功！
        </div>
      )}

      {/* 反应按钮 */}
      <div className="mb-4">
        <p className="text-xs text-[var(--muted)] mb-2">快速反应：</p>
        <div className="reaction-bar">
          <button type="button" className="reaction-btn" data-label="点赞" onClick={() => setContent(c => c + "👍")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h2V8H2v12zm20-12c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 0 7.59 5.59C7.22 5.95 7 6.45 7 7v11c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73V8z"/></svg>
          </button>
          <button type="button" className="reaction-btn" data-label="太棒了" onClick={() => setContent(c => c + "👏")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </button>
          <button type="button" className="reaction-btn" data-label="开心" onClick={() => setContent(c => c + "😄")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
          </button>
          <button type="button" className="reaction-btn" data-label="惊讶" onClick={() => setContent(c => c + "😮")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/></svg>
          </button>
          <button type="button" className="reaction-btn" data-label="爱心" onClick={() => setContent(c => c + "❤️")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">昵称 *</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--card-border)", "--tw-ring-color": "var(--primary)" } as React.CSSProperties}
              placeholder="你的昵称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">邮箱（可选）</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--card-border)", "--tw-ring-color": "var(--primary)" } as React.CSSProperties}
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">评论内容 *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm focus:outline-none focus:ring-2 resize-none"
            style={{ borderColor: "var(--card-border)", "--tw-ring-color": "var(--primary)" } as React.CSSProperties}
            placeholder="写下你的想法..."
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary disabled:opacity-50"
          >
            {submitting ? "提交中..." : "提交评论"}
          </button>
          <button
            type="button"
            onClick={() => { setContent(""); setAuthor(""); setEmail(""); }}
            className="btn-secondary"
          >
            取消回复
          </button>
        </div>
      </form>
    </div>
  );
}
