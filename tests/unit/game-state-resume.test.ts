import { describe, it, expect, vi } from "vitest";
import {
  gameReducer,
  getInitialState,
  type GameState,
} from "@/lib/game-state";
import type { SaveState } from "@/lib/save-state";

function createPlayingState(overrides: Partial<GameState> = {}): GameState {
  return {
    phase: "playing",
    currentLevel: 0,
    currentLetterIndex: 0,
    targetLetter: "F",
    letters: ["F", "J", "F", "J", "J", "F", "F", "J"],
    score: 0,
    totalLetters: 8,
    celebrationMessage: "",
    wrongKey: false,
    wrongKeyMessage: "",
    wrongCountThisLevel: 0,
    perfectLevels: [],
    bonusAwarded: 0,
    ...overrides,
  };
}

function createSaveState(overrides: Partial<SaveState> = {}): SaveState {
  return {
    version: 1,
    currentLevel: 0,
    currentLetterIndex: 0,
    score: 0,
    perfectLevels: [],
    wrongCountThisLevel: 0,
    lastSavedAt: Date.now(),
    ...overrides,
  };
}

describe("RESUME_GAME", () => {
  it("sets phase to playing", () => {
    const state = getInitialState();
    const save = createSaveState();
    const result = gameReducer(state, { type: "RESUME_GAME", save });
    expect(result.phase).toBe("playing");
  });

  it("uses save.currentLevel clamped to max level index 11", () => {
    const state = getInitialState();
    const save = createSaveState({ currentLevel: 50 });
    const result = gameReducer(state, { type: "RESUME_GAME", save });
    expect(result.currentLevel).toBe(11);
  });

  it("uses save.currentLevel when within bounds", () => {
    const state = getInitialState();
    const save = createSaveState({ currentLevel: 5 });
    const result = gameReducer(state, { type: "RESUME_GAME", save });
    expect(result.currentLevel).toBe(5);
  });

  it("uses save.currentLetterIndex clamped to letters array bounds", () => {
    const state = getInitialState();
    const save = createSaveState({ currentLevel: 0, currentLetterIndex: 999 });
    const result = gameReducer(state, { type: "RESUME_GAME", save });
    expect(result.currentLetterIndex).toBe(result.letters.length - 1);
  });

  it("uses save.currentLetterIndex when within bounds", () => {
    const state = getInitialState();
    const save = createSaveState({ currentLevel: 0, currentLetterIndex: 3 });
    const result = gameReducer(state, { type: "RESUME_GAME", save });
    expect(result.currentLetterIndex).toBe(3);
  });

  it("restores score from save", () => {
    const state = getInitialState();
    const save = createSaveState({ score: 1500 });
    const result = gameReducer(state, { type: "RESUME_GAME", save });
    expect(result.score).toBe(1500);
  });

  it("restores wrongCountThisLevel from save", () => {
    const state = getInitialState();
    const save = createSaveState({ wrongCountThisLevel: 3 });
    const result = gameReducer(state, { type: "RESUME_GAME", save });
    expect(result.wrongCountThisLevel).toBe(3);
  });

  it("restores perfectLevels from save", () => {
    const state = getInitialState();
    const save = createSaveState({ perfectLevels: [0, 1, 2] });
    const result = gameReducer(state, { type: "RESUME_GAME", save });
    expect(result.perfectLevels).toEqual([0, 1, 2]);
  });

  it("sets bonusAwarded to 0", () => {
    const state = getInitialState();
    const save = createSaveState({ score: 1000 });
    const result = gameReducer(state, { type: "RESUME_GAME", save });
    expect(result.bonusAwarded).toBe(0);
  });

  it("clears celebration message", () => {
    const state = { ...getInitialState(), celebrationMessage: "Great job!" };
    const save = createSaveState();
    const result = gameReducer(state, { type: "RESUME_GAME", save });
    expect(result.celebrationMessage).toBe("");
  });

  it("clears wrong key state", () => {
    const state = {
      ...getInitialState(),
      wrongKey: true,
      wrongKeyMessage: "Try again!",
    };
    const save = createSaveState();
    const result = gameReducer(state, { type: "RESUME_GAME", save });
    expect(result.wrongKey).toBe(false);
    expect(result.wrongKeyMessage).toBe("");
  });

  it("generates random 14-character array for level 11", () => {
    const state = getInitialState();
    const save = createSaveState({ currentLevel: 11 });
    const result = gameReducer(state, { type: "RESUME_GAME", save });
    expect(result.currentLevel).toBe(11);
    expect(result.letters).toHaveLength(14);
  });

  it("uses the correct LEVELS array for non-level-11 levels", () => {
    const state = getInitialState();
    const save = createSaveState({ currentLevel: 0 });
    const result = gameReducer(state, { type: "RESUME_GAME", save });
    // Level 0 should have 8 letters (F and J)
    expect(result.letters.length).toBeGreaterThan(0);
    expect(result.targetLetter).toBe(result.letters[0]);
  });

  it("sets targetLetter to the letter at currentLetterIndex", () => {
    const state = getInitialState();
    const save = createSaveState({ currentLevel: 0, currentLetterIndex: 2 });
    const result = gameReducer(state, { type: "RESUME_GAME", save });
    expect(result.targetLetter).toBe(result.letters[2]);
  });

  it("sets totalLetters to the length of the letters array", () => {
    const state = getInitialState();
    const save = createSaveState({ currentLevel: 0 });
    const result = gameReducer(state, { type: "RESUME_GAME", save });
    expect(result.totalLetters).toBe(result.letters.length);
  });
});

describe("FINISH_CELEBRATION perfect level bonus", () => {
  it("adds currentLevel to perfectLevels when wrongCountThisLevel is 0", () => {
    const state = createPlayingState({
      currentLevel: 3,
      currentLetterIndex: 7, // last index in 8-letter array
      wrongCountThisLevel: 0,
      perfectLevels: [],
    });
    const result = gameReducer(state, { type: "FINISH_CELEBRATION" });
    expect(result.perfectLevels).toContain(3);
  });

  it("awards 500 bonus when score is 0 and isPerfect", () => {
    const state = createPlayingState({
      currentLevel: 0,
      currentLetterIndex: 7,
      wrongCountThisLevel: 0,
      score: 0,
      perfectLevels: [],
    });
    const result = gameReducer(state, { type: "FINISH_CELEBRATION" });
    expect(result.bonusAwarded).toBe(500);
    expect(result.score).toBe(500);
  });

  it("awards between 50%-100% of score when score > 0 and isPerfect", () => {
    const baseScore = 1000;
    const state = createPlayingState({
      currentLevel: 0,
      currentLetterIndex: 7,
      wrongCountThisLevel: 0,
      score: baseScore,
      perfectLevels: [],
    });

    // Run multiple times to verify the range (randomness)
    const bonuses: number[] = [];
    for (let i = 0; i < 50; i++) {
      const result = gameReducer(state, { type: "FINISH_CELEBRATION" });
      bonuses.push(result.bonusAwarded);
    }

    const minExpected = Math.round(baseScore * 0.5);
    const maxExpected = Math.round(baseScore * 1.0);

    for (const bonus of bonuses) {
      expect(bonus).toBeGreaterThanOrEqual(minExpected);
      expect(bonus).toBeLessThanOrEqual(maxExpected);
    }
  });

  it("increases score by bonusAwarded when isPerfect", () => {
    const state = createPlayingState({
      currentLevel: 0,
      currentLetterIndex: 7,
      wrongCountThisLevel: 0,
      score: 1000,
      perfectLevels: [],
    });
    const result = gameReducer(state, { type: "FINISH_CELEBRATION" });
    expect(result.score).toBe(1000 + result.bonusAwarded);
  });

  it("does not award bonus when wrongCountThisLevel > 0", () => {
    const state = createPlayingState({
      currentLevel: 0,
      currentLetterIndex: 7,
      wrongCountThisLevel: 2,
      score: 1000,
      perfectLevels: [],
    });
    const result = gameReducer(state, { type: "FINISH_CELEBRATION" });
    expect(result.bonusAwarded).toBe(0);
    expect(result.score).toBe(1000);
  });

  it("does not modify perfectLevels when wrongCountThisLevel > 0", () => {
    const state = createPlayingState({
      currentLevel: 0,
      currentLetterIndex: 7,
      wrongCountThisLevel: 1,
      score: 500,
      perfectLevels: [1, 2],
    });
    const result = gameReducer(state, { type: "FINISH_CELEBRATION" });
    expect(result.perfectLevels).toEqual([1, 2]);
  });

  it("sets phase to level-complete when at last letter", () => {
    const state = createPlayingState({
      currentLevel: 0,
      currentLetterIndex: 7,
      wrongCountThisLevel: 0,
    });
    const result = gameReducer(state, { type: "FINISH_CELEBRATION" });
    expect(result.phase).toBe("level-complete");
  });

  it("clears celebrationMessage on level complete", () => {
    const state = createPlayingState({
      currentLevel: 0,
      currentLetterIndex: 7,
      wrongCountThisLevel: 0,
      celebrationMessage: "Amazing!",
    });
    const result = gameReducer(state, { type: "FINISH_CELEBRATION" });
    expect(result.celebrationMessage).toBe("");
  });
});

describe("NEXT_LEVEL level 11 generation", () => {
  it("generates random 14-character array when nextLevel is 11", () => {
    const state = createPlayingState({
      phase: "level-complete" as GameState["phase"],
      currentLevel: 10,
    });
    const result = gameReducer(state, { type: "NEXT_LEVEL" });
    expect(result.currentLevel).toBe(11);
    expect(result.letters).toHaveLength(14);
  });

  it("resets wrongCountThisLevel on next level", () => {
    const state = createPlayingState({
      phase: "level-complete" as GameState["phase"],
      currentLevel: 10,
      wrongCountThisLevel: 5,
    });
    const result = gameReducer(state, { type: "NEXT_LEVEL" });
    expect(result.wrongCountThisLevel).toBe(0);
  });

  it("resets bonusAwarded on next level", () => {
    const state = createPlayingState({
      phase: "level-complete" as GameState["phase"],
      currentLevel: 10,
      bonusAwarded: 500,
    });
    const result = gameReducer(state, { type: "NEXT_LEVEL" });
    expect(result.bonusAwarded).toBe(0);
  });
});
