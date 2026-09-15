"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 25;

type Board = number[][];

interface Piece {
  shape: number[][];
  x: number;
  y: number;
  color: number;
}

const PIECES = [
  { shape: [[1, 1, 1, 1]], color: 1 }, // I
  { shape: [[1, 1], [1, 1]], color: 2 }, // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: 3 }, // T
  { shape: [[1, 0, 0], [1, 1, 1]], color: 4 }, // L
  { shape: [[0, 0, 1], [1, 1, 1]], color: 5 }, // J
  { shape: [[0, 1, 1], [1, 1, 0]], color: 6 }, // S
  { shape: [[1, 1, 0], [0, 1, 1]], color: 7 }, // Z
];

const COLORS = [
  "transparent",
  "#00f5ff", // I - cyan
  "#ffeb3b", // O - yellow
  "#9c27b0", // T - purple
  "#ff9800", // L - orange
  "#2196f3", // J - blue
  "#4caf50", // S - green
  "#f44336", // Z - red
];

export function TetrisGame() {
  const [board, setBoard] = useState<Board>(() =>
    Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef<number>(0);

  // Create a new piece
  const createPiece = useCallback((): Piece => {
    const template = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {
      shape: template.shape,
      x: Math.floor((BOARD_WIDTH - template.shape[0].length) / 2),
      y: 0,
      color: template.color,
    };
  }, []);

  // Check if piece position is valid
  const isValidPosition = useCallback(
    (piece: Piece, boardState: Board): boolean => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const newX = piece.x + x;
            const newY = piece.y + y;
            if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return false;
            if (newY >= 0 && boardState[newY][newX]) return false;
          }
        }
      }
      return true;
    },
    []
  );

  // Rotate piece
  const rotatePiece = useCallback(
    (piece: Piece): Piece => {
      const rotated = piece.shape[0].map((_, i) =>
        piece.shape.map((row) => row[i]).reverse()
      );
      return { ...piece, shape: rotated };
    },
    []
  );

  // Lock piece to board
  const lockPiece = useCallback(
    (piece: Piece, boardState: Board): Board => {
      const newBoard = boardState.map((row) => [...row]);
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const boardY = piece.y + y;
            const boardX = piece.x + x;
            if (boardY >= 0) {
              newBoard[boardY][boardX] = piece.color;
            }
          }
        }
      }
      return newBoard;
    },
    []
  );

  // Clear completed lines
  const clearLines = useCallback((boardState: Board): { newBoard: Board; cleared: number } => {
    const newBoard = boardState.filter((row) => row.some((cell) => cell === 0));
    const cleared = BOARD_HEIGHT - newBoard.length;
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    return { newBoard, cleared };
  }, []);

  // Spawn new piece
  const spawnPiece = useCallback(() => {
    const piece = nextPiece || createPiece();
    setNextPiece(createPiece());

    if (!isValidPosition(piece, board)) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    setCurrentPiece(piece);
  }, [nextPiece, createPiece, isValidPosition, board]);

  // Move piece down
  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    const newPiece = { ...currentPiece, y: currentPiece.y + 1 };

    if (isValidPosition(newPiece, board)) {
      setCurrentPiece(newPiece);
    } else {
      // Lock piece
      const newBoard = lockPiece(currentPiece, board);
      const { newBoard: clearedBoard, cleared } = clearLines(newBoard);

      setBoard(clearedBoard);
      if (cleared > 0) {
        setLines((l) => l + cleared);
        setScore((s) => s + cleared * 100 * level);
        setLevel((l) => Math.floor((lines + cleared) / 10) + 1);
      }
      setCurrentPiece(null);
    }
  }, [currentPiece, board, gameOver, isPaused, isValidPosition, lockPiece, clearLines, level, lines]);

  // Move piece horizontally
  const moveHorizontal = useCallback(
    (dir: number) => {
      if (!currentPiece || gameOver || isPaused) return;
      const newPiece = { ...currentPiece, x: currentPiece.x + dir };
      if (isValidPosition(newPiece, board)) {
        setCurrentPiece(newPiece);
      }
    },
    [currentPiece, board, gameOver, isPaused, isValidPosition]
  );

  // Rotate current piece
  const handleRotate = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    const rotated = rotatePiece(currentPiece);
    if (isValidPosition(rotated, board)) {
      setCurrentPiece(rotated);
    }
  }, [currentPiece, board, gameOver, isPaused, rotatePiece, isValidPosition]);

  // Hard drop
  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    let newPiece = { ...currentPiece };
    while (isValidPosition({ ...newPiece, y: newPiece.y + 1 }, board)) {
      newPiece.y++;
    }
    setCurrentPiece(newPiece);
    // Lock immediately
    setTimeout(() => {
      const newBoard = lockPiece(newPiece, board);
      const { newBoard: clearedBoard, cleared } = clearLines(newBoard);
      setBoard(clearedBoard);
      if (cleared > 0) {
        setLines((l) => l + cleared);
        setScore((s) => s + cleared * 100 * level);
      }
      setCurrentPiece(null);
    }, 50);
  }, [currentPiece, board, gameOver, isPaused, isValidPosition, lockPiece, clearLines, level]);

  // Spawn new piece when needed
  useEffect(() => {
    if (isPlaying && !currentPiece && !gameOver) {
      spawnPiece();
    }
  }, [isPlaying, currentPiece, gameOver, spawnPiece]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver || isPaused) return;

    const speed = Math.max(100, 500 - (level - 1) * 50);
    gameLoopRef.current = window.setInterval(moveDown, speed);

    return () => clearInterval(gameLoopRef.current);
  }, [isPlaying, gameOver, isPaused, moveDown, level]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;

      switch (e.key) {
        case "ArrowLeft":
        case "a":
          e.preventDefault();
          moveHorizontal(-1);
          break;
        case "ArrowRight":
        case "d":
          e.preventDefault();
          moveHorizontal(1);
          break;
        case "ArrowDown":
        case "s":
          e.preventDefault();
          moveDown();
          break;
        case "ArrowUp":
        case "w":
          e.preventDefault();
          handleRotate();
          break;
        case " ":
          e.preventDefault();
          hardDrop();
          break;
        case "p":
        case "Escape":
          e.preventDefault();
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver, moveHorizontal, moveDown, handleRotate, hardDrop]);

  // Start game
  const startGame = () => {
    setBoard(Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)));
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    setCurrentPiece(null);
    setNextPiece(createPiece());
    setIsPlaying(true);
  };

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row]);

    // Add current piece to display
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  return (
    <div className="card-base card-padding">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold">得分: {score}</span>
          <span className="text-sm text-[var(--muted)]">行数: {lines}</span>
          <span className="text-sm text-[var(--muted)]">等级: {level}</span>
        </div>
        <button onClick={startGame} className="btn-primary text-sm">
          {isPlaying ? "重新开始" : gameOver ? "再来一局" : "开始游戏"}
        </button>
      </div>

      <div className="flex gap-6 justify-center">
        {/* Game board */}
        <div
          className="relative border-2 rounded-lg overflow-hidden"
          style={{
            width: BOARD_WIDTH * CELL_SIZE,
            height: BOARD_HEIGHT * CELL_SIZE,
            borderColor: "var(--card-border)",
            backgroundColor: "var(--accent)",
          }}
        >
          {renderBoard().map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => (
                <div
                  key={x}
                  className="border border-[var(--card-border)]/20"
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: cell ? COLORS[cell] : "transparent",
                    boxShadow: cell ? "inset 0 0 5px rgba(255,255,255,0.3)" : "none",
                  }}
                />
              ))}
            </div>
          ))}

          {/* Overlays */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">💀</div>
                <p className="text-xl font-bold">游戏结束</p>
                <p className="text-sm opacity-80">得分: {score}</p>
              </div>
            </div>
          )}

          {isPaused && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">⏸️</div>
                <p className="text-xl font-bold">暂停</p>
                <p className="text-sm opacity-80">按 P 或 ESC 继续</p>
              </div>
            </div>
          )}

          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">🧱</div>
                <p className="text-lg font-bold">点击开始</p>
                <p className="text-xs opacity-80">方向键移动，上键旋转，空格硬降</p>
              </div>
            </div>
          )}
        </div>

        {/* Next piece preview */}
        <div className="flex flex-col items-center">
          <p className="text-sm text-[var(--muted)] mb-2">下一个</p>
          <div
            className="border-2 rounded-lg p-2"
            style={{ borderColor: "var(--card-border)", backgroundColor: "var(--accent)" }}
          >
            {nextPiece &&
              nextPiece.shape.map((row, y) => (
                <div key={y} className="flex">
                  {row.map((cell, x) => (
                    <div
                      key={x}
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: cell ? COLORS[nextPiece.color] : "transparent",
                      }}
                    />
                  ))}
                </div>
              ))}
          </div>

          {/* Controls help */}
          <div className="mt-4 text-xs text-[var(--muted)] space-y-1">
            <p>← → 移动</p>
            <p>↑ 旋转</p>
            <p>↓ 加速</p>
            <p>空格 硬降</p>
            <p>P 暂停</p>
          </div>
        </div>
      </div>
    </div>
  );
}
