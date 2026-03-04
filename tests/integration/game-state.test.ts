import { describe, it, expect } from "vitest";
import { gameReducer, getInitialState, type GameState } from "@/lib/game-state";

describe("game-state", () => {
  describe("getInitialState", () => {
    it("returns initial state with welcome phase", () => {
      const state = getInitialState();
      expect(state.phase).toBe("welcome");
      expect(state.currentLevel).toBe(0);
      expect(state.currentLetterIndex).toBe(0);
      expect(state.score).toBe(0);
      expect(state.celebrationMessage).toBe("");
      expect(state.wrongKey).toBe(false);
      expect(state.wrongKeyMessage).toBe("");
    });

    it("initializes with level 0 letters", () => {
      const state = getInitialState();
      // Level 0 is "Magic Buttons" = F, J, F, J, J, F, F, J
      expect(state.letters).toEqual(["F", "J", "F", "J", "J", "F", "F", "J"]);
      expect(state.targetLetter).toBe("F");
      expect(state.totalLetters).toBe(8);
    });
  });

  describe("gameReducer", () => {
    let initialState: GameState;

    beforeEach(() => {
      initialState = getInitialState();
    });

    it("handles START_GAME action", () => {
      const state = gameReducer(initialState, { type: "START_GAME" });
      expect(state.phase).toBe("playing");
      expect(state.currentLevel).toBe(0);
      expect(state.currentLetterIndex).toBe(0);
      expect(state.targetLetter).toBe("F");
      expect(state.score).toBe(0);
    });

    it("handles CORRECT_KEY action", () => {
      const playing = gameReducer(initialState, { type: "START_GAME" });
      const state = gameReducer(playing, { type: "CORRECT_KEY" });
      expect(state.phase).toBe("celebrating");
      expect(state.score).toBe(1);
      expect(state.wrongKey).toBe(false);
    });

    it("handles WRONG_KEY action", () => {
      const playing = gameReducer(initialState, { type: "START_GAME" });
      const state = gameReducer(playing, { type: "WRONG_KEY", message: "Try again!" });
      expect(state.wrongKey).toBe(true);
      expect(state.wrongKeyMessage).toBe("Try again!");
    });

    it("handles CLEAR_WRONG action", () => {
      const playing = gameReducer(initialState, { type: "START_GAME" });
      const wrong = gameReducer(playing, { type: "WRONG_KEY", message: "Try again!" });
      const state = gameReducer(wrong, { type: "CLEAR_WRONG" });
      expect(state.wrongKey).toBe(false);
      expect(state.wrongKeyMessage).toBe("");
    });

    it("handles SET_CELEBRATION_MESSAGE action", () => {
      const playing = gameReducer(initialState, { type: "START_GAME" });
      const celebrating = gameReducer(playing, { type: "CORRECT_KEY" });
      const state = gameReducer(celebrating, {
        type: "SET_CELEBRATION_MESSAGE",
        message: "Great job!",
      });
      expect(state.celebrationMessage).toBe("Great job!");
    });

    it("handles FINISH_CELEBRATION - advances to next letter", () => {
      const playing = gameReducer(initialState, { type: "START_GAME" });
      const celebrating = gameReducer(playing, { type: "CORRECT_KEY" });
      const state = gameReducer(celebrating, { type: "FINISH_CELEBRATION" });
      expect(state.phase).toBe("playing");
      expect(state.currentLetterIndex).toBe(1);
      expect(state.targetLetter).toBe("J"); // Second letter in level 0
      expect(state.celebrationMessage).toBe("");
    });

    it("handles FINISH_CELEBRATION - triggers level-complete when all letters done", () => {
      let state = gameReducer(initialState, { type: "START_GAME" });
      // Complete all 8 letters in level 0
      for (let i = 0; i < 8; i++) {
        state = gameReducer(state, { type: "CORRECT_KEY" });
        state = gameReducer(state, { type: "FINISH_CELEBRATION" });
      }
      // After all letters are done, should be level-complete
      expect(state.phase).toBe("level-complete");
    });

    it("handles NEXT_LEVEL - advances to next level", () => {
      let state = gameReducer(initialState, { type: "START_GAME" });
      // Complete all letters in level 0
      for (let i = 0; i < 8; i++) {
        state = gameReducer(state, { type: "CORRECT_KEY" });
        state = gameReducer(state, { type: "FINISH_CELEBRATION" });
      }
      expect(state.phase).toBe("level-complete");

      // Advance to next level
      state = gameReducer(state, { type: "NEXT_LEVEL" });
      expect(state.phase).toBe("playing");
      expect(state.currentLevel).toBe(1);
      expect(state.currentLetterIndex).toBe(0);
      // Level 1 letters: D, K, F, J, D, K, S, L, F, J
      expect(state.targetLetter).toBe("D");
      expect(state.totalLetters).toBe(10);
    });

    it("handles NEXT_LEVEL - wraps around after last level", () => {
      let state = gameReducer(initialState, { type: "START_GAME" });

      // Complete all 4 levels
      const levelLengths = [8, 10, 10, 12];
      for (let level = 0; level < 4; level++) {
        for (let i = 0; i < levelLengths[level]; i++) {
          state = gameReducer(state, { type: "CORRECT_KEY" });
          state = gameReducer(state, { type: "FINISH_CELEBRATION" });
        }
        state = gameReducer(state, { type: "NEXT_LEVEL" });
      }

      // After completing all levels and pressing next, should wrap to level 0
      expect(state.phase).toBe("playing");
      expect(state.currentLevel).toBe(0);
      expect(state.currentLetterIndex).toBe(0);
      expect(state.score).toBe(0);
    });

    it("returns same state for unknown action", () => {
      const state = gameReducer(initialState, { type: "UNKNOWN" } as never);
      expect(state).toBe(initialState);
    });

    it("CORRECT_KEY clears wrongKey flag", () => {
      let state = gameReducer(initialState, { type: "START_GAME" });
      state = gameReducer(state, { type: "WRONG_KEY", message: "Oops!" });
      expect(state.wrongKey).toBe(true);
      state = gameReducer(state, { type: "CORRECT_KEY" });
      expect(state.wrongKey).toBe(false);
    });

    it("START_GAME resets all state properly", () => {
      let state = gameReducer(initialState, { type: "START_GAME" });
      state = gameReducer(state, { type: "CORRECT_KEY" });
      state = gameReducer(state, {
        type: "SET_CELEBRATION_MESSAGE",
        message: "Wow!",
      });

      // Start game again
      const newState = gameReducer(state, { type: "START_GAME" });
      expect(newState.phase).toBe("playing");
      expect(newState.score).toBe(0);
      expect(newState.currentLetterIndex).toBe(0);
      expect(newState.celebrationMessage).toBe("");
      expect(newState.wrongKey).toBe(false);
      expect(newState.wrongKeyMessage).toBe("");
    });
  });
});
