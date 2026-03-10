"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface WelcomeScreenProps {
  onStart: () => void;
  onStartSpelling: () => void;
  onResume?: () => void;
  savedLevel?: number;
  savedScore?: number;
}

export function WelcomeScreen({ onStart, onStartSpelling, onResume, savedLevel, savedScore }: WelcomeScreenProps) {
  const hasSave = onResume && savedLevel !== undefined;
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    if (!showAboutModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowAboutModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAboutModal]);

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
        {hasSave && (
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
          </>
        )}

        {/* Mode selection buttons — always visible */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onStart}
            className="relative group cursor-pointer"
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
              className="relative px-10 py-4 rounded-full text-xl font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)",
                boxShadow: "0 4px 24px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.15)",
              }}
            >
              <span role="img" aria-label="rocket">🚀</span> Practice Typing
            </div>
          </motion.button>

          <motion.button
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
              className="relative px-10 py-4 rounded-full text-xl font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                boxShadow: "0 4px 24px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.15)",
              }}
            >
              <span role="img" aria-label="pencil">✏️</span> Spelling Words
            </div>
          </motion.button>
        </div>

        {hasSave && (
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
        )}

        <motion.button
          type="button"
          onClick={() => setShowAboutModal(true)}
          className="group relative cursor-pointer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <div
            className="absolute -inset-2 rounded-full opacity-35 transition-opacity group-hover:opacity-55"
            style={{
              background: "linear-gradient(135deg, rgba(56, 189, 248, 0.38), rgba(139, 92, 246, 0.28), rgba(244, 114, 182, 0.24))",
              filter: "blur(16px)",
            }}
          />
          <div
            className="relative rounded-full px-7 py-3 text-base font-semibold text-white/78"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
            }}
          >
            <span role="img" aria-hidden="true">🪐</span>{" "}
            What is MacQuest?
          </div>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showAboutModal && (
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center bg-[#050714]/78 px-4 py-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAboutModal(false)}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="macquest-about-title"
              className="glass-panel relative w-full max-w-3xl overflow-hidden"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                aria-label="Close MacQuest info modal"
                className="absolute top-4 right-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-lg text-white/55 transition-colors hover:text-white"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                ×
              </button>

              <div className="max-h-[85vh] overflow-y-auto px-6 py-7 md:px-10 md:py-9">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold tracking-[0.35em] text-white/42 uppercase">
                    For Parents
                  </p>
                  <h2
                    id="macquest-about-title"
                    className="mt-3 text-4xl font-bold tracking-tight md:text-5xl"
                    style={{
                      background:
                        "linear-gradient(135deg, #fce7f3 0%, #ddd6fe 30%, #bfdbfe 68%, #a7f3d0 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    What is MacQuest?
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-white/72 md:text-lg">
                    MacQuest is a playful typing adventure that turns a real
                    keyboard into a guided learning space. Kids see a big target
                    letter, find it on the keyboard, hear encouraging audio, and
                    get immediate feedback so practice feels more like a game
                    than a drill sheet.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <article className="rounded-[26px] border border-white/10 bg-white/6 px-5 py-5">
                    <p className="text-xs font-semibold tracking-[0.28em] text-cyan-200/62 uppercase">
                      Built From Research
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/68">
                      MacQuest started in PhD research around how young learners
                      build fluency without getting overloaded. That early work
                      pushed the design toward short feedback loops, tiny wins,
                      and steady confidence-building.
                    </p>
                  </article>

                  <article className="rounded-[26px] border border-white/10 bg-white/6 px-5 py-5">
                    <p className="text-xs font-semibold tracking-[0.28em] text-fuchsia-200/62 uppercase">
                      The Science In Plain English
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/68">
                      Kids learn faster when seeing, hearing, and doing line up
                      together. MacQuest pairs visual targets, physical key
                      presses, and spoken feedback so letter recognition, motor
                      memory, and attention reinforce each other in one loop.
                    </p>
                  </article>

                  <article className="rounded-[26px] border border-white/10 bg-white/6 px-5 py-5">
                    <p className="text-xs font-semibold tracking-[0.28em] text-emerald-200/62 uppercase">
                      Why The Progression Works
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/68">
                      The journey starts with F and J, the tactile anchor keys,
                      then expands outward in carefully sized steps. That lowers
                      cognitive load, keeps success frequent, and helps children
                      build automaticity before the keyboard feels overwhelming.
                    </p>
                  </article>
                </div>

                <div className="mt-6 rounded-[30px] border border-white/10 bg-white/5 px-6 py-5">
                  <p className="text-lg font-semibold text-white/84">
                    Under the hood, MacQuest is doing a few important things:
                  </p>
                  <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-white/68 md:grid-cols-2">
                    <li className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                      Immediate correction keeps mistakes low-stakes and useful.
                    </li>
                    <li className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                      Celebration and novelty help motivation stay high for
                      longer sessions.
                    </li>
                    <li className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                      Repetition with variation helps move letters and words
                      from effortful recall toward fluency.
                    </li>
                    <li className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                      The keyboard itself becomes part of the lesson, not just
                      the device underneath it.
                    </li>
                  </ul>
                </div>

                <p className="mt-6 text-base leading-relaxed text-white/72">
                  In other words: it looks like a bright little space mission,
                  but underneath it is a carefully structured learning tool
                  shaped by real research on feedback, motivation, and early
                  skill-building.
                </p>

                <div className="mt-7 flex justify-end">
                  <motion.button
                    type="button"
                    onClick={() => setShowAboutModal(false)}
                    className="relative cursor-pointer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div
                      className="absolute -inset-2 rounded-full opacity-45"
                      style={{
                        background: "linear-gradient(135deg, #34d399, #38bdf8, #8b5cf6)",
                        filter: "blur(14px)",
                      }}
                    />
                    <div
                      className="relative rounded-full px-6 py-3 text-base font-semibold text-white"
                      style={{
                        background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                        boxShadow: "0 4px 24px rgba(59, 130, 246, 0.28), inset 0 1px 0 rgba(255,255,255,0.14)",
                      }}
                    >
                      Back to the cockpit
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

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
