"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Plays pre-recorded ElevenLabs MP3 files.
 *
 * `speak()` — play a single clip
 * `speakSequence()` — play multiple clips back-to-back
 */
interface UseSpeechOptions {
  muted?: boolean;
}

export function useSpeech({ muted = false }: UseSpeechOptions = {}) {
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const sequenceAbort = useRef<AbortController | null>(null);

  const stopCurrent = useCallback(() => {
    if (sequenceAbort.current) {
      sequenceAbort.current.abort();
      sequenceAbort.current = null;
    }
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current = null;
    }
  }, []);

  const playFile = useCallback((audioFile: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioFile);
      audio.volume = 1;
      currentAudio.current = audio;
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error(`Failed to play ${audioFile}`));
      audio.play().catch(reject);
    });
  }, []);

  const speak = useCallback((_text: string, audioFile?: string) => {
    if (typeof window === "undefined") return;

    stopCurrent();
    if (muted) return;

    if (audioFile) {
      playFile(audioFile).catch(() => {
        // Silently ignore playback failures
      });
    }
  }, [muted, stopCurrent, playFile]);

  /** Play multiple audio files in sequence (stops if a new speak/sequence call occurs) */
  const speakSequence = useCallback((audioFiles: string[]) => {
    if (typeof window === "undefined") return;

    stopCurrent();
    if (muted) return;

    const controller = new AbortController();
    sequenceAbort.current = controller;

    (async () => {
      for (const file of audioFiles) {
        if (controller.signal.aborted) return;
        try {
          await playFile(file);
        } catch {
          // Skip failed clips, continue sequence
        }
      }
    })();
  }, [muted, stopCurrent, playFile]);

  useEffect(() => {
    if (muted) {
      stopCurrent();
    }
  }, [muted, stopCurrent]);

  return { speak, speakSequence, stopCurrent };
}
