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

    if (mode === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", mode === "dark");
    }

    root.style.setProperty("--hue", String(hue));
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
