"use client";

import { useState, useRef, useEffect } from "react";
import { siteConfig } from "@/lib/site-config";

export function MusicWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(siteConfig.musicPlayer.volume);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playlist = siteConfig.musicPlayer.playlist;
  const currentSong = playlist[currentTrack];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % playlist.length;
    setCurrentTrack(next);
    setCurrentTime(0);
  };

  const prevTrack = () => {
    const prev = (currentTrack - 1 + playlist.length) % playlist.length;
    setCurrentTrack(prev);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="card-base overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: "var(--card-border)" }}>
        <span className="font-bold text-sm">音乐</span>
      </div>

      {/* Content - 始终展开 */}
      <div className="px-4 pb-4 pt-3">
        {/* Cover & Info */}
        <div className="text-center mb-3">
          <div
            className={`w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-500 flex items-center justify-center ${isPlaying ? "animate-spin" : ""}`}
            style={{ animationDuration: "3s" }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h5 className="font-medium text-sm">{currentSong?.name || "暂未播放"}</h5>
          <p className="text-xs text-[var(--muted)]">{currentSong?.artist || ""}</p>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <span>{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-[var(--accent)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--primary)] transition-all"
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button onClick={prevTrack} className="p-1.5 hover:bg-[var(--accent)] rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={togglePlay}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white transition-colors"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            )}
          </button>
          <button onClick={nextTrack} className="p-1.5 hover:bg-[var(--accent)] rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Volume */}
        <div className="mt-3 flex items-center gap-2">
          <svg className="w-3 h-3 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-1 accent-[var(--primary)]"
          />
        </div>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={currentSong?.url}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={nextTrack}
        />
      </div>
    </div>
  );
}
