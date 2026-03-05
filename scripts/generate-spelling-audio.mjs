#!/usr/bin/env node

/**
 * Generate all spelling-mode audio files using ElevenLabs TTS API.
 *
 * Categories:
 *   1. spelling-positive/ — Excited affirmations for completing a word
 *   2. spelling-wrong/    — Single "Try Again" clip
 *   3. letters/           — Every keyboard letter spoken (A-Z, 0-9, special chars)
 *   4. spell-word/        — "Spell the word {word}" for all 100 words
 *   5. words/             — Each of the 100 words spoken alone
 *
 * Usage: ELEVEN_LABS_API_KEY=sk_... node scripts/generate-spelling-audio.mjs
 */

import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const API_KEY = process.env.ELEVEN_LABS_API_KEY;
if (!API_KEY) {
  console.error("Missing ELEVEN_LABS_API_KEY env var");
  process.exit(1);
}

// Jessica - Playful, Bright, Warm
const VOICE_ID = "cgSgspJ2msm6clMCkdW9";
const MODEL_ID = "eleven_turbo_v2_5";

// More excited voice settings for spelling celebrations
const EXCITED_SETTINGS = {
  stability: 0.3,
  similarity_boost: 0.6,
  style: 0.7,
  use_speaker_boost: true,
};

// Calm, clear voice for letters and word prompts
const CLEAR_SETTINGS = {
  stability: 0.7,
  similarity_boost: 0.8,
  style: 0.3,
  use_speaker_boost: true,
};

// ── Data ──────────────────────────────────────────────────────

const SPELLING_POSITIVE = [
  "You spelled it! Amazing!",
  "Perfect spelling, superstar!",
  "WOW! You are a spelling wizard!",
  "Incredible! You nailed that word!",
  "That was AWESOME spelling!",
  "Spelling champion right here!",
  "You did it! What a rockstar!",
  "Fantastic spelling, little genius!",
  "Out of this world spelling!",
  "Boom! Perfectly spelled!",
  "Your spelling is MAGNIFICENT!",
  "Woohoo! Another word conquered!",
  "You are a word master!",
  "That spelling was pure MAGIC!",
  "Super spectacular spelling!",
  "The stars are spelling your name!",
  "Unstoppable spelling power!",
  "You make spelling look SO easy!",
  "What a brilliant speller you are!",
  "Galactic spelling genius!",
  "Every letter was PERFECT!",
  "You crushed that word!",
  "Spelling superpower activated!",
  "That word didn't stand a chance!",
  "Absolutely STELLAR spelling!",
  "You're on a spelling streak!",
  "Word WIZARD in the house!",
  "That was legendary spelling!",
  "The whole galaxy is cheering!",
  "Spell-tacular performance!",
];

// All 100 kindergarten spelling words (must match src/lib/words.ts exactly)
const SPELLING_WORDS = [
  // Tiny Words
  "cat", "dog", "sun", "hat", "red",
  "big", "run", "sit", "cup", "bed",
  "go", "up", "no", "me", "he",
  "we", "is", "it", "am", "an",
  // Simple Words
  "pig", "bug", "net", "box", "map",
  "hen", "pen", "van", "rug", "fan",
  "log", "pot", "pin", "bat", "fox",
  "hug", "zip", "jam", "hot", "wet",
  // Sight Words
  "the", "and", "see", "can", "you",
  "was", "are", "but", "not", "she",
  "his", "her", "did", "get", "new",
  "all", "had", "one", "our", "out",
  // Action Words
  "jump", "play", "fish", "duck", "look",
  "like", "make", "come", "find", "help",
  "good", "blue", "down", "away", "said",
  "they", "that", "this", "with", "have",
  // Big Words
  "black", "green", "white", "brown", "under",
  "funny", "little", "pretty", "yellow", "three",
  "where", "there", "please", "after", "sleep",
  "water", "happy", "house", "going", "about",
];

// Letters and special characters
const LETTER_MAP = {
  A: "A", B: "B", C: "C", D: "D", E: "E", F: "F", G: "G",
  H: "H", I: "I", J: "J", K: "K", L: "L", M: "M", N: "N",
  O: "O", P: "P", Q: "Q", R: "R", S: "S", T: "T", U: "U",
  V: "V", W: "W", X: "X", Y: "Y", Z: "Z",
  "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four",
  "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine",
  ",": "Comma", ".": "Period", "/": "Forward Slash", ";": "Semicolon",
};

// ── Audio generation ──────────────────────────────────────────

async function generateAudio(text, outputPath, voiceSettings) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: voiceSettings,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, buffer);
  return buffer.length;
}

async function generateBatch(items, dir, label, voiceSettings) {
  await mkdir(dir, { recursive: true });
  let totalChars = 0;
  let generated = 0;
  let skipped = 0;

  for (const { filename, text } of items) {
    const outputPath = path.join(dir, filename);

    if (existsSync(outputPath)) {
      skipped++;
      continue;
    }

    totalChars += text.length;
    const bytes = await generateAudio(text, outputPath, voiceSettings);
    generated++;
    console.log(`  ✅ [${label}/${filename}] "${text}" (${bytes} bytes)`);

    // Rate limiting
    await new Promise((r) => setTimeout(r, 400));
  }

  if (skipped > 0) console.log(`  ⏭ Skipped ${skipped} existing files`);
  console.log(`  📊 Generated ${generated} files (${totalChars} chars)`);
  return totalChars;
}

// ── File-name helpers ────────────────────────────────────────

function safeFilename(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  console.log("🎙️  Generating spelling-mode audio (Jessica voice, excited)\n");
  let totalChars = 0;

  // 1. Spelling positive affirmations
  console.log("📁 Spelling positive affirmations:");
  totalChars += await generateBatch(
    SPELLING_POSITIVE.map((text, i) => ({
      filename: `${String(i).padStart(2, "0")}.mp3`,
      text,
    })),
    "public/audio/spelling-positive",
    "spelling-positive",
    EXCITED_SETTINGS
  );

  // 2. Spelling wrong — single "Try Again" clip
  console.log("\n📁 Spelling wrong:");
  totalChars += await generateBatch(
    [{ filename: "try-again.mp3", text: "Try Again!" }],
    "public/audio/spelling-wrong",
    "spelling-wrong",
    CLEAR_SETTINGS
  );

  // 3. Letters (A-Z, 0-9, special chars)
  console.log("\n📁 Letters:");
  totalChars += await generateBatch(
    Object.entries(LETTER_MAP).map(([key, spoken]) => ({
      filename: `${safeFilename(key) || safeFilename(spoken)}.mp3`,
      text: spoken,
    })),
    "public/audio/letters",
    "letters",
    CLEAR_SETTINGS
  );

  // 4. "Spell the word {word}" prompts
  console.log("\n📁 Spell-the-word prompts:");
  totalChars += await generateBatch(
    SPELLING_WORDS.map((word) => ({
      filename: `${safeFilename(word)}.mp3`,
      text: `Spell the word ${word}`,
    })),
    "public/audio/spell-word",
    "spell-word",
    CLEAR_SETTINGS
  );

  // 5. Words spoken alone (for word-complete celebration)
  console.log("\n📁 Words spoken alone:");
  totalChars += await generateBatch(
    SPELLING_WORDS.map((word) => ({
      filename: `${safeFilename(word)}.mp3`,
      text: word,
    })),
    "public/audio/words",
    "words",
    CLEAR_SETTINGS
  );

  console.log(`\n✨ Done! Used ~${totalChars} characters of API quota.`);
}

main().catch((err) => {
  console.error("❌ Fatal:", err.message);
  process.exit(1);
});
