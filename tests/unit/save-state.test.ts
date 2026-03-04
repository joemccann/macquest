import { describe, it, expect, vi, beforeEach } from "vitest";
import { saveProgress, loadProgress, clearProgress } from "@/lib/save-state";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

const validInput = {
  currentLevel: 3,
  currentLetterIndex: 5,
  score: 1200,
  perfectLevels: [1, 2],
  wrongCountThisLevel: 1,
};

const validSaveState = {
  version: 1,
  currentLevel: 3,
  currentLetterIndex: 5,
  score: 1200,
  perfectLevels: [1, 2],
  wrongCountThisLevel: 1,
  lastSavedAt: 1700000000000,
};

describe("saveProgress", () => {
  it("saves state to localStorage under 'macquest-save' key", () => {
    saveProgress(validInput);
    const raw = localStorage.getItem("macquest-save");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.currentLevel).toBe(3);
  });

  it("saved data includes version=1 and all fields from input", () => {
    saveProgress(validInput);
    const parsed = JSON.parse(localStorage.getItem("macquest-save")!);
    expect(parsed.version).toBe(1);
    expect(parsed.currentLevel).toBe(validInput.currentLevel);
    expect(parsed.currentLetterIndex).toBe(validInput.currentLetterIndex);
    expect(parsed.score).toBe(validInput.score);
    expect(parsed.perfectLevels).toEqual(validInput.perfectLevels);
    expect(parsed.wrongCountThisLevel).toBe(validInput.wrongCountThisLevel);
  });

  it("saved data includes a lastSavedAt timestamp", () => {
    const before = Date.now();
    saveProgress(validInput);
    const after = Date.now();
    const parsed = JSON.parse(localStorage.getItem("macquest-save")!);
    expect(parsed.lastSavedAt).toBeGreaterThanOrEqual(before);
    expect(parsed.lastSavedAt).toBeLessThanOrEqual(after);
  });

  it("handles localStorage.setItem throwing (silent failure)", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(() => saveProgress(validInput)).not.toThrow();
  });
});

describe("loadProgress", () => {
  it("returns null when no saved data exists", () => {
    expect(loadProgress()).toBeNull();
  });

  it("returns valid SaveState when data is valid", () => {
    localStorage.setItem("macquest-save", JSON.stringify(validSaveState));
    const result = loadProgress();
    expect(result).not.toBeNull();
    expect(result!.version).toBe(1);
    expect(result!.currentLevel).toBe(3);
    expect(result!.currentLetterIndex).toBe(5);
    expect(result!.score).toBe(1200);
    expect(result!.perfectLevels).toEqual([1, 2]);
    expect(result!.wrongCountThisLevel).toBe(1);
    expect(result!.lastSavedAt).toBe(1700000000000);
  });

  it("returns null when JSON is malformed (parse error)", () => {
    localStorage.setItem("macquest-save", "{not valid json!!!");
    expect(loadProgress()).toBeNull();
  });

  it("returns null when data fails validation due to missing fields", () => {
    const incomplete = { version: 1, currentLevel: 3 };
    localStorage.setItem("macquest-save", JSON.stringify(incomplete));
    expect(loadProgress()).toBeNull();
  });

  it("returns null when data has wrong version number", () => {
    const wrongVersion = { ...validSaveState, version: 99 };
    localStorage.setItem("macquest-save", JSON.stringify(wrongVersion));
    expect(loadProgress()).toBeNull();
  });

  it("returns null when data has wrong types for fields", () => {
    const wrongTypes = { ...validSaveState, score: "not-a-number" };
    localStorage.setItem("macquest-save", JSON.stringify(wrongTypes));
    expect(loadProgress()).toBeNull();
  });

  it("returns null when localStorage.getItem throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    expect(loadProgress()).toBeNull();
  });
});

describe("clearProgress", () => {
  it("removes the save key from localStorage", () => {
    localStorage.setItem("macquest-save", JSON.stringify(validSaveState));
    expect(localStorage.getItem("macquest-save")).not.toBeNull();
    clearProgress();
    expect(localStorage.getItem("macquest-save")).toBeNull();
  });

  it("handles localStorage.removeItem throwing (silent failure)", () => {
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    expect(() => clearProgress()).not.toThrow();
  });
});

describe("isValidSaveState (tested through loadProgress)", () => {
  it("rejects null", () => {
    localStorage.setItem("macquest-save", JSON.stringify(null));
    expect(loadProgress()).toBeNull();
  });

  it("rejects a primitive number", () => {
    localStorage.setItem("macquest-save", JSON.stringify(42));
    expect(loadProgress()).toBeNull();
  });

  it("rejects a primitive string", () => {
    localStorage.setItem("macquest-save", JSON.stringify("hello"));
    expect(loadProgress()).toBeNull();
  });

  it("rejects a boolean", () => {
    localStorage.setItem("macquest-save", JSON.stringify(true));
    expect(loadProgress()).toBeNull();
  });

  it("rejects an array", () => {
    localStorage.setItem("macquest-save", JSON.stringify([1, 2, 3]));
    expect(loadProgress()).toBeNull();
  });

  it("rejects object missing currentLevel", () => {
    const { currentLevel, ...rest } = validSaveState;
    localStorage.setItem("macquest-save", JSON.stringify(rest));
    expect(loadProgress()).toBeNull();
  });

  it("rejects object missing currentLetterIndex", () => {
    const { currentLetterIndex, ...rest } = validSaveState;
    localStorage.setItem("macquest-save", JSON.stringify(rest));
    expect(loadProgress()).toBeNull();
  });

  it("rejects object missing score", () => {
    const { score, ...rest } = validSaveState;
    localStorage.setItem("macquest-save", JSON.stringify(rest));
    expect(loadProgress()).toBeNull();
  });

  it("rejects object missing perfectLevels", () => {
    const { perfectLevels, ...rest } = validSaveState;
    localStorage.setItem("macquest-save", JSON.stringify(rest));
    expect(loadProgress()).toBeNull();
  });

  it("rejects object missing wrongCountThisLevel", () => {
    const { wrongCountThisLevel, ...rest } = validSaveState;
    localStorage.setItem("macquest-save", JSON.stringify(rest));
    expect(loadProgress()).toBeNull();
  });

  it("rejects object missing lastSavedAt", () => {
    const { lastSavedAt, ...rest } = validSaveState;
    localStorage.setItem("macquest-save", JSON.stringify(rest));
    expect(loadProgress()).toBeNull();
  });

  it("rejects object missing version", () => {
    const { version, ...rest } = validSaveState;
    localStorage.setItem("macquest-save", JSON.stringify(rest));
    expect(loadProgress()).toBeNull();
  });

  it("rejects when version is wrong number", () => {
    localStorage.setItem(
      "macquest-save",
      JSON.stringify({ ...validSaveState, version: 2 })
    );
    expect(loadProgress()).toBeNull();
  });

  it("rejects when version is a string", () => {
    localStorage.setItem(
      "macquest-save",
      JSON.stringify({ ...validSaveState, version: "1" })
    );
    expect(loadProgress()).toBeNull();
  });

  it("rejects when currentLevel is a string", () => {
    localStorage.setItem(
      "macquest-save",
      JSON.stringify({ ...validSaveState, currentLevel: "three" })
    );
    expect(loadProgress()).toBeNull();
  });

  it("rejects when currentLetterIndex is a string", () => {
    localStorage.setItem(
      "macquest-save",
      JSON.stringify({ ...validSaveState, currentLetterIndex: "five" })
    );
    expect(loadProgress()).toBeNull();
  });

  it("rejects when score is a string", () => {
    localStorage.setItem(
      "macquest-save",
      JSON.stringify({ ...validSaveState, score: "high" })
    );
    expect(loadProgress()).toBeNull();
  });

  it("rejects when perfectLevels is not an array", () => {
    localStorage.setItem(
      "macquest-save",
      JSON.stringify({ ...validSaveState, perfectLevels: "1,2" })
    );
    expect(loadProgress()).toBeNull();
  });

  it("rejects when perfectLevels is an object instead of array", () => {
    localStorage.setItem(
      "macquest-save",
      JSON.stringify({ ...validSaveState, perfectLevels: { 0: 1, 1: 2 } })
    );
    expect(loadProgress()).toBeNull();
  });

  it("rejects when wrongCountThisLevel is a boolean", () => {
    localStorage.setItem(
      "macquest-save",
      JSON.stringify({ ...validSaveState, wrongCountThisLevel: false })
    );
    expect(loadProgress()).toBeNull();
  });

  it("rejects when lastSavedAt is null", () => {
    localStorage.setItem(
      "macquest-save",
      JSON.stringify({ ...validSaveState, lastSavedAt: null })
    );
    expect(loadProgress()).toBeNull();
  });

  it("accepts valid object with all correct fields and types", () => {
    localStorage.setItem("macquest-save", JSON.stringify(validSaveState));
    const result = loadProgress();
    expect(result).toEqual(validSaveState);
  });

  it("accepts valid object with empty perfectLevels array", () => {
    const withEmpty = { ...validSaveState, perfectLevels: [] };
    localStorage.setItem("macquest-save", JSON.stringify(withEmpty));
    const result = loadProgress();
    expect(result).toEqual(withEmpty);
  });

  it("accepts valid object with zero values", () => {
    const withZeros = {
      ...validSaveState,
      currentLevel: 0,
      currentLetterIndex: 0,
      score: 0,
      wrongCountThisLevel: 0,
      lastSavedAt: 0,
    };
    localStorage.setItem("macquest-save", JSON.stringify(withZeros));
    const result = loadProgress();
    expect(result).toEqual(withZeros);
  });
});

describe("round-trip: saveProgress -> loadProgress", () => {
  it("data saved by saveProgress is loadable by loadProgress", () => {
    saveProgress(validInput);
    const result = loadProgress();
    expect(result).not.toBeNull();
    expect(result!.version).toBe(1);
    expect(result!.currentLevel).toBe(validInput.currentLevel);
    expect(result!.currentLetterIndex).toBe(validInput.currentLetterIndex);
    expect(result!.score).toBe(validInput.score);
    expect(result!.perfectLevels).toEqual(validInput.perfectLevels);
    expect(result!.wrongCountThisLevel).toBe(validInput.wrongCountThisLevel);
    expect(typeof result!.lastSavedAt).toBe("number");
  });

  it("clearProgress removes data so loadProgress returns null", () => {
    saveProgress(validInput);
    expect(loadProgress()).not.toBeNull();
    clearProgress();
    expect(loadProgress()).toBeNull();
  });
});
