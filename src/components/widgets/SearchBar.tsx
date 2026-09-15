"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 搜索
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setIsOpen(true);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (slug: string) => {
    router.push(`/posts/${slug}`);
    setQuery("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && results.length > 0) {
      handleSelect(results[0].slug);
    }
  };

  return (
    <div ref={containerRef} className="cir-search">
      <svg className="cir-search__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        className="cir-search__field"
        placeholder="搜索文章..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => query.trim() && setIsOpen(true)}
      />
      <kbd className="cir-search__kbd">CTRL K</kbd>

      {/* 搜索结果下拉 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}>
          {loading ? (
            <div className="p-4 text-sm text-[var(--muted)] text-center">搜索中...</div>
          ) : results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result.slug)}
                  className="w-full text-left p-3 hover:bg-[var(--accent)] transition-colors border-b last:border-b-0"
                  style={{ borderColor: "var(--card-border)" }}
                >
                  <div className="font-medium text-sm">{result.title}</div>
                  {result.description && (
                    <div className="text-xs text-[var(--muted)] mt-1 line-clamp-1">{result.description}</div>
                  )}
                  {result.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)] mt-1 inline-block">{result.category}</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm text-[var(--muted)] text-center">找不到相关结果</div>
          )}
        </div>
      )}
    </div>
  );
}
