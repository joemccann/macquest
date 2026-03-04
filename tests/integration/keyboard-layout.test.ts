import { describe, it, expect } from "vitest";
import {
  ALL_ROWS,
  NUMBER_ROW,
  TOP_ROW,
  HOME_ROW,
  BOTTOM_ROW,
  SPACE_ROW,
  findKeyByLabel,
} from "@/lib/keyboard-layout";

describe("keyboard-layout", () => {
  it("exports 5 rows", () => {
    expect(ALL_ROWS).toHaveLength(5);
  });

  it("ALL_ROWS contains all individual rows in order", () => {
    expect(ALL_ROWS[0]).toBe(NUMBER_ROW);
    expect(ALL_ROWS[1]).toBe(TOP_ROW);
    expect(ALL_ROWS[2]).toBe(HOME_ROW);
    expect(ALL_ROWS[3]).toBe(BOTTOM_ROW);
    expect(ALL_ROWS[4]).toBe(SPACE_ROW);
  });

  it("HOME_ROW contains F and J as magic keys", () => {
    const fKey = HOME_ROW.find((k) => k.label === "F");
    const jKey = HOME_ROW.find((k) => k.label === "J");
    expect(fKey?.isMagic).toBe(true);
    expect(jKey?.isMagic).toBe(true);
  });

  it("non-magic keys do not have isMagic set", () => {
    const aKey = HOME_ROW.find((k) => k.label === "A");
    expect(aKey?.isMagic).toBeUndefined();
  });

  it("keys have valid dimensions", () => {
    for (const row of ALL_ROWS) {
      for (const key of row) {
        expect(key.width).toBeGreaterThan(0);
        expect(key.height).toBeGreaterThan(0);
        expect(key.x).toBeGreaterThanOrEqual(0);
        expect(key.y).toBeGreaterThanOrEqual(0);
      }
    }
  });

  describe("findKeyByLabel", () => {
    it("finds a key by exact label", () => {
      const key = findKeyByLabel("A");
      expect(key).toBeDefined();
      expect(key!.label).toBe("A");
    });

    it("finds a key case-insensitively", () => {
      const key = findKeyByLabel("a");
      expect(key).toBeDefined();
      expect(key!.label).toBe("A");
    });

    it("returns undefined for non-existent key", () => {
      const key = findKeyByLabel("NONEXISTENT");
      expect(key).toBeUndefined();
    });

    it("finds special keys like Space", () => {
      const key = findKeyByLabel("Space");
      expect(key).toBeDefined();
      expect(key!.label).toBe("Space");
    });

    it("finds magic keys", () => {
      const fKey = findKeyByLabel("F");
      expect(fKey).toBeDefined();
      expect(fKey!.isMagic).toBe(true);
    });
  });
});
