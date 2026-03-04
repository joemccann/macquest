import { describe, it, expect } from "vitest";
import {
  getInitialState,
  gameReducer,
  type GameState,
  type GamePhase,
} from "@/lib/game-state";

describe("getInitialState", () => {
  it("returns a state with phase 'welcome'", () => {
    const state = getInitialState();
    expect(state.phase).toBe("welcome");
  });

  it("starts at level 0", () => {
    const state = getInitialState();
    expect(state.currentLevel).toBe(0);
  });

  it("starts at letter index 0", () => {
    const state = getInitialState();
    expect(state.currentLetterIndex).toBe(0);
  });

  it("sets targetLetter to first letter of level 0", () => {
    const state = getInitialState();
    expect(state.targetLetter).toBe(state.letters[0]);
  });

  it("loads level 0 letters (F and J)", () => {
    const state = getInitialState();
    expect(state.letters).toEqual(["F", "J", "F", "J", "J", "F", "F", "J"]);
  });

  it("sets score to 0", () => {
    const state = getInitialState();
    expect(state.score).toBe(0);
  });

  it("sets totalLetters to match letters array length", () => {
    const state = getInitialState();
    expect(state.totalLetters).toBe(state.letters.length);
  });

  it("starts with empty celebration message", () => {
    const state = getInitialState();
    expect(state.celebrationMessage).toBe("");
  });

  it("starts with wrongKey false", () => {
    const state = getInitialState();
    expect(state.wrongKey).toBe(false);
  });

  it("starts with empty wrongKeyMessage", () => {
    const state = getInitialState();
    expect(state.wrongKeyMessage).toBe("");
  });
});

describe("gameReducer", () => {
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

  describe("START_GAME", () => {
    it("transitions phase to 'playing'", () => {
      const initial = getInitialState();
      const state = gameReducer(initial, { type: "START_GAME" });
      expect(state.phase).toBe("playing");
    });

    it("resets to level 0", () => {
      const initial = getInitialState();
      const state = gameReducer(
        { ...initial, currentLevel: 2 },
        { type: "START_GAME" }
      );
      expect(state.currentLevel).toBe(0);
    });

    it("resets letter index to 0", () => {
      const state = gameReducer(
        createPlayingState({ currentLetterIndex: 5 }),
        { type: "START_GAME" }
      );
      expect(state.currentLetterIndex).toBe(0);
    });

    it("sets targetLetter to first letter of level 0", () => {
      const state = gameReducer(getInitialState(), { type: "START_GAME" });
      expect(state.targetLetter).toBe("F");
    });

    it("loads level 0 letters", () => {
      const state = gameReducer(getInitialState(), { type: "START_GAME" });
      expect(state.letters).toEqual(["F", "J", "F", "J", "J", "F", "F", "J"]);
    });

    it("resets score to 0", () => {
      const state = gameReducer(
        createPlayingState({ score: 10 }),
        { type: "START_GAME" }
      );
      expect(state.score).toBe(0);
    });

    it("resets totalLetters to level 0 length", () => {
      const state = gameReducer(getInitialState(), { type: "START_GAME" });
      expect(state.totalLetters).toBe(8);
    });

    it("clears celebration message", () => {
      const state = gameReducer(
        createPlayingState({ celebrationMessage: "Great!" }),
        { type: "START_GAME" }
      );
      expect(state.celebrationMessage).toBe("");
    });

    it("clears wrongKey state", () => {
      const state = gameReducer(
        createPlayingState({ wrongKey: true, wrongKeyMessage: "Oops!" }),
        { type: "START_GAME" }
      );
      expect(state.wrongKey).toBe(false);
      expect(state.wrongKeyMessage).toBe("");
    });
  });

  describe("CORRECT_KEY", () => {
    it("transitions phase to 'celebrating'", () => {
      const state = gameReducer(createPlayingState(), { type: "CORRECT_KEY" });
      expect(state.phase).toBe("celebrating");
    });

    it("increments score by 100", () => {
      const state = gameReducer(createPlayingState({ score: 300 }), {
        type: "CORRECT_KEY",
      });
      expect(state.score).toBe(400);
    });

    it("clears wrongKey flag", () => {
      const state = gameReducer(
        createPlayingState({ wrongKey: true }),
        { type: "CORRECT_KEY" }
      );
      expect(state.wrongKey).toBe(false);
    });

    it("preserves currentLetterIndex (does not advance yet)", () => {
      const state = gameReducer(
        createPlayingState({ currentLetterIndex: 2 }),
        { type: "CORRECT_KEY" }
      );
      expect(state.currentLetterIndex).toBe(2);
    });
  });

  describe("WRONG_KEY", () => {
    it("sets wrongKey to true", () => {
      const state = gameReducer(createPlayingState(), {
        type: "WRONG_KEY",
        message: "Oops!",
      });
      expect(state.wrongKey).toBe(true);
    });

    it("sets wrongKeyMessage to provided message", () => {
      const msg = "Try again, space buddy!";
      const state = gameReducer(createPlayingState(), {
        type: "WRONG_KEY",
        message: msg,
      });
      expect(state.wrongKeyMessage).toBe(msg);
    });

    it("does not change phase", () => {
      const state = gameReducer(createPlayingState(), {
        type: "WRONG_KEY",
        message: "Oops!",
      });
      expect(state.phase).toBe("playing");
    });

    it("decrements score by 100", () => {
      const state = gameReducer(createPlayingState({ score: 500 }), {
        type: "WRONG_KEY",
        message: "Nope!",
      });
      expect(state.score).toBe(400);
    });

    it("does not let score go below 0", () => {
      const state = gameReducer(createPlayingState({ score: 0 }), {
        type: "WRONG_KEY",
        message: "Nope!",
      });
      expect(state.score).toBe(0);
    });

    it("increments wrongCountThisLevel", () => {
      const state = gameReducer(createPlayingState({ wrongCountThisLevel: 2 }), {
        type: "WRONG_KEY",
        message: "Nope!",
      });
      expect(state.wrongCountThisLevel).toBe(3);
    });
  });

  describe("CLEAR_WRONG", () => {
    it("clears wrongKey flag", () => {
      const state = gameReducer(
        createPlayingState({ wrongKey: true, wrongKeyMessage: "Oops!" }),
        { type: "CLEAR_WRONG" }
      );
      expect(state.wrongKey).toBe(false);
    });

    it("clears wrongKeyMessage", () => {
      const state = gameReducer(
        createPlayingState({ wrongKey: true, wrongKeyMessage: "Oops!" }),
        { type: "CLEAR_WRONG" }
      );
      expect(state.wrongKeyMessage).toBe("");
    });

    it("does not change other state properties", () => {
      const before = createPlayingState({
        wrongKey: true,
        wrongKeyMessage: "Oops!",
        score: 5,
        currentLetterIndex: 3,
      });
      const after = gameReducer(before, { type: "CLEAR_WRONG" });
      expect(after.score).toBe(5);
      expect(after.currentLetterIndex).toBe(3);
      expect(after.phase).toBe("playing");
    });
  });

  describe("SET_CELEBRATION_MESSAGE", () => {
    it("sets the celebration message", () => {
      const state = gameReducer(
        createPlayingState({ phase: "celebrating" }),
        { type: "SET_CELEBRATION_MESSAGE", message: "Amazing!" }
      );
      expect(state.celebrationMessage).toBe("Amazing!");
    });

    it("can overwrite an existing celebration message", () => {
      const state = gameReducer(
        createPlayingState({
          phase: "celebrating",
          celebrationMessage: "Good!",
        }),
        { type: "SET_CELEBRATION_MESSAGE", message: "Great!" }
      );
      expect(state.celebrationMessage).toBe("Great!");
    });
  });

  describe("FINISH_CELEBRATION", () => {
    it("advances to next letter when more letters remain", () => {
      const state = gameReducer(
        createPlayingState({
          phase: "celebrating",
          currentLetterIndex: 0,
          celebrationMessage: "Nice!",
        }),
        { type: "FINISH_CELEBRATION" }
      );
      expect(state.phase).toBe("playing");
      expect(state.currentLetterIndex).toBe(1);
      expect(state.targetLetter).toBe("J"); // second letter of level 0
      expect(state.celebrationMessage).toBe("");
    });

    it("transitions to level-complete when all letters are done", () => {
      const letters = ["F", "J"];
      const state = gameReducer(
        createPlayingState({
          phase: "celebrating",
          currentLetterIndex: 1, // last index
          letters,
          totalLetters: 2,
          celebrationMessage: "Yay!",
        }),
        { type: "FINISH_CELEBRATION" }
      );
      expect(state.phase).toBe("level-complete");
      expect(state.celebrationMessage).toBe("");
    });

    it("correctly handles the last letter index boundary", () => {
      // 8 letters, index 7 is last
      const state = gameReducer(
        createPlayingState({
          phase: "celebrating",
          currentLetterIndex: 7,
        }),
        { type: "FINISH_CELEBRATION" }
      );
      expect(state.phase).toBe("level-complete");
    });

    it("correctly advances through middle of array", () => {
      const state = gameReducer(
        createPlayingState({
          phase: "celebrating",
          currentLetterIndex: 3,
        }),
        { type: "FINISH_CELEBRATION" }
      );
      expect(state.currentLetterIndex).toBe(4);
      expect(state.targetLetter).toBe("J"); // letters[4] = "J"
    });
  });

  describe("NEXT_LEVEL", () => {
    it("advances to next level when available", () => {
      const state = gameReducer(
        createPlayingState({ phase: "level-complete", currentLevel: 0 }),
        { type: "NEXT_LEVEL" }
      );
      expect(state.phase).toBe("playing");
      expect(state.currentLevel).toBe(1);
    });

    it("loads the correct letters for level 1", () => {
      const state = gameReducer(
        createPlayingState({ phase: "level-complete", currentLevel: 0 }),
        { type: "NEXT_LEVEL" }
      );
      expect(state.letters).toEqual([
        "D", "K", "F", "J", "D", "K", "S", "L", "F", "J",
      ]);
      expect(state.totalLetters).toBe(10);
    });

    it("loads the correct letters for level 2", () => {
      const state = gameReducer(
        createPlayingState({ phase: "level-complete", currentLevel: 1 }),
        { type: "NEXT_LEVEL" }
      );
      expect(state.letters).toEqual([
        "A", "S", "D", "F", "G", "H", "J", "K", "L", ";",
      ]);
    });

    it("loads the correct letters for level 3", () => {
      const state = gameReducer(
        createPlayingState({ phase: "level-complete", currentLevel: 2 }),
        { type: "NEXT_LEVEL" }
      );
      expect(state.letters).toEqual([
        "F", "J", "D", "K", "S", "L", "A", ";", "G", "H", "F", "J",
      ]);
    });

    it("resets currentLetterIndex to 0", () => {
      const state = gameReducer(
        createPlayingState({
          phase: "level-complete",
          currentLevel: 0,
          currentLetterIndex: 7,
        }),
        { type: "NEXT_LEVEL" }
      );
      expect(state.currentLetterIndex).toBe(0);
    });

    it("sets targetLetter to first letter of new level", () => {
      const state = gameReducer(
        createPlayingState({ phase: "level-complete", currentLevel: 0 }),
        { type: "NEXT_LEVEL" }
      );
      expect(state.targetLetter).toBe("D"); // first letter of level 1
    });

    it("preserves score across levels", () => {
      const state = gameReducer(
        createPlayingState({
          phase: "level-complete",
          currentLevel: 0,
          score: 800,
        }),
        { type: "NEXT_LEVEL" }
      );
      expect(state.score).toBe(800);
    });

    it("resets wrongCountThisLevel to 0", () => {
      const state = gameReducer(
        createPlayingState({
          phase: "level-complete",
          currentLevel: 0,
          wrongCountThisLevel: 3,
        }),
        { type: "NEXT_LEVEL" }
      );
      expect(state.wrongCountThisLevel).toBe(0);
    });

    it("clears celebration message and wrongKey", () => {
      const state = gameReducer(
        createPlayingState({
          phase: "level-complete",
          currentLevel: 0,
          celebrationMessage: "Level done!",
          wrongKey: true,
        }),
        { type: "NEXT_LEVEL" }
      );
      expect(state.celebrationMessage).toBe("");
      expect(state.wrongKey).toBe(false);
    });

    it("transitions to victory when all levels complete", () => {
      const state = gameReducer(
        createPlayingState({ phase: "level-complete", currentLevel: 11, score: 5000 }),
        { type: "NEXT_LEVEL" }
      );
      expect(state.phase).toBe("victory");
      expect(state.score).toBe(5000);
    });
  });

  describe("default / unknown action", () => {
    it("returns state unchanged for unknown action types", () => {
      const state = createPlayingState();
      // @ts-expect-error - testing unknown action type
      const result = gameReducer(state, { type: "UNKNOWN_ACTION" });
      expect(result).toBe(state);
    });
  });

  describe("full game flow integration", () => {
    it("plays through an entire level from welcome to level-complete", () => {
      let state = getInitialState();
      expect(state.phase).toBe("welcome");

      // Start game
      state = gameReducer(state, { type: "START_GAME" });
      expect(state.phase).toBe("playing");
      expect(state.targetLetter).toBe("F");

      // Type each letter correctly through the level
      for (let i = 0; i < state.letters.length; i++) {
        // Correct key
        state = gameReducer(state, { type: "CORRECT_KEY" });
        expect(state.phase).toBe("celebrating");
        expect(state.score).toBe((i + 1) * 100);

        // Set celebration message
        state = gameReducer(state, {
          type: "SET_CELEBRATION_MESSAGE",
          message: "Great!",
        });
        expect(state.celebrationMessage).toBe("Great!");

        // Finish celebration
        state = gameReducer(state, { type: "FINISH_CELEBRATION" });

        if (i < state.letters.length - 1) {
          // Still have letters - should not be the last iteration since
          // letters.length was captured before we started and score matches i+1
        }
      }

      expect(state.phase).toBe("level-complete");
    });

    it("handles wrong key during gameplay", () => {
      let state = gameReducer(getInitialState(), { type: "START_GAME" });

      // Wrong key
      state = gameReducer(state, {
        type: "WRONG_KEY",
        message: "Oops!",
      });
      expect(state.wrongKey).toBe(true);
      expect(state.wrongKeyMessage).toBe("Oops!");
      expect(state.score).toBe(0); // score stays at 0 (can't go negative)

      // Clear wrong
      state = gameReducer(state, { type: "CLEAR_WRONG" });
      expect(state.wrongKey).toBe(false);

      // Can still get correct key
      state = gameReducer(state, { type: "CORRECT_KEY" });
      expect(state.score).toBe(100);
      expect(state.phase).toBe("celebrating");
    });
  });
});
