"use client";

import { useCallback, useRef } from "react";

/**
 * Plays pre-recorded ElevenLabs MP3 files for phrases.
 * Falls back to Web Speech API for dynamically generated phrases.
 *
 * `speak()` — play a single clip (or TTS fallback)
 * `speakSequence()` — play multiple clips back-to-back
 */
export function useSpeech() {
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

  const speak = useCallback((text: string, audioFile?: string) => {
    if (typeof window === "undefined") return;

    stopCurrent();

    // If we have a pre-recorded file, use it (instant, high quality)
    if (audioFile) {
      playFile(audioFile).catch(() => {
        // If audio fails, fall back to speech synthesis
        speakWithSynthesis(text);
      });
      return;
    }

    // Fallback: Web Speech API for AI-generated phrases
    speakWithSynthesis(text);
  }, [stopCurrent, playFile]);

  /** Play multiple audio files in sequence (stops if a new speak/sequence call occurs) */
  const speakSequence = useCallback((audioFiles: string[]) => {
    if (typeof window === "undefined") return;

    stopCurrent();

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
  }, [stopCurrent, playFile]);

  return { speak, speakSequence, stopCurrent };
}

function speakWithSynthesis(text: string) {
  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.2;
  utterance.volume = 1;

  const voices = synth.getVoices();
  const english = voices.filter((v) => v.lang.startsWith("en"));
  const preferred = english.find(
    (v) =>
      v.name.includes("Enhanced") ||
      v.name.includes("Premium") ||
      v.name.includes("Samantha")
  );
  if (preferred) utterance.voice = preferred;

  synth.speak(utterance);
}
