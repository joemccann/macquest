import { describe, it, expect } from "vitest";
import { getRandomWrongPhrase } from "@/lib/phrases";

describe("phrases", () => {
  describe("getRandomWrongPhrase", () => {
    it("returns a PhraseResult with text and audioFile", () => {
      const result = getRandomWrongPhrase();
      expect(result.text).toBeTruthy();
      expect(result.text.length).toBeGreaterThan(0);
      expect(result.audioFile).toBeDefined();
      expect(typeof result.audioFile).toBe("string");
    });

    it("audioFile follows the expected pattern", () => {
      const result = getRandomWrongPhrase();
      expect(result.audioFile).toMatch(/^\/audio\/wrong\/\d{2}\.mp3$/);
    });

    it("returns varied phrases on multiple calls", () => {
      const results = new Set<string>();
      for (let i = 0; i < 15; i++) {
        const result = getRandomWrongPhrase();
        results.add(result.text);
      }
      // With history tracking, should return variety
      expect(results.size).toBeGreaterThan(1);
    });

    it("text is non-empty on every call", () => {
      for (let i = 0; i < 10; i++) {
        const result = getRandomWrongPhrase();
        expect(result.text.trim().length).toBeGreaterThan(0);
      }
    });

    it("continues working after exhausting all phrases via history", () => {
      // Call enough times to fill the history completely (maxHistory = 10)
      // With 25 phrases and maxHistory of 10, this should eventually
      // cycle through and test the pool resetting
      const results: string[] = [];
      for (let i = 0; i < 30; i++) {
        const result = getRandomWrongPhrase();
        results.push(result.text);
        expect(result.text).toBeTruthy();
        expect(result.audioFile).toBeTruthy();
      }
      // All results should be valid phrases
      expect(results.length).toBe(30);
    });
  });
});
