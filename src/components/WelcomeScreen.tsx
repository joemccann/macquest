"use client";

import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onStart: () => void;
  onResume?: () => void;
  savedLevel?: number;
  savedScore?: number;
}

export function WelcomeScreen({ onStart, onResume, savedLevel, savedScore }: WelcomeScreenProps) {
  const hasSave = onResume && savedLevel !== undefined;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 relative z-10">
      {/* Floating mascot */}
      <motion.div
        className="text-7xl"
        animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        <span role="img" aria-label="rocket">🚀</span>
      </motion.div>

      {/* Title */}
      <motion.div
        className="text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <h1
          className="text-7xl md:text-9xl font-bold tracking-tight leading-none mb-2"
          style={{
            background: "linear-gradient(135deg, #f472b6 0%, #c084fc 25%, #818cf8 50%, #38bdf8 75%, #34d399 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 4px 24px rgba(139, 92, 246, 0.4))",
          }}
        >
          MacQuest
        </h1>
        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-400/50" />
          <p
            className="text-xl md:text-2xl font-medium tracking-widest uppercase"
            style={{ color: "rgba(196, 181, 253, 0.7)" }}
          >
            The Typing Adventure
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-400/50" />
        </motion.div>
      </motion.div>

      {/* Instruction card */}
      <motion.div
        className="glass-panel px-8 py-6 max-w-md text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {hasSave ? (
          <>
            <p className="text-lg text-white/70 leading-relaxed mb-1">
              Welcome back!
            </p>
            <p className="text-sm text-white/50">
              Level {savedLevel} · Score: {savedScore?.toLocaleString()}
            </p>
          </>
        ) : (
          <>
            <p className="text-lg text-white/70 leading-relaxed">
              Find the{" "}
              <span
                className="font-bold"
                style={{
                  background: "linear-gradient(135deg, #c084fc, #818cf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Magic Buttons
              </span>{" "}
              on your keyboard!
            </p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <span
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-lg font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(99, 102, 241, 0.3))",
                  border: "1px solid rgba(139, 92, 246, 0.4)",
                  boxShadow: "0 0 20px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                F
              </span>
              <span className="text-white/30 text-sm font-medium">and</span>
              <span
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-lg font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(99, 102, 241, 0.3))",
                  border: "1px solid rgba(139, 92, 246, 0.4)",
                  boxShadow: "0 0 20px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                J
              </span>
            </div>
            <p className="text-sm text-white/40 mt-3">They have little bumps you can feel!</p>
          </>
        )}
      </motion.div>

      {/* Buttons */}
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.3, type: "spring", stiffness: 180, damping: 12 }}
      >
        {hasSave ? (
          <>
            {/* Continue Adventure (primary) */}
            <motion.button
              onClick={onResume}
              className="relative group cursor-pointer"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              <div
                className="absolute -inset-2 rounded-full opacity-60 group-hover:opacity-80 transition-opacity animate-pulse-ring"
                style={{
                  background: "linear-gradient(135deg, #f472b6, #c084fc, #38bdf8)",
                  filter: "blur(16px)",
                }}
              />
              <div
                className="relative px-14 py-5 rounded-full text-2xl font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)",
                  boxShadow: "0 4px 24px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.15)",
                }}
              >
                <motion.span
                  className="inline-block"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                >
                  Continue Adventure
                </motion.span>
              </div>
            </motion.button>

            {/* Start Over (ghost button) */}
            <motion.button
              onClick={onStart}
              className="cursor-pointer px-8 py-2.5 rounded-full text-base font-medium text-white/40 hover:text-white/60 transition-colors"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Start Over
            </motion.button>
          </>
        ) : (
          <motion.button
            onClick={onStart}
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            <div
              className="absolute -inset-2 rounded-full opacity-60 group-hover:opacity-80 transition-opacity animate-pulse-ring"
              style={{
                background: "linear-gradient(135deg, #f472b6, #c084fc, #38bdf8)",
                filter: "blur(16px)",
              }}
            />
            <div
              className="relative px-14 py-5 rounded-full text-2xl font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)",
                boxShadow: "0 4px 24px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.15)",
              }}
            >
              <motion.span
                className="inline-block"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              >
                Start Adventure
              </motion.span>
            </div>
          </motion.button>
        )}
      </motion.div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-[12%] left-[8%] text-4xl"
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute top-[18%] right-[12%] text-3xl"
        animate={{ y: [0, -10, 0], rotate: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
      >
        ⭐
      </motion.div>
      <motion.div
        className="absolute bottom-[15%] left-[15%] text-3xl"
        animate={{ y: [0, -12, 0], rotate: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }}
      >
        🌟
      </motion.div>
      <motion.div
        className="absolute bottom-[20%] right-[8%] text-4xl"
        animate={{ y: [0, -8, 0], rotate: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
      >
        🪐
      </motion.div>
    </div>
  );
}
