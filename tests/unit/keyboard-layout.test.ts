import { describe, it, expect } from "vitest";
import {
  NUMBER_ROW,
  TOP_ROW,
  HOME_ROW,
  BOTTOM_ROW,
  SPACE_ROW,
  ALL_ROWS,
  findKeyByLabel,
  type KeyData,
} from "@/lib/keyboard-layout";

describe("keyboard-layout", () => {
  describe("row exports", () => {
    it("exports NUMBER_ROW as a non-empty array", () => {
      expect(Array.isArray(NUMBER_ROW)).toBe(true);
      expect(NUMBER_ROW.length).toBeGreaterThan(0);
    });

    it("exports TOP_ROW as a non-empty array", () => {
      expect(Array.isArray(TOP_ROW)).toBe(true);
      expect(TOP_ROW.length).toBeGreaterThan(0);
    });

    it("exports HOME_ROW as a non-empty array", () => {
      expect(Array.isArray(HOME_ROW)).toBe(true);
      expect(HOME_ROW.length).toBeGreaterThan(0);
    });

    it("exports BOTTOM_ROW as a non-empty array", () => {
      expect(Array.isArray(BOTTOM_ROW)).toBe(true);
      expect(BOTTOM_ROW.length).toBeGreaterThan(0);
    });

    it("exports SPACE_ROW as a non-empty array", () => {
      expect(Array.isArray(SPACE_ROW)).toBe(true);
      expect(SPACE_ROW.length).toBeGreaterThan(0);
    });
  });

  describe("ALL_ROWS", () => {
    it("contains exactly 5 rows", () => {
      expect(ALL_ROWS).toHaveLength(5);
    });

    it("contains rows in correct order", () => {
      expect(ALL_ROWS[0]).toBe(NUMBER_ROW);
      expect(ALL_ROWS[1]).toBe(TOP_ROW);
      expect(ALL_ROWS[2]).toBe(HOME_ROW);
      expect(ALL_ROWS[3]).toBe(BOTTOM_ROW);
      expect(ALL_ROWS[4]).toBe(SPACE_ROW);
    });
  });

  describe("KeyData structure", () => {
    function validateKeyData(key: KeyData) {
      expect(typeof key.label).toBe("string");
      expect(key.label.length).toBeGreaterThan(0);
      expect(typeof key.x).toBe("number");
      expect(typeof key.y).toBe("number");
      expect(typeof key.width).toBe("number");
      expect(typeof key.height).toBe("number");
      expect(key.x).toBeGreaterThanOrEqual(0);
      expect(key.y).toBeGreaterThanOrEqual(0);
      expect(key.width).toBeGreaterThan(0);
      expect(key.height).toBeGreaterThan(0);
    }

    it("every key in NUMBER_ROW has valid KeyData properties", () => {
      NUMBER_ROW.forEach(validateKeyData);
    });

    it("every key in TOP_ROW has valid KeyData properties", () => {
      TOP_ROW.forEach(validateKeyData);
    });

    it("every key in HOME_ROW has valid KeyData properties", () => {
      HOME_ROW.forEach(validateKeyData);
    });

    it("every key in BOTTOM_ROW has valid KeyData properties", () => {
      BOTTOM_ROW.forEach(validateKeyData);
    });

    it("every key in SPACE_ROW has valid KeyData properties", () => {
      SPACE_ROW.forEach(validateKeyData);
    });

    it("all keys have consistent height of 44", () => {
      for (const row of ALL_ROWS) {
        for (const key of row) {
          expect(key.height).toBe(44);
        }
      }
    });
  });

  describe("key positioning (x values increase within each row)", () => {
    it("NUMBER_ROW keys have increasing x positions", () => {
      for (let i = 1; i < NUMBER_ROW.length; i++) {
        expect(NUMBER_ROW[i].x).toBeGreaterThan(NUMBER_ROW[i - 1].x);
      }
    });

    it("TOP_ROW keys have increasing x positions", () => {
      for (let i = 1; i < TOP_ROW.length; i++) {
        expect(TOP_ROW[i].x).toBeGreaterThan(TOP_ROW[i - 1].x);
      }
    });

    it("HOME_ROW keys have increasing x positions", () => {
      for (let i = 1; i < HOME_ROW.length; i++) {
        expect(HOME_ROW[i].x).toBeGreaterThan(HOME_ROW[i - 1].x);
      }
    });

    it("BOTTOM_ROW keys have increasing x positions", () => {
      for (let i = 1; i < BOTTOM_ROW.length; i++) {
        expect(BOTTOM_ROW[i].x).toBeGreaterThan(BOTTOM_ROW[i - 1].x);
      }
    });

    it("SPACE_ROW keys have increasing x positions", () => {
      for (let i = 1; i < SPACE_ROW.length; i++) {
        expect(SPACE_ROW[i].x).toBeGreaterThan(SPACE_ROW[i - 1].x);
      }
    });
  });

  describe("row y positions are stacked vertically", () => {
    it("each row has a greater y value than the previous", () => {
      const rowYValues = ALL_ROWS.map((r) => r[0].y);
      for (let i = 1; i < rowYValues.length; i++) {
        expect(rowYValues[i]).toBeGreaterThan(rowYValues[i - 1]);
      }
    });

    it("all keys within a single row share the same y value", () => {
      for (const row of ALL_ROWS) {
        const y = row[0].y;
        row.forEach((key) => expect(key.y).toBe(y));
      }
    });
  });

  describe("magic keys", () => {
    it("F key in HOME_ROW is marked as magic", () => {
      const fKey = HOME_ROW.find((k) => k.label === "F");
      expect(fKey).toBeDefined();
      expect(fKey!.isMagic).toBe(true);
    });

    it("J key in HOME_ROW is marked as magic", () => {
      const jKey = HOME_ROW.find((k) => k.label === "J");
      expect(jKey).toBeDefined();
      expect(jKey!.isMagic).toBe(true);
    });

    it("only F and J are marked as magic in HOME_ROW", () => {
      const magicKeys = HOME_ROW.filter((k) => k.isMagic === true);
      expect(magicKeys).toHaveLength(2);
      expect(magicKeys.map((k) => k.label).sort()).toEqual(["F", "J"]);
    });

    it("no keys outside HOME_ROW are marked as magic", () => {
      const nonHomeRows = [NUMBER_ROW, TOP_ROW, BOTTOM_ROW, SPACE_ROW];
      for (const row of nonHomeRows) {
        const magicKeys = row.filter((k) => k.isMagic === true);
        expect(magicKeys).toHaveLength(0);
      }
    });
  });

  describe("specific key dimensions", () => {
    it("standard letter keys have width 52", () => {
      const aKey = HOME_ROW.find((k) => k.label === "A");
      expect(aKey?.width).toBe(52);
    });

    it("Tab key has custom width 72", () => {
      const tabKey = TOP_ROW.find((k) => k.label === "Tab");
      expect(tabKey?.width).toBe(72);
    });

    it("Caps key has custom width 82", () => {
      const capsKey = HOME_ROW.find((k) => k.label === "Caps");
      expect(capsKey?.width).toBe(82);
    });

    it("Return key has custom width 82", () => {
      const returnKey = HOME_ROW.find((k) => k.label === "Return");
      expect(returnKey?.width).toBe(82);
    });

    it("Shift keys have custom width 104", () => {
      const shiftKeys = BOTTOM_ROW.filter((k) => k.label === "Shift");
      expect(shiftKeys).toHaveLength(2);
      shiftKeys.forEach((k) => expect(k.width).toBe(104));
    });

    it("Delete key has custom width 80", () => {
      const deleteKey = NUMBER_ROW.find((k) => k.label === "Delete");
      expect(deleteKey?.width).toBe(80);
    });

    it("Space bar has custom width 300", () => {
      const spaceKey = SPACE_ROW.find((k) => k.label === "Space");
      expect(spaceKey?.width).toBe(300);
    });

    it("Cmd keys have custom width 66", () => {
      const cmdKeys = SPACE_ROW.filter((k) => k.label === "Cmd");
      expect(cmdKeys).toHaveLength(2);
      cmdKeys.forEach((k) => expect(k.width).toBe(66));
    });
  });

  describe("row content", () => {
    it("NUMBER_ROW contains digits 0-9", () => {
      for (let d = 0; d <= 9; d++) {
        expect(NUMBER_ROW.find((k) => k.label === String(d))).toBeDefined();
      }
    });

    it("TOP_ROW contains Q through P", () => {
      for (const letter of ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]) {
        expect(TOP_ROW.find((k) => k.label === letter)).toBeDefined();
      }
    });

    it("HOME_ROW contains A through ; plus special keys", () => {
      for (const label of ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Return"]) {
        expect(HOME_ROW.find((k) => k.label === label)).toBeDefined();
      }
    });

    it("HOME_ROW has 13 keys total", () => {
      expect(HOME_ROW).toHaveLength(13);
    });

    it("BOTTOM_ROW contains Z through / plus Shift keys", () => {
      for (const label of ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"]) {
        expect(BOTTOM_ROW.find((k) => k.label === label)).toBeDefined();
      }
    });

    it("SPACE_ROW contains modifier and navigation keys", () => {
      for (const label of ["Fn", "Ctrl", "Opt", "Cmd", "Space", "Left", "Up", "Right"]) {
        expect(SPACE_ROW.find((k) => k.label === label)).toBeDefined();
      }
    });

    it("NUMBER_ROW has 14 keys", () => {
      expect(NUMBER_ROW).toHaveLength(14);
    });

    it("TOP_ROW has 14 keys", () => {
      expect(TOP_ROW).toHaveLength(14);
    });

    it("BOTTOM_ROW has 12 keys", () => {
      expect(BOTTOM_ROW).toHaveLength(12);
    });

    it("SPACE_ROW has 10 keys", () => {
      expect(SPACE_ROW).toHaveLength(10);
    });
  });

  describe("findKeyByLabel", () => {
    it("finds a letter key by exact label (uppercase)", () => {
      const key = findKeyByLabel("A");
      expect(key).toBeDefined();
      expect(key!.label).toBe("A");
    });

    it("finds a letter key case-insensitively (lowercase input)", () => {
      const key = findKeyByLabel("a");
      expect(key).toBeDefined();
      expect(key!.label).toBe("A");
    });

    it("finds a letter key case-insensitively (mixed case input)", () => {
      const key = findKeyByLabel("sHiFt");
      expect(key).toBeDefined();
      expect(key!.label).toBe("Shift");
    });

    it("finds the F key and reports isMagic true", () => {
      const key = findKeyByLabel("F");
      expect(key).toBeDefined();
      expect(key!.isMagic).toBe(true);
    });

    it("finds the J key and reports isMagic true", () => {
      const key = findKeyByLabel("J");
      expect(key).toBeDefined();
      expect(key!.isMagic).toBe(true);
    });

    it("finds special keys like Space", () => {
      const key = findKeyByLabel("Space");
      expect(key).toBeDefined();
      expect(key!.label).toBe("Space");
      expect(key!.width).toBe(300);
    });

    it("finds special keys like Tab", () => {
      const key = findKeyByLabel("Tab");
      expect(key).toBeDefined();
      expect(key!.label).toBe("Tab");
    });

    it("finds special keys like Return", () => {
      const key = findKeyByLabel("Return");
      expect(key).toBeDefined();
    });

    it("finds Delete key", () => {
      const key = findKeyByLabel("Delete");
      expect(key).toBeDefined();
      expect(key!.label).toBe("Delete");
    });

    it("finds punctuation keys like semicolon", () => {
      const key = findKeyByLabel(";");
      expect(key).toBeDefined();
      expect(key!.label).toBe(";");
    });

    it("finds backtick key", () => {
      const key = findKeyByLabel("`");
      expect(key).toBeDefined();
    });

    it("finds backslash key", () => {
      const key = findKeyByLabel("\\");
      expect(key).toBeDefined();
    });

    it("returns undefined for a non-existent key label", () => {
      const key = findKeyByLabel("NONEXISTENT");
      expect(key).toBeUndefined();
    });

    it("returns undefined for an empty string", () => {
      const key = findKeyByLabel("");
      expect(key).toBeUndefined();
    });

    it("returns the first matching key when duplicates exist (e.g., Shift)", () => {
      const key = findKeyByLabel("Shift");
      expect(key).toBeDefined();
      // Should be the first Shift key from BOTTOM_ROW (left Shift)
      expect(key!.label).toBe("Shift");
      expect(key!.x).toBe(BOTTOM_ROW[0].x);
    });

    it("returns the correct key data with full position", () => {
      const key = findKeyByLabel("G");
      expect(key).toBeDefined();
      expect(key!.label).toBe("G");
      expect(key!.height).toBe(44);
      expect(key!.width).toBe(52);
      expect(typeof key!.x).toBe("number");
      expect(typeof key!.y).toBe("number");
    });

    it("finds keys from every row", () => {
      // NUMBER_ROW
      expect(findKeyByLabel("5")).toBeDefined();
      // TOP_ROW
      expect(findKeyByLabel("W")).toBeDefined();
      // HOME_ROW
      expect(findKeyByLabel("D")).toBeDefined();
      // BOTTOM_ROW
      expect(findKeyByLabel("N")).toBeDefined();
      // SPACE_ROW
      expect(findKeyByLabel("Fn")).toBeDefined();
    });
  });
});
