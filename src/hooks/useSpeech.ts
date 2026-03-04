"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Picks the best available macOS voice for a kid-friendly experience.
 * Priority: Enhanced/Premium variants > Samantha > Zoe > Karen > any en-US female
 */
function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const english = voices.filter((v) => v.lang.startsWith("en"));

  // Prefer Enhanced or Premium voices first (Apple's neural voices)
  const enhanced = english.find(
    (v) =>
      v.name.includes("Enhanced") ||
      v.name.includes("Premium") ||
      v.name.includes("Siri")
  );
  if (enhanced) return enhanced;

  // Named preferences in order
  const preferred = ["Samantha", "Zoe", "Karen", "Fiona", "Moira"];
  for (const name of preferred) {
    const match = english.find((v) => v.name.includes(name));
    if (match) return match;
  }

  // Any English voice
  return english[0] ?? voices[0] ?? null;
}

export function useSpeech() {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Listen for voices to load (they're async in most browsers)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const synth = window.speechSynthesis;
    synthRef.current = synth;

    function loadVoices() {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        voiceRef.current = pickBestVoice(voices);
      }
    }

    // Try immediately (may work in Safari)
    loadVoices();

    // Also listen for the async event (needed in Chrome)
    synth.addEventListener("voiceschanged", loadVoices);
    return () => synth.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const speak = useCallback((text: string) => {
    const synth = synthRef.current;
    if (!synth) return;

    // Cancel any ongoing speech to avoid the 15s bug
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.volume = 1;

    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
    }

    synth.speak(utterance);
  }, []);

  return { speak };
}
