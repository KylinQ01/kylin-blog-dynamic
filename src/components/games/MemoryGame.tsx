"use client";

import { useState, useEffect, useCallback } from "react";

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ["🌸", "🎮", "🎵", "🌟", "🍀", "🎯", "🦋", "🌈"];

export function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  // Initialize game
  const initGame = useCallback(() => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Check for match when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatches((m) => m + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }

      setMoves((m) => m + 1);
    }
  }, [flippedCards, cards]);

  // Check for game completion
  useEffect(() => {
    if (matches === emojis.length && matches > 0) {
      setIsComplete(true);
      setBestScore((b) => (b === 0 ? moves : Math.min(b, moves)));
    }
  }, [matches, moves]);

  const handleCardClick = (id: number) => {
    if (flippedCards.length >= 2) return;
    if (cards[id].isFlipped || cards[id].isMatched) return;

    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, isFlipped: true } : card))
    );
    setFlippedCards((prev) => [...prev, id]);
  };

  return (
    <div className="card-base card-padding">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold">步数: {moves}</span>
          <span className="text-sm text-[var(--muted)]">
            配对: {matches}/{emojis.length}
          </span>
          {bestScore > 0 && (
            <span className="text-sm text-[var(--muted)]">最佳: {bestScore}</span>
          )}
        </div>
        <button onClick={initGame} className="btn-primary text-sm">
          重新开始
        </button>
      </div>

      {/* Game grid */}
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all duration-300 transform ${
              card.isFlipped || card.isMatched
                ? "bg-[var(--card-bg)] border-2 scale-100"
                : "bg-[var(--primary)] hover:scale-105 cursor-pointer"
            } ${card.isMatched ? "opacity-60 border-green-500" : "border-[var(--card-border)]"}`}
            style={{
              transform: card.isFlipped || card.isMatched ? "rotateY(0deg)" : "rotateY(180deg)",
            }}
            disabled={card.isFlipped || card.isMatched}
          >
            {card.isFlipped || card.isMatched ? (
              <span className="animate-bounce">{card.emoji}</span>
            ) : (
              <span className="text-white text-2xl">?</span>
            )}
          </button>
        ))}
      </div>

      {/* Completion overlay */}
      {isComplete && (
        <div className="mt-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-xl font-bold">恭喜完成！</p>
          <p className="text-sm text-[var(--muted)]">用了 {moves} 步完成游戏</p>
          <button onClick={initGame} className="mt-3 btn-primary">
            再玩一次
          </button>
        </div>
      )}
    </div>
  );
}
