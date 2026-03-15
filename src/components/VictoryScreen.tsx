"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
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
    <LazyMotion features={domAnimation}>
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

      <m.div
        className="text-8xl"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        {isSpelling ? "🎓" : "🏆"}
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
          {isSpelling ? "Spelling Champion!" : "You Won!"}
        </h2>
        <p className="text-xl text-white/50 font-medium">
          {isSpelling
            ? "You spelled all 100 words!"
            : "You mastered the entire keyboard!"}
        </p>
      </m.div>

      <m.div
        className="glass-panel px-10 py-6 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
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
      </m.div>

      {/* Keys victory: show both "Start Spelling" and "Play Again" */}
      {!isSpelling && (
        <m.div
          className="flex flex-col items-center gap-3"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-lg text-white/40 font-medium">
            Ready to start spelling words?
          </p>
          <m.button
            onClick={onStartSpelling}
            className="relative group cursor-pointer"
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
              Start Spelling Words!
            </div>
          </m.button>
        </m.div>
      )}

      <m.button
        onClick={onStart}
        className="relative group cursor-pointer"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: isSpelling ? 0.8 : 1.0 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <div
          className="absolute -inset-2 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"
          style={{
            background: "linear-gradient(135deg, #f472b6, #c084fc, #38bdf8)",
            filter: "blur(14px)",
          }}
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
      </m.button>
    </div>
    </LazyMotion>
  );
}
