"use client";

import { useState, useEffect } from "react";

export function TimeCalendar() {
  const [today, setToday] = useState<{
    day: string;
    month: number;
    date: number;
    year: number;
    weekday: string;
    weekdayNum: number;
  } | null>(null);

  useEffect(() => {
    const now = new Date();
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    setToday({
      day: `${now.getMonth() + 1}月${now.getDate()}日`,
      month: now.getMonth() + 1,
      date: now.getDate(),
      year: now.getFullYear(),
      weekday: weekdays[now.getDay()],
      weekdayNum: now.getDay(),
    });
  }, []);

  const getRemainingDays = () => {
    if (!today) return 0;
    const now = new Date();
    const endOfYear = new Date(today.year, 11, 31);
    const diff = endOfYear.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getRemainingMonthDays = () => {
    if (!today) return 0;
    const now = new Date();
    const endOfMonth = new Date(today.year, today.month, 0);
    const diff = endOfMonth.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getRemainingWeekDays = () => {
    if (!today) return 0;
    const now = new Date();
    const dayOfWeek = now.getDay();
    return 7 - (dayOfWeek === 0 ? 7 : dayOfWeek);
  };

  const getProgressPercent = () => {
    if (!today) return 0;
    const now = new Date();
    const startOfYear = new Date(today.year, 0, 1);
    const endOfYear = new Date(today.year, 11, 31);
    const total = endOfYear.getTime() - startOfYear.getTime();
    const elapsed = now.getTime() - startOfYear.getTime();
    return Math.round((elapsed / total) * 100);
  };

  if (!today) return null;

  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <div className="card-base card-padding">
      <h4 className="font-bold text-sm mb-3">时光日历</h4>

      {/* 日期显示 */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
          {today.date}
        </div>
        <div className="text-sm text-[var(--muted)] mt-1">
          {today.year}年{today.month}月 · {today.weekday}
        </div>
      </div>

      {/* 星期指示器 */}
      <div className="flex justify-center gap-1 mb-4">
        {weekdays.map((day, i) => (
          <div
            key={day}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-xs ${
              i === today.weekdayNum
                ? "text-white font-bold"
                : "text-[var(--muted)]"
            }`}
            style={i === today.weekdayNum ? { backgroundColor: "var(--primary)" } : {}}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 进度信息 */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-[var(--muted)]">本月剩余</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-[var(--accent)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${100 - (getRemainingMonthDays() / 30) * 100}%`,
                  backgroundColor: "var(--primary)",
                }}
              />
            </div>
            <span className="text-xs font-medium">{getRemainingMonthDays()}天</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-[var(--muted)]">本周剩余</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-[var(--accent)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${100 - (getRemainingWeekDays() / 7) * 100}%`,
                  backgroundColor: "var(--primary)",
                }}
              />
            </div>
            <span className="text-xs font-medium">{getRemainingWeekDays()}天</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-[var(--muted)]">今年剩余</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-[var(--accent)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${getProgressPercent()}%`,
                  backgroundColor: "var(--primary)",
                }}
              />
            </div>
            <span className="text-xs font-medium">{getRemainingDays()}天</span>
          </div>
        </div>
      </div>

      {/* 年度进度 */}
      <div className="mt-4 pt-3 border-t" style={{ borderColor: "var(--card-border)" }}>
        <div className="flex justify-between items-center text-xs">
          <span className="text-[var(--muted)]">年度进度</span>
          <span className="font-bold" style={{ color: "var(--primary)" }}>
            {getProgressPercent()}%
          </span>
        </div>
      </div>
    </div>
  );
}
