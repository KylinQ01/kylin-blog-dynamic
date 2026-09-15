"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  mode: ThemeMode;
  hue: number;
  setMode: (mode: ThemeMode) => void;
  setHue: (hue: number) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "system",
  hue: 165,
  setMode: () => {},
  setHue: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [hue, setHue] = useState(165);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem("theme-mode") as ThemeMode;
    const savedHue = localStorage.getItem("theme-hue");
    if (savedMode) setMode(savedMode);
    if (savedHue) setHue(Number(savedHue));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;

    const applyTheme = () => {
      if (mode === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", prefersDark);
      } else {
        root.classList.toggle("dark", mode === "dark");
      }
    };

    applyTheme();
    // 系统深浅色实时切换时同步（否则页面处于混合态：部分组件暗色、部分亮色）
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [mode, mounted]);

  useEffect(() => {
    document.documentElement.style.setProperty("--hue", String(hue));
  }, [hue]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("theme-mode", mode);
    localStorage.setItem("theme-hue", String(hue));
  }, [mode, hue, mounted]);

  const handleSetMode = useCallback((newMode: ThemeMode) => setMode(newMode), []);
  const handleSetHue = useCallback((newHue: number) => setHue(newHue), []);

  return (
    <ThemeContext.Provider value={{ mode, hue, setMode: handleSetMode, setHue: handleSetHue }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
