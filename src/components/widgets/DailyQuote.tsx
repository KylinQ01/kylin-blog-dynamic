"use client";

import { useState, useEffect } from "react";

const quotes = [
  { text: "「当你觉得自己很聪明的时候，去写一串正则表达式吧。」", author: "匿名" },
  { text: "「代码是写给人看的，只是恰好能被机器执行。」", author: "Harold Abelson" },
  { text: "「先让它工作，再让它正确，最后让它快速。」", author: "Kent Beck" },
  { text: "「任何足够先进的技术，都与魔法无异。」", author: "Arthur C. Clarke" },
  { text: "「简单是复杂的最高境界。」", author: "达芬奇" },
  { text: "「不积跬步，无以至千里；不积小流，无以成江海。」", author: "荀子" },
  { text: "「学而不思则罔，思而不学则殆。」", author: "孔子" },
  { text: "「千里之行，始于足下。」", author: "老子" },
  { text: "「工欲善其事，必先利其器。」", author: "孔子" },
  { text: "「知之者不如好之者，好之者不如乐之者。」", author: "孔子" },
];

export function DailyQuote() {
  const [quote, setQuote] = useState(quotes[0]);
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    setDateStr(`${month}月${day}日`);

    // 根据日期选择名言（每天不同）
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    setQuote(quotes[dayOfYear % quotes.length]);
  }, []);

  return (
    <div className="card-base card-padding" style={{ background: "linear-gradient(135deg, hsl(var(--hue), 30%, 95%) 0%, hsl(var(--hue), 50%, 92%) 100%)" }}>
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4" style={{ color: "var(--primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h4 className="font-bold text-sm">每日一言</h4>
        <span className="text-xs text-[var(--muted)] ml-auto">{dateStr}</span>
      </div>
      <div className="pl-3 border-l-2" style={{ borderColor: "var(--primary)" }}>
        <p className="text-sm italic leading-relaxed" style={{ color: "var(--foreground)" }}>{quote.text}</p>
        <p className="text-xs mt-2 text-[var(--muted)]">—— {quote.author}</p>
      </div>
    </div>
  );
}
