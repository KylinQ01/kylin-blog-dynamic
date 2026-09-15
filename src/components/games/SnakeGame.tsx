"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

export function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const directionRef = useRef(direction);
  const gameLoopRef = useRef<number>(0);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPlaying(true);
  }, [generateFood]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      const keyMap: Record<string, Direction> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        s: "DOWN",
        a: "LEFT",
        d: "RIGHT",
      };

      const newDir = keyMap[e.key];
      if (newDir) {
        e.preventDefault();
        const opposites: Record<Direction, Direction> = {
          UP: "DOWN",
          DOWN: "UP",
          LEFT: "RIGHT",
          RIGHT: "LEFT",
        };
        if (opposites[newDir] !== directionRef.current) {
          setDirection(newDir);
          directionRef.current = newDir;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        switch (direction) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          setHighScore((h) => Math.max(h, score));
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          setIsPlaying(false);
          setHighScore((h) => Math.max(h, score));
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
          // Increase speed
          setSpeed((s) => Math.max(50, s - 2));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    gameLoopRef.current = window.setInterval(moveSnake, speed);
    return () => clearInterval(gameLoopRef.current);
  }, [isPlaying, gameOver, direction, food, generateFood, score, speed]);

  return (
    <div className="card-base card-padding">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold">得分: {score}</span>
          <span className="text-sm text-[var(--muted)]">最高: {highScore}</span>
        </div>
        <button onClick={resetGame} className="btn-primary text-sm">
          {isPlaying ? "重新开始" : gameOver ? "再来一局" : "开始游戏"}
        </button>
      </div>

      {/* Game board */}
      <div
        className="relative mx-auto rounded-lg overflow-hidden border-2"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          borderColor: "var(--card-border)",
          backgroundColor: "var(--accent)",
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: GRID_SIZE }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full border-t border-[var(--muted)]"
              style={{ top: i * CELL_SIZE }}
            />
          ))}
          {Array.from({ length: GRID_SIZE }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full border-l border-[var(--muted)]"
              style={{ left: i * CELL_SIZE }}
            />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute rounded-sm transition-all duration-75"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE + 1,
              top: segment.y * CELL_SIZE + 1,
              backgroundColor: i === 0 ? "#43e97b" : `hsl(142, 70%, ${50 - i * 2}%)`,
              boxShadow: i === 0 ? "0 0 8px rgba(67, 233, 123, 0.5)" : "none",
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            width: CELL_SIZE - 4,
            height: CELL_SIZE - 4,
            left: food.x * CELL_SIZE + 2,
            top: food.y * CELL_SIZE + 2,
            backgroundColor: "#f5576c",
            boxShadow: "0 0 10px rgba(245, 87, 108, 0.5)",
          }}
        />

        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">💀</div>
              <p className="text-xl font-bold">游戏结束</p>
              <p className="text-sm opacity-80">得分: {score}</p>
            </div>
          </div>
        )}

        {/* Start overlay */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">🐍</div>
              <p className="text-lg font-bold">点击开始</p>
              <p className="text-xs opacity-80">使用方向键或 WASD 控制</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile controls */}
      <div className="mt-4 flex flex-col items-center gap-2 md:hidden">
        <button
          onClick={() => {
            if (direction !== "DOWN") {
              setDirection("UP");
              directionRef.current = "UP";
            }
          }}
          className="w-12 h-12 rounded-lg bg-[var(--accent)] flex items-center justify-center text-xl"
        >
          ↑
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (direction !== "RIGHT") {
                setDirection("LEFT");
                directionRef.current = "LEFT";
              }
            }}
            className="w-12 h-12 rounded-lg bg-[var(--accent)] flex items-center justify-center text-xl"
          >
            ←
          </button>
          <button
            onClick={() => {
              if (direction !== "UP") {
                setDirection("DOWN");
                directionRef.current = "DOWN";
              }
            }}
            className="w-12 h-12 rounded-lg bg-[var(--accent)] flex items-center justify-center text-xl"
          >
            ↓
          </button>
          <button
            onClick={() => {
              if (direction !== "LEFT") {
                setDirection("RIGHT");
                directionRef.current = "RIGHT";
              }
            }}
            className="w-12 h-12 rounded-lg bg-[var(--accent)] flex items-center justify-center text-xl"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
