/**
 * Audio path helpers for spelling mode.
 *
 * Directory layout (under public/audio/):
 *   spelling-positive/00..29.mp3 — excited affirmations for word completion
 *   spelling-wrong/try-again.mp3 — single "Try Again" clip
 *   letters/{key}.mp3             — every key spoken (a, b, ..., comma, period, etc.)
 *   spell-word/{word}.mp3         — "Spell the word {word}" prompts
 *   words/{word}.mp3              — word spoken alone for word-complete
 */

const SPELLING_POSITIVE_COUNT = 30;

function safeFilename(str: string): string {
  const mapped: Record<string, string> = {
    ",": "comma",
    ".": "period",
    "/": "forward-slash",
    ";": "semicolon",
  };
  if (mapped[str]) return mapped[str];
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Public API ──────────────────────────────────────────────

/** Random positive affirmation for spelling a word correctly */
const spellingPositiveHistory: number[] = [];

export function getRandomSpellingPositive(): { text: string; audioFile: string } {
  const maxHistory = 10;
  const available = Array.from({ length: SPELLING_POSITIVE_COUNT }, (_, i) => i)
    .filter((i) => !spellingPositiveHistory.includes(i));
  const pool = available.length > 0 ? available : Array.from({ length: SPELLING_POSITIVE_COUNT }, (_, i) => i);
  const idx = pool[Math.floor(Math.random() * pool.length)];
  spellingPositiveHistory.push(idx);
  if (spellingPositiveHistory.length > maxHistory) spellingPositiveHistory.shift();
  return {
    text: "",  // No text needed — audio-only
    audioFile: `/audio/spelling-positive/${String(idx).padStart(2, "0")}.mp3`,
  };
}

/** "Try Again" for wrong key in spelling mode */
export function getSpellingWrongAudio(): string {
  return "/audio/spelling-wrong/try-again.mp3";
}

/** Audio clip of a single letter being spoken (e.g. "C") */
export function getLetterAudio(letter: string): string {
  return `/audio/letters/${safeFilename(letter)}.mp3`;
}

/** "Spell the word {word}" prompt */
export function getSpellWordAudio(word: string): string {
  return `/audio/spell-word/${safeFilename(word)}.mp3`;
}

/** Word spoken alone (for word-complete celebration) */
export function getWordAudio(word: string): string {
  return `/audio/words/${safeFilename(word)}.mp3`;
}
