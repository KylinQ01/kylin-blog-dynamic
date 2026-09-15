"use client";

import { useState, useEffect } from "react";

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface CommentListProps {
  page?: string;
  postId?: string;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CommentList({ page, postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [page, postId]);

  const fetchComments = async () => {
    try {
      const params = new URLSearchParams();
      if (postId) params.set("postId", postId);
      else if (page) params.set("page", page);

      const res = await fetch(`/api/comments?${params.toString()}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch {
      // Handle error
    }
    setLoading(false);
  };

  if (loading) {
    return <p className="text-sm text-[var(--muted)]">加载中...</p>;
  }

  if (comments.length === 0) {
    return <p className="text-sm text-[var(--muted)]">暂无评论，来说两句吧</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="p-4 rounded-lg" style={{ backgroundColor: "var(--accent)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">{comment.author}</span>
            <span className="text-xs text-[var(--muted)]">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-sm" style={{ color: "var(--foreground)" }}>{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
