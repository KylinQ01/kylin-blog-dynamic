"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface BangumiItem {
  title: string;
  cover: string;
  url: string;
  index_show: string;
  follow: string;
  progress: string;
}

export function AnimeClient() {
  const [bangumiList, setBangumiList] = useState<BangumiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBangumi();
  }, []);

  const fetchBangumi = async () => {
    try {
      setLoading(true);
      setError("");

      // 使用本地 API 代理
      const response = await fetch("/api/anime");
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setBangumiList(result.data);
      } else {
        setError(result.message || "获取数据失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "网络请求失败");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card-base card-padding text-center py-12">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-[var(--muted)]">追番数据加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-base card-padding text-center py-12">
        <p className="text-[var(--muted)]">加载失败</p>
        <p className="text-xs text-[var(--muted-foreground)] mt-2">{error}</p>
        <button onClick={fetchBangumi} className="mt-4 btn-primary text-sm">
          重试
        </button>
      </div>
    );
  }

  if (bangumiList.length === 0) {
    return (
      <div className="card-base card-padding text-center py-12">
        <p className="text-[var(--muted)]">暂无追番数据</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {bangumiList.map((item, index) => (
        <a
          key={index}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <div className="card-base overflow-hidden hover:shadow-lg transition-all">
            <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-pink-200 to-purple-300 dark:from-pink-900 dark:to-purple-800">
              {item.cover ? (
                <Image
                  src={item.cover}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {item.progress && (
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs truncate">{item.progress}</p>
                </div>
              )}
            </div>
            <div className="p-2">
              <h3 className="text-sm font-medium truncate group-hover:text-[var(--primary)] transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-[var(--muted)]">{item.index_show}</p>
                {item.follow && <p className="text-xs text-[var(--muted)]">{item.follow}</p>}
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
