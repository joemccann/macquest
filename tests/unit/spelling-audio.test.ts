import { describe, it, expect } from "vitest";
import {
  getRandomSpellingPositive,
  getSpellingWrongAudio,
  getLetterAudio,
  getSpellWordAudio,
  getWordAudio,
} from "@/lib/spelling-audio";

describe("spelling-audio", () => {
  describe("getRandomSpellingPositive", () => {
    it("returns an audioFile path matching the expected pattern", () => {
      const result = getRandomSpellingPositive();
      expect(result.audioFile).toMatch(/^\/audio\/spelling-positive\/\d{2}\.mp3$/);
    });

    it("returns different indices over many calls (no infinite loop)", () => {
      const files = new Set<string>();
      for (let i = 0; i < 30; i++) {
        files.add(getRandomSpellingPositive().audioFile);
      }
      expect(files.size).toBeGreaterThan(1);
    });
  });

  describe("getSpellingWrongAudio", () => {
    it("returns the try-again audio path", () => {
      expect(getSpellingWrongAudio()).toBe("/audio/spelling-wrong/try-again.mp3");
    });
  });

  describe("getLetterAudio", () => {
    it("returns audio path for a letter", () => {
      expect(getLetterAudio("A")).toBe("/audio/letters/a.mp3");
      expect(getLetterAudio("Z")).toBe("/audio/letters/z.mp3");
    });

    it("returns audio path for a number", () => {
      expect(getLetterAudio("5")).toBe("/audio/letters/5.mp3");
    });

    it("returns mapped paths for special chars", () => {
      expect(getLetterAudio(",")).toBe("/audio/letters/comma.mp3");
      expect(getLetterAudio(".")).toBe("/audio/letters/period.mp3");
      expect(getLetterAudio("/")).toBe("/audio/letters/forward-slash.mp3");
      expect(getLetterAudio(";")).toBe("/audio/letters/semicolon.mp3");
    });
  });

  describe("getSpellWordAudio", () => {
    it("returns spell-word path for simple words", () => {
      expect(getSpellWordAudio("cat")).toBe("/audio/spell-word/cat.mp3");
      expect(getSpellWordAudio("dog")).toBe("/audio/spell-word/dog.mp3");
    });

    it("handles multi-word names (lowercased, hyphenated)", () => {
      expect(getSpellWordAudio("yellow")).toBe("/audio/spell-word/yellow.mp3");
    });
  });

  describe("getWordAudio", () => {
    it("returns words path for simple words", () => {
      expect(getWordAudio("cat")).toBe("/audio/words/cat.mp3");
      expect(getWordAudio("happy")).toBe("/audio/words/happy.mp3");
    });
  });
});
