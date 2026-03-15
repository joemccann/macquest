"use client";

import { m } from "framer-motion";
import { AudioToggle } from "./AudioToggle";

interface LevelCompleteScreenProps {
  isSpelling: boolean;
  isPerfect: boolean;
  score: number;
  bonusAwarded: number;
  currentWord: string;
  lettersLength: number;
  muted: boolean;
  onToggleAudio: () => void;
  onReturnHome: () => void;
  onNext: () => void;
}

export function LevelCompleteScreen({
  isSpelling,
  isPerfect,
  score,
  bonusAwarded,
  currentWord,
  lettersLength,
  muted,
  onToggleAudio,
  onReturnHome,
  onNext,
}: LevelCompleteScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 relative z-10">
      {/* Home button */}
      <m.button
        onClick={onReturnHome}
        className="absolute top-4 left-4 cursor-pointer z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white/40 hover:text-white/70 transition-colors"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <span className="text-base">🏠</span>
        <span>Home</span>
      </m.button>
      <AudioToggle
        muted={muted}
        onToggle={onToggleAudio}
        className="absolute top-4 right-4 z-20"
      />

      {/* Celebration emoji */}
      <m.div
        className="text-8xl"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        {isPerfect ? "🌟" : "🎉"}
      </m.div>

      <m.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="text-center"
      >
        <h2
          className="text-5xl md:text-7xl font-bold mb-3"
          style={{
            background: "linear-gradient(135deg, #fbbf24 0%, #f97316 30%, #ec4899 60%, #c084fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 4px 16px rgba(251, 191, 36, 0.3))",
          }}
        >
          {isSpelling ? "Word Complete!" : "Level Complete!"}
        </h2>
        <p className="text-xl text-white/50 font-medium">
          {isSpelling
            ? `You spelled "${currentWord.toUpperCase()}"!`
            : `You typed ${lettersLength} letters!`}
        </p>
      </m.div>

      {/* Score summary */}
      <m.div
        className="glass-panel px-8 py-5 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">⭐</span>
          <span
            className="text-3xl font-bold"
            style={{
              background: "linear-gradient(135deg, #fbbf24, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {score.toLocaleString()}
          </span>
        </div>
        {isPerfect && (
          <m.p
            className="text-lg font-semibold mt-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.6 }}
            style={{
              background: "linear-gradient(135deg, #34d399, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PERFECT! Bonus: +{bonusAwarded.toLocaleString()}
          </m.p>
        )}
      </m.div>

      <m.button
        onClick={onNext}
        className="relative group cursor-pointer"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <div
          className="absolute -inset-2 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"
          style={{
            background: "linear-gradient(135deg, #34d399, #3b82f6)",
            filter: "blur(14px)",
          }}
        />
        <div
          className="relative px-14 py-5 rounded-full text-2xl font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            boxShadow: "0 4px 24px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.15)",
          }}
        >
          {isSpelling ? "Next Word →" : "Next Level →"}
        </div>
      </m.button>
    </div>
  );
}
