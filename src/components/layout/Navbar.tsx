"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { useTheme } from "@/components/providers/ThemeProvider";
import { SearchBar } from "@/components/widgets/SearchBar";
import { SakuraToggle } from "@/components/effects/SakuraParticles";

interface NavItem {
  name: string;
  url: string;
  icon?: string;
  children?: NavItem[];
  external?: boolean;
}

const navLinks: NavItem[] = [
  { name: "主页", url: "/" },
  {
    name: "文章",
    url: "/archive",
    children: [
      { name: "归档", url: "/archive" },
      { name: "分类", url: "/categories" },
      { name: "标签", url: "/tags" },
    ],
  },
  { name: "动态", url: "/moments" },
  { name: "友链", url: "/friends" },
  { name: "留言", url: "/guestbook" },
  {
    name: "我的",
    url: "/gallery",
    children: [
      { name: "相册", url: "/gallery" },
      { name: "追番", url: "/anime" },
      { name: "小游戏", url: "/play" },
      { name: "打字测试", url: "/type" },
      { name: "番组计划", url: "/bangumi" },
    ],
  },
  { name: "关于", url: "/about" },
  { name: "GitHub", url: "https://github.com/KylinQ01", external: true },
];

export function Navbar() {
  const pathname = usePathname();
  const { mode, setMode, hue, setHue } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const isActive = (url: string) => {
    if (url === "/") return pathname === "/";
    return pathname.startsWith(url);
  };

  // 更新滑块位置
  useEffect(() => {
    const slider = document.getElementById("glass-nav-slider");
    const nav = navRef.current;
    if (!slider || !nav) return;

    const links = nav.querySelectorAll(".glass-nav__link");
    let activeIndex = 0;

    links.forEach((link, index) => {
      if ((link as HTMLElement).classList.contains("glass-nav__link--active")) {
        activeIndex = index;
      }
    });

    const activeLink = links[activeIndex] as HTMLElement;
    if (activeLink) {
      const navRect = nav.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      const offsetLeft = linkRect.left - navRect.left - 4; // 4px padding
      const width = linkRect.width;

      slider.style.width = `${width}px`;
      slider.style.transform = `translateX(${offsetLeft}px)`;
    }
  }, [pathname]);

  // 点击外部关闭设置面板
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b" style={{ backgroundColor: "var(--navbar-bg)", borderColor: "var(--card-border)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div className="max-w-[100rem] mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: "var(--foreground)" }}>
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: "var(--primary)" }}>
                <Image
                  src={siteConfig.navBar.logo || siteConfig.profile.avatar}
                  alt="Kylin"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="navbar-logo-text">{siteConfig.navBar.title}</span>
            </Link>

            {/* Desktop Nav - Glass Style */}
            <div className="hidden md:flex">
              <nav className="glass-nav" ref={navRef}>
                {navLinks.map((link) => (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => link.children && setActiveDropdown(link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={link.url}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className={`glass-nav__link ${isActive(link.url) && link.url !== "#" ? "glass-nav__link--active" : ""}`}
                    >
                      {link.name}
                      {link.children && <span className="ml-1 text-xs" style={{ opacity: 0.6 }}>▾</span>}
                    </Link>

                    {/* Dropdown */}
                    {link.children && activeDropdown === link.name && (
                      <div
                        className="absolute top-full left-0 pt-2 min-w-[150px]"
                        style={{ zIndex: 100 }}
                      >
                        <div
                          className="py-2 rounded-xl animate-fade-in"
                          style={{
                            backgroundColor: "var(--card-bg)",
                            border: "1px solid var(--card-border)",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                          }}
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.url}
                              target={child.external ? "_blank" : undefined}
                              rel={child.external ? "noopener noreferrer" : undefined}
                              className="block px-4 py-2.5 text-sm hover:bg-[var(--accent)] transition-colors"
                              style={{ color: "var(--foreground)" }}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {/* Slider indicator */}
                <div className="glass-nav__slider" id="glass-nav-slider" />
              </nav>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <SearchBar />

              {/* Settings button - 整合所有设置 */}
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className={`p-2 rounded-lg transition-colors ${settingsOpen ? "bg-[var(--primary)] text-white" : "hover:bg-[var(--accent)]"}`}
                  title="设置"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>

                {/* Settings panel */}
                {settingsOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-72 rounded-xl animate-fade-in z-50"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      border: "1px solid var(--card-border)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                      padding: "1rem",
                    }}
                  >
                    <h4 className="font-bold text-sm mb-4">设置</h4>

                    {/* Theme mode */}
                    <div className="mb-4">
                      <label className="text-xs text-[var(--muted)] mb-2 block">主题模式</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setMode("light")}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            mode === "light" ? "text-white" : "bg-[var(--accent)] hover:bg-[var(--card-border)]"
                          }`}
                          style={mode === "light" ? { backgroundColor: "var(--primary)" } : {}}
                        >
                          亮色
                        </button>
                        <button
                          onClick={() => setMode("dark")}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            mode === "dark" ? "text-white" : "bg-[var(--accent)] hover:bg-[var(--card-border)]"
                          }`}
                          style={mode === "dark" ? { backgroundColor: "var(--primary)" } : {}}
                        >
                          暗色
                        </button>
                        <button
                          onClick={() => setMode("system")}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            mode === "system" ? "text-white" : "bg-[var(--accent)] hover:bg-[var(--card-border)]"
                          }`}
                          style={mode === "system" ? { backgroundColor: "var(--primary)" } : {}}
                        >
                          跟随系统
                        </button>
                      </div>
                    </div>

                    {/* Theme hue */}
                    <div className="mb-4">
                      <label className="text-xs text-[var(--muted)] mb-2 block">主题色相</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={hue}
                          onChange={(e) => setHue(Number(e.target.value))}
                          className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right,
                              hsl(0, 70%, 50%), hsl(60, 70%, 50%), hsl(120, 70%, 50%),
                              hsl(180, 70%, 50%), hsl(240, 70%, 50%), hsl(300, 70%, 50%), hsl(360, 70%, 50%))`,
                          }}
                        />
                        <span className="text-xs w-8 text-center">{hue}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {[0, 165, 200, 250, 280, 345].map((h) => (
                          <button
                            key={h}
                            onClick={() => setHue(h)}
                            className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                              hue === h ? "border-white shadow-lg scale-110" : "border-transparent"
                            }`}
                            style={{ backgroundColor: `hsl(${h}, 70%, 50%)` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Sakura effect */}
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-[var(--muted)]">樱花特效</label>
                      <SakuraToggle />
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-[var(--accent)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t" style={{ borderColor: "var(--card-border)" }}>
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    href={link.url}
                    target={link.external ? "_blank" : undefined}
                    className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-[var(--accent)]"
                  >
                    {link.name}
                  </Link>
                  {link.children && (
                    <div className="pl-6">
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.url}
                          target={child.external ? "_blank" : undefined}
                          className="block px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:bg-[var(--accent)]"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
