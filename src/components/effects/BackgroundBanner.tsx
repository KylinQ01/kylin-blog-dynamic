"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface BackgroundBannerProps {
  variant?: "home" | "page";
}

// 壁纸图片列表
const wallpapers = {
  home: [
    "/_astro/wallpaper_107_2.webp",
    "/_astro/wallpaper_108.webp",
    "/_astro/wallpaper_109.webp",
    "/_astro/wallpaper_110.webp",
  ],
  page: [
    "/_astro/wallpaper_107_2.webp",
    "/_astro/wallpaper_108.webp",
  ],
};

// Fallback 渐变背景
const gradients = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
];

export function BackgroundBanner({ variant = "page" }: BackgroundBannerProps) {
  const [wallpaper, setWallpaper] = useState<string>("");
  const [useImage, setUseImage] = useState(false);

  useEffect(() => {
    const list = wallpapers[variant];
    const saved = localStorage.getItem("banner-wallpaper");
    if (saved && list.includes(saved)) {
      setWallpaper(saved);
      setUseImage(true);
    } else {
      const selected = list[Math.floor(Math.random() * list.length)];
      setWallpaper(selected);
      setUseImage(true);
    }
  }, [variant]);

  useEffect(() => {
    if (wallpaper) {
      localStorage.setItem("banner-wallpaper", wallpaper);
    }
  }, [wallpaper]);

  const height = variant === "home" ? "65vh" : "35vh";

  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-6 flex items-center justify-center"
      style={{ height }}
    >
      {/* 背景图片或渐变 */}
      {useImage ? (
        <>
          <Image
            src={wallpaper}
            alt="Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: gradients[Math.floor(Math.random() * gradients.length)] }}
        />
      )}

      {/* 装饰元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute rounded-full opacity-20"
          style={{
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.3)",
            top: "10%",
            left: "10%",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full opacity-15"
          style={{
            width: "150px",
            height: "150px",
            background: "rgba(255,255,255,0.2)",
            bottom: "20%",
            right: "15%",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* 内容 */}
      <div className="text-center text-white relative z-10">
        <h1
          className="font-bold mb-2 drop-shadow-lg"
          style={{ fontSize: variant === "home" ? "3.8rem" : "2.5rem" }}
        >
          Kylin
        </h1>
        {variant === "home" && (
          <p className="text-lg opacity-90 drop-shadow">怀化佳木所失，峥嵘苍翠犹立</p>
        )}
      </div>

      {/* 波浪装饰 */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H0Z"
            fill="var(--background)"
          />
        </svg>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
}

// 全屏背景 - 像原站点一样覆盖整个页面
export function PageBackground() {
  const [bgImage, setBgImage] = useState("/_astro/background.webp");

  useEffect(() => {
    // 随机选择壁纸
    const wallpapers = [
      "/_astro/wallpaper_107_2.webp",
      "/_astro/wallpaper_108.webp",
      "/_astro/wallpaper_109.webp",
      "/_astro/wallpaper_110.webp",
      "/_astro/background.webp",
    ];
    const saved = localStorage.getItem("fullpage-bg");
    if (saved && wallpapers.includes(saved)) {
      setBgImage(saved);
    } else {
      const selected = wallpapers[Math.floor(Math.random() * wallpapers.length)];
      setBgImage(selected);
      localStorage.setItem("fullpage-bg", selected);
    }
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      {/* 全屏背景图片 */}
      <Image
        src={bgImage}
        alt="Page Background"
        fill
        className="object-cover"
        style={{
          filter: "blur(10px) brightness(0.7)",
          transform: "scale(1.1)", // 防止模糊后边缘透明
        }}
        priority
      />
      {/* 半透明遮罩 - 让内容可读 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "var(--background)",
          opacity: 0.92,
        }}
      />
    </div>
  );
}
