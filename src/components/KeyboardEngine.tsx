"use client";

import {
  useReducer,
  useCallback,
  useRef,
  useState,
  useEffect,
  useSyncExternalStore,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gameReducer, getInitialState, LEVEL_NAMES } from "@/lib/game-state";
import {
  saveProgress,
  loadProgress,
  clearProgress,
  SAVE_STATE_EVENT,
} from "@/lib/save-state";
import type { SaveState } from "@/lib/save-state";
import { useMacShield } from "@/hooks/useMacShield";
import { useGameKeyboard } from "@/hooks/useGameKeyboard";
import { useSpeech } from "@/hooks/useSpeech";
import { StarshipKeyboard } from "./StarshipKeyboard";
import { ParticleExplosion } from "./ParticleExplosion";
import { WelcomeScreen } from "./WelcomeScreen";
import { SpaceBackground } from "./SpaceBackground";
import { generatePhrase } from "@/app/actions/generate-phrase";
import { getRandomWrongPhrase } from "@/lib/phrases";
import {
  getRandomSpellingPositive,
  getSpellingWrongAudio,
  getLetterAudio,
  getSpellWordAudio,
  getWordAudio,
} from "@/lib/spelling-audio";

function subscribeToSavedGame(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === "macquest-save" || event.key === null) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(SAVE_STATE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SAVE_STATE_EVENT, onStoreChange);
  };
}

export function KeyboardEngine() {
  const [state, dispatch] = useReducer(gameReducer, undefined, getInitialState);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [explosionId, setExplosionId] = useState(0);
  const savedGame = useSyncExternalStore<SaveState | null>(
    subscribeToSavedGame,
    loadProgress,
    () => null
  );
  const celebrationTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrongTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { speak, speakSequence, stopCurrent } = useSpeech();
  const lastSpellingWord = useRef<string>("");

  useMacShield();

  // Save progress on level-complete and next-level
  const { phase, mode, currentLevel, currentLetterIndex, score, perfectLevels, wrongCountThisLevel, spellingWordIndex } = state;
  useEffect(() => {
    if (phase === "victory") {
      clearProgress();
    } else if (phase === "level-complete" || phase === "playing") {
      if (score > 0 || currentLevel > 0 || currentLetterIndex > 0 || spellingWordIndex > 0) {
        saveProgress({ currentLevel, currentLetterIndex, score, perfectLevels, wrongCountThisLevel, mode, spellingWordIndex });
      }
    }
  }, [phase, mode, currentLevel, currentLetterIndex, score, perfectLevels, wrongCountThisLevel, spellingWordIndex]);

  // Play "Spell the word {word}" when a new spelling word begins
  useEffect(() => {
    if (mode === "spelling" && phase === "playing" && state.currentWord && state.currentWord !== lastSpellingWord.current) {
      lastSpellingWord.current = state.currentWord;
      // Small delay so the UI renders first
      const timer = setTimeout(() => {
        speak("", getSpellWordAudio(state.currentWord));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [mode, phase, state.currentWord, speak]);

  const handleCorrect = useCallback(() => {
    setPressedKey(state.targetLetter);
    setExplosionId((prev) => prev + 1);
    dispatch({ type: "CORRECT_KEY" });

    const isSpelling = state.mode === "spelling";
    const isLastLetter = state.currentLetterIndex === state.letters.length - 1;

    if (isSpelling) {
      if (isLastLetter) {
        // Word complete: say the word → positive affirmation
        const positive = getRandomSpellingPositive();
        const wordAudio = getWordAudio(state.currentWord);
        speakSequence([wordAudio, positive.audioFile]);
        dispatch({ type: "SET_CELEBRATION_MESSAGE", message: `${state.currentWord.toUpperCase()}!` });
        celebrationTimer.current = setTimeout(() => {
          setPressedKey(null);
          dispatch({ type: "FINISH_CELEBRATION" });
        }, 3500);
      } else {
        // Individual letter: say the letter name
        speak("", getLetterAudio(state.targetLetter));
        celebrationTimer.current = setTimeout(() => {
          setPressedKey(null);
          dispatch({ type: "FINISH_CELEBRATION" });
        }, 1200);
      }
    } else {
      // Keys mode: AI-generated phrase
      generatePhrase().then((result) => {
        dispatch({ type: "SET_CELEBRATION_MESSAGE", message: result.text });
        speak(result.text, result.audioFile);
      });
      celebrationTimer.current = setTimeout(() => {
        setPressedKey(null);
        dispatch({ type: "FINISH_CELEBRATION" });
      }, 2500);
    }
  }, [state.targetLetter, state.mode, state.currentLetterIndex, state.letters.length, state.currentWord, speak, speakSequence]);

  const handleWrong = useCallback(() => {
    if (wrongTimer.current) clearTimeout(wrongTimer.current);

    if (state.mode === "spelling") {
      dispatch({ type: "WRONG_KEY", message: "Try Again!" });
      speak("Try Again!", getSpellingWrongAudio());
    } else {
      const result = getRandomWrongPhrase();
      dispatch({ type: "WRONG_KEY", message: result.text });
      speak(result.text, result.audioFile);
    }
    wrongTimer.current = setTimeout(() => dispatch({ type: "CLEAR_WRONG" }), 2500);
  }, [speak, state.mode]);

  useGameKeyboard({
    targetLetter: state.targetLetter,
    enabled: state.phase === "playing",
    onCorrect: handleCorrect,
    onWrong: handleWrong,
  });

  const handleStart = useCallback(() => {
    clearProgress();
    dispatch({ type: "START_GAME" });
  }, []);

  const handleResume = useCallback(() => {
    if (savedGame) {
      dispatch({ type: "RESUME_GAME", save: savedGame });
    }
  }, [savedGame]);

  const handleNextLevel = useCallback(() => {
    dispatch({ type: "NEXT_LEVEL" });
  }, []);

  const handleStartSpelling = useCallback(() => {
    dispatch({ type: "START_SPELLING" });
  }, []);

  const handleNextWord = useCallback(() => {
    dispatch({ type: "NEXT_WORD" });
  }, []);

  const handleReturnHome = useCallback(() => {
    stopCurrent();
    if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
    if (wrongTimer.current) clearTimeout(wrongTimer.current);
    lastSpellingWord.current = "";
    dispatch({ type: "RETURN_HOME" });
  }, [stopCurrent]);

  const progress =
    state.totalLetters > 0
      ? (state.currentLetterIndex / state.totalLetters) * 100
      : 0;

  if (state.phase === "welcome") {
    return (
      <>
        <SpaceBackground />
        <WelcomeScreen
          onStart={handleStart}
          onStartSpelling={handleStartSpelling}
          onResume={savedGame ? handleResume : undefined}
          savedLevel={savedGame ? savedGame.currentLevel + 1 : undefined}
          savedScore={savedGame?.score}
        />
      </>
    );
  }

  if (state.phase === "victory") {
    const isSpellingVictory = state.mode === "spelling";

    return (
      <>
        <SpaceBackground />
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 relative z-10">
          {/* Home button */}
          <motion.button
            onClick={handleReturnHome}
            className="absolute top-4 left-4 cursor-pointer z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white/40 hover:text-white/70 transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            <span className="text-base">🏠</span>
            <span>Home</span>
          </motion.button>

          <motion.div
            className="text-8xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            {isSpellingVictory ? "🎓" : "🏆"}
          </motion.div>

          <motion.div
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
              {isSpellingVictory ? "Spelling Champion!" : "You Won!"}
            </h2>
            <p className="text-xl text-white/50 font-medium">
              {isSpellingVictory
                ? "You spelled all 100 words!"
                : "You mastered the entire keyboard!"}
            </p>
          </motion.div>

          <motion.div
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
                {state.score.toLocaleString()}
              </span>
            </div>
            {state.perfectLevels.length > 0 && (
              <p className="text-sm text-white/40 mt-3">
                {state.perfectLevels.length} perfect {state.mode === "spelling" ? "word" : "level"}{state.perfectLevels.length !== 1 ? "s" : ""}!
              </p>
            )}
          </motion.div>

          {/* Keys victory: show both "Start Spelling" and "Play Again" */}
          {!isSpellingVictory && (
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-lg text-white/40 font-medium">
                Ready to start spelling words?
              </p>
              <motion.button
                onClick={handleStartSpelling}
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
              </motion.button>
            </motion.div>
          )}

          <motion.button
            onClick={handleStart}
            className="relative group cursor-pointer"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: isSpellingVictory ? 0.8 : 1.0 }}
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
                background: isSpellingVictory
                  ? "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)"
                  : "rgba(255,255,255,0.1)",
                boxShadow: isSpellingVictory
                  ? "0 4px 24px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.15)"
                  : "inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              Play Again
            </div>
          </motion.button>
        </div>
      </>
    );
  }

  if (state.phase === "level-complete") {
    const isPerfect = state.bonusAwarded > 0;
    const isSpelling = state.mode === "spelling";

    return (
      <>
        <SpaceBackground />
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 relative z-10">
          {/* Home button */}
          <motion.button
            onClick={handleReturnHome}
            className="absolute top-4 left-4 cursor-pointer z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white/40 hover:text-white/70 transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            <span className="text-base">🏠</span>
            <span>Home</span>
          </motion.button>

          {/* Celebration emoji */}
          <motion.div
            className="text-8xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            {isPerfect ? "🌟" : "🎉"}
          </motion.div>

          <motion.div
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
                ? `You spelled "${state.currentWord.toUpperCase()}"!`
                : `You typed ${state.letters.length} letters!`}
            </p>
          </motion.div>

          {/* Score summary */}
          <motion.div
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
                {state.score.toLocaleString()}
              </span>
            </div>
            {isPerfect && (
              <motion.p
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
                PERFECT! Bonus: +{state.bonusAwarded.toLocaleString()}
              </motion.p>
            )}
          </motion.div>

          <motion.button
            onClick={isSpelling ? handleNextWord : handleNextLevel}
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
          </motion.button>
        </div>
      </>
    );
  }

  // Spelling mode: word display above the target letter
  const wordDisplay = state.mode === "spelling" && state.currentWord ? (
    <motion.div
      className="glass-panel px-8 py-4"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center justify-center gap-2 md:gap-3">
        {state.currentWord.toUpperCase().split("").map((letter, i) => (
          <span
            key={i}
            className="text-5xl md:text-7xl font-bold transition-all duration-200"
            style={{
              color:
                i < state.currentLetterIndex
                  ? "rgba(52, 211, 153, 0.6)" // completed — green
                  : i === state.currentLetterIndex
                    ? undefined // current — gradient below
                    : "rgba(255, 255, 255, 0.2)", // upcoming — dim
              ...(i === state.currentLetterIndex
                ? {
                    background: "linear-gradient(135deg, #fce7f3, #e9d5ff, #c7d2fe)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 16px rgba(139, 92, 246, 0.6))",
                  }
                : {}),
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </motion.div>
  ) : null;

  return (
    <>
      <SpaceBackground />
      <div className="relative flex flex-col items-center min-h-screen gap-4 px-4 pt-4 pb-4 z-10">
        {/* Home button — top-left corner */}
        <motion.button
          onClick={handleReturnHome}
          className="absolute top-4 left-4 cursor-pointer z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white/40 hover:text-white/70 transition-colors"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-base">🏠</span>
          <span>Home</span>
        </motion.button>

        {/* Header bar — pinned near top */}
        <div className="w-full max-w-2xl">
          <div className="glass-panel px-5 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{state.mode === "spelling" ? "📝" : "🚀"}</span>
                <span className="text-sm font-medium text-white/50">
                  {state.mode === "spelling"
                    ? `Word ${state.spellingWordIndex + 1}`
                    : `Level ${state.currentLevel + 1}`}
                </span>
                <span className="text-xs text-white/25 font-medium">
                  · {state.mode === "spelling"
                    ? state.currentWord.toUpperCase()
                    : (LEVEL_NAMES[state.currentLevel] ?? "Challenge")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Score */}
                <div className="flex items-center gap-1">
                  <span className="text-sm">⭐</span>
                  <span className="text-sm font-bold text-amber-300/80">
                    {state.score.toLocaleString()}
                  </span>
                </div>
                {/* Progress counter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white/70">
                    {state.currentLetterIndex}
                  </span>
                  <span className="text-xs text-white/30">/</span>
                  <span className="text-sm text-white/40">
                    {state.totalLetters}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #34d399)",
                  backgroundSize: "200% 100%",
                  boxShadow: "0 0 12px rgba(139, 92, 246, 0.4)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              {/* Shimmer overlay */}
              <div
                className="absolute inset-0 rounded-full opacity-30"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 3s linear infinite",
                }}
              />
            </div>
          </div>
        </div>

        {/* Flexible spacer to center content vertically */}
        <div className="flex-1" />

        {/* Word display for spelling mode */}
        {wordDisplay}

        {/* Target letter display */}
        <div className="relative flex items-center justify-center" style={{ minHeight: 200 }}>
          <motion.div
            key={state.targetLetter + state.currentLetterIndex}
            className="letter-halo"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={
              state.wrongKey
                ? { scale: 1, opacity: 1, x: [0, -12, 12, -12, 12, 0] }
                : { scale: 1, opacity: 1, x: 0 }
            }
            transition={
              state.wrongKey
                ? { duration: 0.4, ease: "easeInOut" }
                : { type: "spring", stiffness: 250, damping: 15 }
            }
          >
            <div
              className="text-[140px] md:text-[180px] font-bold leading-none select-none text-center"
              style={{
                background: "linear-gradient(135deg, #fce7f3 0%, #e9d5ff 30%, #c7d2fe 50%, #bae6fd 75%, #d1fae5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 30px rgba(139, 92, 246, 0.5)) drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
              }}
            >
              {state.targetLetter}
            </div>
          </motion.div>

          <ParticleExplosion
            active={state.phase === "celebrating"}
            id={explosionId}
          />
        </div>

        {/* Message area */}
        <div style={{ minHeight: 48 }} className="relative flex items-center justify-center">
          {/* Celebration message */}
          <AnimatePresence>
            {state.phase === "celebrating" && state.celebrationMessage && (
              <motion.div
                key="celebration"
                className="glass-panel px-6 py-3 absolute"
                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -15, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <p
                  className="text-xl md:text-2xl font-semibold text-center whitespace-nowrap"
                  style={{
                    background: "linear-gradient(135deg, #fbbf24, #f97316, #ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {state.celebrationMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wrong-key message */}
          <AnimatePresence>
            {state.wrongKey && state.wrongKeyMessage && (
              <motion.div
                key="wrong"
                className="glass-panel px-6 py-3 absolute"
                style={{ borderColor: "rgba(251, 146, 60, 0.25)" }}
                initial={{ y: 10, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-lg md:text-xl font-semibold text-center text-orange-300/90 whitespace-nowrap">
                  {state.wrongKeyMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint text (only when playing and no other message) */}
          {state.phase === "playing" && !state.wrongKey && !state.celebrationMessage && (
            <p className={`font-medium text-center ${state.mode === "spelling" ? "text-lg md:text-xl text-white/35" : "text-base text-white/30"}`}>
              {state.mode === "spelling" ? (
                <>
                  Spell:{" "}
                  <span
                    className="font-bold text-xl md:text-2xl"
                    style={{
                      background: "linear-gradient(135deg, #fbbf24, #f97316)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {state.currentWord.toUpperCase()}
                  </span>
                  {" — Press the "}
                </>
              ) : (
                <>Press the{" "}</>
              )}
              <span
                className="font-bold"
                style={{
                  background: "linear-gradient(135deg, #c084fc, #60a5fa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {state.targetLetter}
              </span>{" "}
              key!
            </p>
          )}
        </div>

        {/* Flexible spacer to push keyboard down */}
        <div className="flex-1" />

        {/* Keyboard — pinned near bottom */}
        <StarshipKeyboard
          targetLetter={state.targetLetter}
          pressedKey={state.phase === "celebrating" ? pressedKey : null}
        />
      </div>
    </>
  );
}
