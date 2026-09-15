"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const sampleTexts = [
  "编程是一门艺术，也是一门手艺。",
  "每天进步一点点，积累起来就是很大的变化。",
  "代码如诗，逻辑如画。",
  "简单是复杂的最高境界。",
  "Stay hungry, stay foolish.",
  "知识就是力量。",
  "学而不思则罔，思而不学则殆。",
  "千里之行，始于足下。",
  "不积跬步，无以至千里。",
  "业精于勤，荒于嬉。",
];

export function TypeClient() {
  const [text, setText] = useState(sampleTexts[0]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [currentErrors, setCurrentErrors] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const resetTest = useCallback(() => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(randomText);
    setInput("");
    setStarted(false);
    setFinished(false);
    setStartTime(0);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setCurrentErrors(0);
    // 自动聚焦
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    resetTest();
  }, [resetTest]);

  // 计算错误数
  const countErrors = (inputText: string): number => {
    let errCount = 0;
    for (let i = 0; i < inputText.length; i++) {
      if (inputText[i] !== text[i]) {
        errCount++;
      }
    }
    return errCount;
  };

  const handleInput = (value: string) => {
    if (finished) return;

    if (!started && value.length > 0) {
      setStarted(true);
      setStartTime(Date.now());
    }

    setInput(value);
    const errCount = countErrors(value);
    setCurrentErrors(errCount);

    // 检查是否完成
    if (value.length >= text.length) {
      setFinished(true);
      const timeTaken = (Date.now() - startTime) / 1000 / 60; // 分钟
      const words = text.length / 5;
      if (timeTaken > 0) {
        setWpm(Math.round(words / timeTaken));
      }
      setErrors(errCount);
      setAccuracy(Math.round(((text.length - errCount) / text.length) * 100));

      // 3秒后自动重新开始
      setTimeout(() => {
        resetTest();
      }, 3000);
    }
  };

  // 获取字符的显示状态
  const getCharStatus = (index: number): "correct" | "incorrect" | "current" | "pending" => {
    if (index < input.length) {
      return input[index] === text[index] ? "correct" : "incorrect";
    }
    if (index === input.length) {
      return "current";
    }
    return "pending";
  };

  return (
    <div className="card-base card-padding">
      {/* Stats */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
            {wpm}
          </div>
          <div className="text-xs text-[var(--muted)]">WPM</div>
        </div>
        <div className="text-center">
          <div className={`text-3xl font-bold ${accuracy >= 90 ? "text-green-500" : accuracy >= 70 ? "text-yellow-500" : "text-red-500"}`}>
            {accuracy}%
          </div>
          <div className="text-xs text-[var(--muted)]">正确率</div>
        </div>
        <div className="text-center">
          <div className={`text-3xl font-bold ${currentErrors === 0 ? "text-green-500" : "text-red-500"}`}>
            {currentErrors}
          </div>
          <div className="text-xs text-[var(--muted)]">错误</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[var(--foreground)]">
            {input.length}/{text.length}
          </div>
          <div className="text-xs text-[var(--muted)]">进度</div>
        </div>
      </div>

      {/* Text display with error highlighting */}
      <div className="p-4 rounded-lg bg-[var(--accent)] mb-4 font-mono text-lg leading-relaxed select-none">
        {text.split("").map((char, i) => {
          const status = getCharStatus(i);
          let className = "";
          switch (status) {
            case "correct":
              className = "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
              break;
            case "incorrect":
              className = "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 underline";
              break;
            case "current":
              className = "bg-[var(--primary)] text-white animate-pulse";
              break;
            case "pending":
              className = "text-[var(--muted)]";
              break;
          }
          return (
            <span key={i} className={className}>
              {char}
            </span>
          );
        })}
      </div>

      {/* Input */}
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => handleInput(e.target.value)}
        disabled={finished}
        placeholder={started ? "" : "点击此处开始输入..."}
        className="w-full p-4 rounded-lg border bg-transparent resize-none focus:outline-none focus:ring-2 disabled:opacity-50"
        style={{ borderColor: "var(--card-border)", "--tw-ring-color": "var(--primary)" } as React.CSSProperties}
        rows={3}
      />

      {/* Error details */}
      {input.length > 0 && !finished && (
        <div className="mt-3 flex items-center gap-4 text-sm">
          <span className="text-[var(--muted)]">
            已输入: <span className="font-medium">{input.length}</span> 字
          </span>
          <span className="text-[var(--muted)]">
            错误: <span className={`font-medium ${currentErrors > 0 ? "text-red-500" : "text-green-500"}`}>{currentErrors}</span> 处
          </span>
          {currentErrors > 0 && (
            <span className="text-xs text-red-400">
              ⚠️ 请注意红色标记的错误字符
            </span>
          )}
        </div>
      )}

      {/* Result */}
      {finished && (
        <div className="mt-6 text-center p-4 rounded-lg bg-[var(--accent)] animate-fade-in">
          <div className="text-4xl mb-2">{accuracy >= 90 ? "🎉" : accuracy >= 70 ? "👍" : "💪"}</div>
          <p className="text-xl font-bold">
            {accuracy >= 90 ? "太棒了！" : accuracy >= 70 ? "不错！" : "继续加油！"}
          </p>
          <p className="text-sm text-[var(--muted)] mt-2">
            速度: {wpm} WPM · 正确率: {accuracy}% · 错误: {errors} 处
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-2">
            3秒后自动开始下一题...
          </p>
        </div>
      )}

      {/* Manual restart button */}
      <div className="flex justify-center gap-4 mt-4">
        <button onClick={resetTest} className="btn-secondary text-sm">
          重新开始
        </button>
      </div>
    </div>
  );
}
