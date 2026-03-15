"use client";

import {
  useReducer,
  useCallback,
  useRef,
  useState,
  useEffect,
  useSyncExternalStore,
  lazy,
  Suspense,
} from "react";

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
const StarshipKeyboard = lazy(() =>
  import("./StarshipKeyboard").then((m) => ({ default: m.StarshipKeyboard }))
);
const ParticleExplosion = lazy(() =>
  import("./ParticleExplosion").then((m) => ({ default: m.ParticleExplosion }))
);
import { WelcomeScreen } from "./WelcomeScreen";
import { SpaceBackground } from "./SpaceBackground";
import { AudioToggle } from "./AudioToggle";
import { generatePhrase } from "@/app/actions/generate-phrase";
import { getRandomWrongPhrase } from "@/lib/phrases";
import {
  getRandomSpellingPositive,
  getSpellingWrongAudio,
  getLetterAudio,
  getSpellWordAudio,
  getWordAudio,
} from "@/lib/spelling-audio";
import {
  loadMutedPreference,
  saveMutedPreference,
  subscribeToMutedPreference,
} from "@/lib/audio-preference";

const VictoryScreen = lazy(() =>
  import("./VictoryScreen").then((m) => ({ default: m.VictoryScreen }))
);
const LevelCompleteScreen = lazy(() =>
  import("./LevelCompleteScreen").then((m) => ({ default: m.LevelCompleteScreen }))
);

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
  const muted = useSyncExternalStore(
    subscribeToMutedPreference,
    loadMutedPreference,
    () => false
  );
  const celebrationTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrongTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { speak, speakSequence, stopCurrent } = useSpeech({ muted });
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

  const handleToggleAudio = useCallback(() => {
    saveMutedPreference(!muted);
  }, [muted]);

  const progress =
    state.totalLetters > 0
      ? (state.currentLetterIndex / state.totalLetters) * 100
      : 0;

  if (state.phase === "welcome") {
    return (
      <>
        <SpaceBackground />
        <div className="relative min-h-screen">
          <AudioToggle
            muted={muted}
            onToggle={handleToggleAudio}
            className="absolute top-4 right-4 z-20"
          />
          <WelcomeScreen
            onStart={handleStart}
            onStartSpelling={handleStartSpelling}
            onResume={savedGame ? handleResume : undefined}
            savedLevel={savedGame ? savedGame.currentLevel + 1 : undefined}
            savedScore={savedGame?.score}
          />
        </div>
      </>
    );
  }

  if (state.phase === "victory") {
    return (
      <>
        <SpaceBackground />
        <Suspense fallback={null}>
          <VictoryScreen
            isSpelling={state.mode === "spelling"}
            score={state.score}
            perfectLevels={state.perfectLevels}
            mode={state.mode}
            muted={muted}
            onToggleAudio={handleToggleAudio}
            onReturnHome={handleReturnHome}
            onStartSpelling={handleStartSpelling}
            onStart={handleStart}
          />
        </Suspense>
      </>
    );
  }

  if (state.phase === "level-complete") {
    return (
      <>
        <SpaceBackground />
        <Suspense fallback={null}>
          <LevelCompleteScreen
            isSpelling={state.mode === "spelling"}
            isPerfect={state.bonusAwarded > 0}
            score={state.score}
            bonusAwarded={state.bonusAwarded}
            currentWord={state.currentWord}
            lettersLength={state.letters.length}
            muted={muted}
            onToggleAudio={handleToggleAudio}
            onReturnHome={handleReturnHome}
            onNext={state.mode === "spelling" ? handleNextWord : handleNextLevel}
          />
        </Suspense>
      </>
    );
  }

  // Spelling mode: word display above the target letter
  const wordDisplay = state.mode === "spelling" && state.currentWord ? (
    <div className="glass-panel px-8 py-4 animate-word-in">
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
    </div>
  ) : null;

  return (
    <>
      <SpaceBackground />
      <div className="relative flex flex-col items-center min-h-screen gap-4 px-4 pt-4 pb-4 z-10">
        {/* Home button — top-left corner */}
        <button
          onClick={handleReturnHome}
          className="absolute top-4 left-4 cursor-pointer z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white/40 hover:text-white/70 transition-all hover:scale-[1.06] active:scale-[0.94] animate-home-btn"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="text-base">🏠</span>
          <span>Home</span>
        </button>
        <AudioToggle
          muted={muted}
          onToggle={handleToggleAudio}
          className="absolute top-4 right-4 z-20"
        />

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
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #34d399)",
                  backgroundSize: "200% 100%",
                  boxShadow: "0 0 12px rgba(139, 92, 246, 0.4)",
                }}
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
          <div
            key={state.targetLetter + state.currentLetterIndex}
            className={`letter-halo ${state.wrongKey ? "animate-letter-shake" : "animate-letter-in"}`}
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
          </div>

          <Suspense fallback={null}>
            <ParticleExplosion
              active={state.phase === "celebrating"}
              id={explosionId}
            />
          </Suspense>
        </div>

        {/* Message area */}
        <div style={{ minHeight: 48 }} className="relative flex items-center justify-center">
          {/* Celebration message */}
          {state.phase === "celebrating" && state.celebrationMessage && (
            <div
              key="celebration"
              className="glass-panel px-6 py-3 absolute animate-msg-in"
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
            </div>
          )}

          {/* Wrong-key message */}
          {state.wrongKey && state.wrongKeyMessage && (
            <div
              key="wrong"
              className="glass-panel px-6 py-3 absolute animate-msg-wrong-in"
              style={{ borderColor: "rgba(251, 146, 60, 0.25)" }}
            >
              <p className="text-lg md:text-xl font-semibold text-center text-orange-300/90 whitespace-nowrap">
                {state.wrongKeyMessage}
              </p>
            </div>
          )}

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
        <Suspense fallback={null}>
          <StarshipKeyboard
            targetLetter={state.targetLetter}
            pressedKey={state.phase === "celebrating" ? pressedKey : null}
          />
        </Suspense>
      </div>
    </>
  );
}
