"use server";

import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const POSITIVE_PHRASES = [
  "Amazing job, space explorer!",
  "You're a typing superstar!",
  "Wow, your fingers are so fast!",
  "That was out of this world!",
  "You're zooming through the galaxy!",
  "Super duper typing powers!",
  "Your fingers are doing a happy dance!",
  "You're a keyboard wizard!",
  "Blast off! Perfect typing!",
  "The stars are cheering for you!",
  "You make typing look so easy!",
  "Keep going, little astronaut!",
  "Galactic genius right here!",
  "Your rocket is flying higher!",
  "What a cosmic champion!",
  "You nailed it, space cadet!",
  "Lightning fast fingers!",
  "The whole universe is proud!",
  "You're on fire like a shooting star!",
  "Woohoo, captain awesome!",
  "That key didn't stand a chance!",
  "Way to go, rocket ranger!",
  "Your typing is pure magic!",
  "Mission accomplished, explorer!",
  "Incredible typing powers activated!",
  "You just leveled up your awesomeness!",
  "The planets are lining up for you!",
  "Hyperdrive typing speed!",
  "You're a constellation of talent!",
  "That was stellar, truly stellar!",
  "Moonwalk-worthy keypress!",
  "You've got the golden touch!",
  "Nebula-powered fingers!",
  "Every star just winked at you!",
  "You're typing like a comet!",
  "Space high-five!",
  "Your keyboard loves you!",
];

export interface PhraseResult {
  text: string;
  audioFile?: string;
}

const positiveHistory: number[] = [];

function pickRandom(phrases: string[], history: number[]): { text: string; index: number } {
  const maxHistory = Math.min(Math.floor(phrases.length / 2), 12);
  const available = phrases
    .map((_, i) => i)
    .filter((i) => !history.includes(i));

  const pool = available.length > 0 ? available : phrases.map((_, i) => i);
  const idx = pool[Math.floor(Math.random() * pool.length)];

  history.push(idx);
  if (history.length > maxHistory) history.shift();

  return { text: phrases[idx], index: idx };
}

export async function generatePhrase(): Promise<PhraseResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    const { text } = await generateText({
      model: anthropic("claude-haiku-4-5-20251001"),
      prompt:
        "Generate ONE short, encouraging phrase (under 10 words) for a 5-year-old who just typed a letter correctly. Space/adventure themed. Fun vocabulary. No quotes. Just the phrase.",
      maxOutputTokens: 30,
      abortSignal: controller.signal,
    });

    clearTimeout(timeout);
    const trimmed = text.trim();
    if (trimmed) {
      // AI-generated phrase — no pre-recorded audio
      return { text: trimmed };
    }

    const result = pickRandom(POSITIVE_PHRASES, positiveHistory);
    return {
      text: result.text,
      audioFile: `/audio/positive/${String(result.index).padStart(2, "0")}.mp3`,
    };
  } catch {
    const result = pickRandom(POSITIVE_PHRASES, positiveHistory);
    return {
      text: result.text,
      audioFile: `/audio/positive/${String(result.index).padStart(2, "0")}.mp3`,
    };
  }
}
