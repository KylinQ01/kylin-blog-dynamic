"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import Image from "next/image";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "登录失败");
      }
    } catch {
      setError("登录失败，请重试");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[100dvh] relative flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#0a0a0f" }}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20" style={{ background: "hsl(var(--hue), 60%, 50%)" }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-15" style={{ background: "hsl(var(--hue + 60), 50%, 40%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-10" style={{ background: "hsl(var(--hue + 120), 40%, 50%)" }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-6">
        <div className="relative rounded-2xl p-8" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
          {/* Top Glow */}
          <div className="absolute -px -px top-0 left-1/2 -translate-x-1/2 w-3/4 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--hue), 60%, 50%), transparent)" }} />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden relative" style={{ border: "2px solid hsl(var(--hue), 50%, 40%)" }}>
              <Image src={siteConfig.profile.avatar} alt="" width={64} height={64} className="w-full h-full object-cover" unoptimized />
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">{siteConfig.title}</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>管理后台</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 rounded-xl text-sm text-center" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171" }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={(e) => e.target.style.borderColor = "hsl(var(--hue), 60%, 50%)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                placeholder="请输入用户名"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={(e) => e.target.style.borderColor = "hsl(var(--hue), 60%, 50%)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                placeholder="请输入密码"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="admin-login-btn mt-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>安全会话</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
            <span>1小时有效期</span>
          </div>
        </div>
      </div>
    </div>
  );
}
