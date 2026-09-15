"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Subject {
  id: number;
  name: string;
  name_cn: string;
  images?: {
    medium?: string;
    large?: string;
    common?: string;
    grid?: string;
    small?: string;
  };
  summary?: string;
  date?: string;
  score?: number;
  rank?: number;
  type?: number;
}

interface CollectionItem {
  subject: Subject;
  type: number;
  comment?: string;
  rate?: number;
}

const typeLabels: Record<number, string> = {
  1: "想看",
  2: "看过",
  3: "在看",
  4: "搁置",
  5: "抛弃",
};

const typeColors: Record<number, string> = {
  1: "#4facfe",
  2: "#43e97b",
  3: "#fa709a",
  4: "#ff9800",
  5: "#9e9e9e",
};

const categoryTabs = [
  { key: "all", label: "全部" },
  { key: "anime", label: "动画" },
  { key: "book", label: "书籍" },
  { key: "music", label: "音乐" },
  { key: "game", label: "游戏" },
];

export function BangumiClient() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError("");

      // 使用本地 API 代理
      const response = await fetch("/api/bangumi");
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setCollections(result.data);
      } else {
        setError(result.message || "获取数据失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "网络请求失败");
    } finally {
      setLoading(false);
    }
  };

  const filteredCollections = collections.filter((item) => {
    if (activeTab === "all") return true;
    const typeMap: Record<string, number> = {
      anime: 2,
      book: 1,
      music: 3,
      game: 4,
    };
    return item.subject?.type === typeMap[activeTab];
  });

  const getCoverUrl = (images?: Subject["images"]): string => {
    if (!images) return "";
    const url = images.common || images.medium || images.large || images.grid || images.small || "";
    return url.startsWith("//") ? "https:" + url : url;
  };

  if (loading) {
    return (
      <div className="card-base card-padding text-center py-12">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-[var(--muted)]">番组数据加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-base card-padding text-center py-12">
        <p className="text-[var(--muted)]">加载失败</p>
        <p className="text-xs text-[var(--muted-foreground)] mt-2">{error}</p>
        <button onClick={fetchCollections} className="mt-4 btn-primary text-sm">
          重试
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-[var(--primary)] text-white shadow-md"
                : "bg-[var(--accent)] hover:bg-[var(--card-border)] text-[var(--foreground)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredCollections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCollections.map((item, index) => {
            const coverUrl = getCoverUrl(item.subject?.images);
            return (
              <div key={index} className="card-base overflow-hidden hover:shadow-lg transition-all">
                <div className="flex gap-3 p-4">
                  {/* Cover */}
                  <div className="w-20 h-28 shrink-0 rounded-lg overflow-hidden bg-[var(--accent)] relative">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={item.subject?.name_cn || item.subject?.name || ""}
                        fill
                        className="object-cover"
                        unoptimized
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate hover:text-[var(--primary)]">
                      <a
                        href={`https://bgm.tv/subject/${item.subject?.id || ""}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.subject?.name_cn || item.subject?.name || ""}
                      </a>
                    </h3>
                    {item.subject?.name_cn && item.subject?.name && (
                      <p className="text-xs text-[var(--muted)] truncate mt-0.5">
                        {item.subject.name}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: typeColors[item.type] }}
                      >
                        {typeLabels[item.type]}
                      </span>
                      {item.rate && item.rate > 0 && (
                        <span className="text-xs text-yellow-500">
                          {"★".repeat(Math.min(item.rate, 10))}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-[var(--muted)]">
                      {item.subject?.score && <span>评分: {item.subject.score}</span>}
                      {item.subject?.rank && <span>排名: #{item.subject.rank}</span>}
                      {item.subject?.date && <span>{item.subject.date}</span>}
                    </div>

                    {item.comment && (
                      <p className="text-xs text-[var(--muted)] mt-2 line-clamp-2 italic">
                        "{item.comment}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card-base card-padding text-center py-12">
          <p className="text-[var(--muted)]">暂无番组数据</p>
        </div>
      )}
    </>
  );
}
