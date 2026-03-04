"use client";

import { useEffect, useCallback } from "react";

interface UseGameKeyboardOptions {
  targetLetter: string;
  enabled: boolean;
  onCorrect: () => void;
  onWrong: () => void;
}

export function useGameKeyboard({
  targetLetter,
  enabled,
  onCorrect,
  onWrong,
}: UseGameKeyboardOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      if (e.repeat) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toUpperCase();

      // Only care about printable single characters
      if (key.length !== 1) return;

      e.preventDefault();

      if (key === targetLetter.toUpperCase()) {
        onCorrect();
      } else {
        onWrong();
      }
    },
    [targetLetter, enabled, onCorrect, onWrong]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
