"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface SakuraPetalsConfig {
  enable: boolean;
  sakuraNum: number;
  limitTimes: number;
  size: { min: number; max: number };
  opacity: { min: number; max: number };
  speed: {
    horizontal: { min: number; max: number };
    vertical: { min: number; max: number };
    rotation: number;
    fadeSpeed: number;
  };
  zIndex: number;
}

const defaultConfig: SakuraPetalsConfig = {
  enable: true,
  sakuraNum: 21,
  limitTimes: -1,
  size: { min: 0.5, max: 1.1 },
  opacity: { min: 0.3, max: 0.9 },
  speed: {
    horizontal: { min: -1.7, max: -1.2 },
    vertical: { min: 1.5, max: 2.2 },
    rotation: 0.03,
    fadeSpeed: 0.03,
  },
  zIndex: 100,
};

interface Petal {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  fadeSpeed: number;
  color: string;
}

// 全局状态 - 让 SakuraParticles 和 SakuraToggle 共享
let globalEnabled = defaultConfig.enable;
const listeners: Set<() => void> = new Set();

function setGlobalEnabled(value: boolean) {
  globalEnabled = value;
  if (typeof window !== "undefined") {
    localStorage.setItem("sakura-enabled", String(value));
  }
  listeners.forEach(fn => fn());
}

function getGlobalEnabled(): boolean {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("sakura-enabled");
    if (saved !== null) {
      globalEnabled = saved === "true";
    }
  }
  return globalEnabled;
}

// 自定义 Hook 用于共享状态
function useSakuraEnabled() {
  const [enabled, setEnabled] = useState(getGlobalEnabled());

  useEffect(() => {
    const listener = () => setEnabled(globalEnabled);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const toggle = useCallback(() => {
    setGlobalEnabled(!globalEnabled);
  }, []);

  return { enabled, toggle };
}

export function SakuraParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animationRef = useRef<number>(0);
  const { enabled } = useSakuraEnabled();

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = [
      "#ffb7c5", "#ffc1cc", "#ff99aa", "#ffd1dc", "#ffe4e9", "#f8b4c8",
    ];

    const createPetal = (): Petal => {
      const sizeRatio = defaultConfig.size.min + Math.random() * (defaultConfig.size.max - defaultConfig.size.min);
      return {
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 100,
        size: 8 + sizeRatio * 8,
        opacity: defaultConfig.opacity.min + Math.random() * (defaultConfig.opacity.max - defaultConfig.opacity.min),
        speedX: defaultConfig.speed.horizontal.min + Math.random() * (defaultConfig.speed.horizontal.max - defaultConfig.speed.horizontal.min),
        speedY: defaultConfig.speed.vertical.min + Math.random() * (defaultConfig.speed.vertical.max - defaultConfig.speed.vertical.min),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * defaultConfig.speed.rotation,
        fadeSpeed: defaultConfig.speed.fadeSpeed,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    petalsRef.current = Array.from({ length: defaultConfig.sakuraNum }, () => {
      const petal = createPetal();
      petal.y = Math.random() * canvas.height;
      return petal;
    });

    const drawPetal = (ctx: CanvasRenderingContext2D, petal: Petal) => {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rotation);
      ctx.globalAlpha = petal.opacity;
      ctx.fillStyle = petal.color;

      ctx.beginPath();
      const s = petal.size;
      ctx.moveTo(0, -s * 0.5);
      ctx.bezierCurveTo(s * 0.5, -s * 0.8, s * 0.8, -s * 0.2, 0, s * 0.5);
      ctx.bezierCurveTo(-s * 0.8, -s * 0.2, -s * 0.5, -s * 0.8, 0, -s * 0.5);
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.3);
      ctx.lineTo(0, s * 0.3);
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petalsRef.current.forEach((petal, i) => {
        petal.x += petal.speedX;
        petal.y += petal.speedY;
        petal.rotation += petal.rotationSpeed;
        petal.x += Math.sin(petal.y * 0.01) * 0.3;

        drawPetal(ctx, petal);

        if (petal.y > canvas.height + 20 || petal.x < -50 || petal.x > canvas.width + 50) {
          petalsRef.current[i] = createPetal();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: defaultConfig.zIndex }}
    />
  );
}

// Toggle button component - 使用共享状态
export function SakuraToggle() {
  const { enabled, toggle } = useSakuraEnabled();

  return (
    <button
      onClick={toggle}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        enabled ? "text-white" : "bg-[var(--accent)] hover:bg-[var(--card-border)] text-[var(--foreground)]"
      }`}
      style={enabled ? { backgroundColor: "var(--primary)" } : {}}
    >
      {enabled ? "开启" : "关闭"}
    </button>
  );
}
