import { describe, it, expect } from "vitest";
import {
  SPELLING_WORDS,
  SPELLING_TIERS,
  getSpellingWord,
  WORDS_PER_ROUND,
} from "@/lib/words";

describe("SPELLING_TIERS", () => {
  it("has exactly 5 tiers", () => {
    expect(SPELLING_TIERS).toHaveLength(5);
  });

  it("each tier has exactly 20 words", () => {
    for (const tier of SPELLING_TIERS) {
      expect(tier.words).toHaveLength(20);
    }
  });

  it("each tier has a name", () => {
    for (const tier of SPELLING_TIERS) {
      expect(tier.name.length).toBeGreaterThan(0);
    }
  });
});

describe("SPELLING_WORDS", () => {
  it("has exactly 100 words", () => {
    expect(SPELLING_WORDS).toHaveLength(100);
  });

  it("all words are lowercase", () => {
    for (const word of SPELLING_WORDS) {
      expect(word).toBe(word.toLowerCase());
    }
  });

  it("all words are between 2 and 6 letters", () => {
    for (const word of SPELLING_WORDS) {
      expect(word.length).toBeGreaterThanOrEqual(2);
      expect(word.length).toBeLessThanOrEqual(6);
    }
  });

  it("all words contain only letters", () => {
    for (const word of SPELLING_WORDS) {
      expect(word).toMatch(/^[a-z]+$/);
    }
  });

  it("has no duplicate words", () => {
    const unique = new Set(SPELLING_WORDS);
    expect(unique.size).toBe(SPELLING_WORDS.length);
  });
});

describe("getSpellingWord", () => {
  it("returns the word at the given index", () => {
    expect(getSpellingWord(0)).toBe(SPELLING_WORDS[0]);
    expect(getSpellingWord(5)).toBe(SPELLING_WORDS[5]);
    expect(getSpellingWord(99)).toBe(SPELLING_WORDS[99]);
  });

  it("wraps around when index exceeds array length", () => {
    expect(getSpellingWord(100)).toBe(SPELLING_WORDS[0]);
    expect(getSpellingWord(101)).toBe(SPELLING_WORDS[1]);
    expect(getSpellingWord(200)).toBe(SPELLING_WORDS[0]);
  });
});

describe("WORDS_PER_ROUND", () => {
  it("is 5", () => {
    expect(WORDS_PER_ROUND).toBe(5);
  });
});
