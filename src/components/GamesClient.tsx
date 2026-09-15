"use client";

import { useState } from "react";
import { SnakeGame } from "@/components/games/SnakeGame";
import { MemoryGame } from "@/components/games/MemoryGame";
import { TetrisGame } from "@/components/games/TetrisGame";

type GameType = "menu" | "snake" | "memory" | "tetris";

const games = [
  {
    id: "snake",
    name: "贪吃蛇",
    icon: "🐍",
    description: "经典贪吃蛇游戏，用方向键控制",
    color: "#43e97b",
  },
  {
    id: "memory",
    name: "记忆翻牌",
    icon: "🧠",
    description: "翻开卡片找到相同的配对",
    color: "#4facfe",
  },
  {
    id: "tetris",
    name: "俄罗斯方块",
    icon: "🧱",
    description: "经典俄罗斯方块，填满行消除",
    color: "#fa709a",
  },
];

export function GamesClient() {
  const [currentGame, setCurrentGame] = useState<GameType>("menu");

  return (
    <>
      {currentGame === "menu" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setCurrentGame(game.id as GameType)}
              className="card-base card-padding text-left hover:shadow-lg transition-all group"
              style={{ borderColor: game.color + "40" }}
            >
              <div className="text-4xl mb-3">{game.icon}</div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-[var(--primary)] transition-colors">
                {game.name}
              </h3>
              <p className="text-sm text-[var(--muted)]">{game.description}</p>
            </button>
          ))}
        </div>
      )}

      {currentGame === "snake" && (
        <div>
          <button
            onClick={() => setCurrentGame("menu")}
            className="mb-4 btn-secondary text-sm"
          >
            ← 返回游戏列表
          </button>
          <SnakeGame />
        </div>
      )}

      {currentGame === "memory" && (
        <div>
          <button
            onClick={() => setCurrentGame("menu")}
            className="mb-4 btn-secondary text-sm"
          >
            ← 返回游戏列表
          </button>
          <MemoryGame />
        </div>
      )}

      {currentGame === "tetris" && (
        <div>
          <button
            onClick={() => setCurrentGame("menu")}
            className="mb-4 btn-secondary text-sm"
          >
            ← 返回游戏列表
          </button>
          <TetrisGame />
        </div>
      )}
    </>
  );
}
