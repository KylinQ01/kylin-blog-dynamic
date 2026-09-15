"use client";

import { useState, useEffect } from "react";

const recommendations = [
  { day: "周日", text: "整理本周所学，写下总结笔记", icon: "📝" },
  { day: "周一", text: "新的开始，制定本周计划", icon: "🎯" },
  { day: "周二", text: "深入学习一个新知识点", icon: "📚" },
  { day: "周三", text: "复盘之前的代码，优化重构", icon: "🔧" },
  { day: "周四", text: "整理代码笔记，记录心得", icon: "💻" },
  { day: "周五", text: "尝试一个小项目或练习", icon: "🚀" },
  { day: "周六", text: "放松一下，看看技术博客", icon: "☕" },
];

export function TodayRecommend() {
  const [recommend, setRecommend] = useState(recommendations[0]);
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0-6
    setRecommend(recommendations[dayOfWeek]);

    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    setCurrentDay(weekdays[dayOfWeek]);
  }, []);

  return (
    <div className="card-base card-padding" style={{ background: "linear-gradient(135deg, hsl(var(--hue + 30), 40%, 94%) 0%, hsl(var(--hue + 30), 60%, 90%) 100%)" }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{recommend.icon}</span>
        <h4 className="font-bold text-sm">今日推荐</h4>
        <span className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{ backgroundColor: "var(--primary)", color: "#fff" }}>{currentDay}</span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{recommend.text}</p>
    </div>
  );
}
