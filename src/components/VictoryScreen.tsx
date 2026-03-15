"use client";

import { AudioToggle } from "./AudioToggle";

interface VictoryScreenProps {
  isSpelling: boolean;
  score: number;
  perfectLevels: number[];
  mode: string;
  muted: boolean;
  onToggleAudio: () => void;
  onReturnHome: () => void;
  onStartSpelling: () => void;
  onStart: () => void;
}

export function VictoryScreen({
  isSpelling,
  score,
  perfectLevels,
  mode,
  muted,
  onToggleAudio,
  onReturnHome,
  onStartSpelling,
  onStart,
}: VictoryScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 relative z-10">
      <button
        onClick={onReturnHome}
        className="absolute top-4 left-4 cursor-pointer z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white/40 hover:text-white/70 transition-all hover:scale-[1.06] active:scale-[0.94] animate-home-btn"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
      >
        <span className="text-base">🏠</span>
        <span>Home</span>
      </button>
      <AudioToggle
        muted={muted}
        onToggle={onToggleAudio}
        className="absolute top-4 right-4 z-20"
      />

      <div className="text-8xl animate-victory-emoji">
        {isSpelling ? "🎓" : "🏆"}
      </div>

      <div className="text-center animate-victory-title">
        <h2
          className="text-5xl md:text-7xl font-bold mb-3"
          style={{
            background: "linear-gradient(135deg, #fbbf24 0%, #f97316 30%, #ec4899 60%, #c084fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 4px 16px rgba(251, 191, 36, 0.3))",
          }}
        >
          {isSpelling ? "Spelling Champion!" : "You Won!"}
        </h2>
        <p className="text-xl text-white/50 font-medium">
          {isSpelling
            ? "You spelled all 100 words!"
            : "You mastered the entire keyboard!"}
        </p>
      </div>

      <div className="glass-panel px-10 py-6 text-center animate-victory-score">
        <p className="text-sm text-white/40 mb-1">Final Score</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl">⭐</span>
          <span
            className="text-5xl font-bold"
            style={{
              background: "linear-gradient(135deg, #fbbf24, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {score.toLocaleString()}
          </span>
        </div>
        {perfectLevels.length > 0 && (
          <p className="text-sm text-white/40 mt-3">
            {perfectLevels.length} perfect {mode === "spelling" ? "word" : "level"}{perfectLevels.length !== 1 ? "s" : ""}!
          </p>
        )}
      </div>

      {!isSpelling && (
        <div className="flex flex-col items-center gap-3 animate-victory-action1">
          <p className="text-lg text-white/40 font-medium">
            Ready to start spelling words?
          </p>
          <button
            onClick={onStartSpelling}
            className="relative group cursor-pointer transition-transform hover:scale-[1.06] active:scale-[0.94]"
          >
            <div
              className="absolute -inset-2 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"
              style={{ background: "linear-gradient(135deg, #34d399, #3b82f6)", filter: "blur(14px)" }}
            />
            <div
              className="relative px-14 py-5 rounded-full text-2xl font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                boxShadow: "0 4px 24px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.15)",
              }}
            >
              Start Spelling Words!
            </div>
          </button>
        </div>
      )}

      <button
        onClick={onStart}
        className="relative group cursor-pointer transition-transform hover:scale-[1.06] active:scale-[0.94] animate-victory-action2"
      >
        <div
          className="absolute -inset-2 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"
          style={{ background: "linear-gradient(135deg, #f472b6, #c084fc, #38bdf8)", filter: "blur(14px)" }}
        />
        <div
          className="relative px-14 py-5 rounded-full text-2xl font-bold text-white"
          style={{
            background: isSpelling
              ? "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)"
              : "rgba(255,255,255,0.1)",
            boxShadow: isSpelling
              ? "0 4px 24px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.15)"
              : "inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          Play Again
        </div>
      </button>
    </div>
  );
}
