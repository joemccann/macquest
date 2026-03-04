"use client";

import { useCallback, useRef } from "react";

/**
 * Plays pre-recorded ElevenLabs MP3 files for phrases.
 * Falls back to Web Speech API for dynamically generated phrases.
 */
export function useSpeech() {
  const currentAudio = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback((text: string, audioFile?: string) => {
    if (typeof window === "undefined") return;

    // Stop any currently playing audio
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current = null;
    }

    // If we have a pre-recorded file, use it (instant, high quality)
    if (audioFile) {
      const audio = new Audio(audioFile);
      audio.volume = 1;
      currentAudio.current = audio;
      audio.play().catch(() => {
        // If audio fails, fall back to speech synthesis
        speakWithSynthesis(text);
      });
      return;
    }

    // Fallback: Web Speech API for AI-generated phrases
    speakWithSynthesis(text);
  }, []);

  return { speak };
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
