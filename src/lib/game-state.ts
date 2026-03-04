import type { SaveState } from "./save-state";

export type GamePhase = "welcome" | "playing" | "celebrating" | "level-complete";

export interface GameState {
  phase: GamePhase;
  currentLevel: number;
  currentLetterIndex: number;
  targetLetter: string;
  letters: string[];
  score: number;
  totalLetters: number;
  celebrationMessage: string;
  wrongKey: boolean;
  wrongKeyMessage: string;
  wrongCountThisLevel: number;
  perfectLevels: number[];
  bonusAwarded: number;
}

export type GameAction =
  | { type: "START_GAME" }
  | { type: "CORRECT_KEY" }
  | { type: "WRONG_KEY"; message: string }
  | { type: "CLEAR_WRONG" }
  | { type: "SET_CELEBRATION_MESSAGE"; message: string }
  | { type: "FINISH_CELEBRATION" }
  | { type: "NEXT_LEVEL" }
  | { type: "RESUME_GAME"; save: SaveState };

// All keyboard keys for the final challenge level
const ALL_KEYS = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
  "1","2","3","4","5","6","7","8","9","0",
  ",",".","/",";",
];

function generateLevel12(): string[] {
  const shuffled = [...ALL_KEYS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 14);
}

export const LEVELS: string[][] = [
  // Level 1: Magic Buttons
  ["F", "J", "F", "J", "J", "F", "F", "J"],
  // Level 2: Home Row Fingers
  ["D", "K", "F", "J", "D", "K", "S", "L", "F", "J"],
  // Level 3: Full Home Row
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"],
  // Level 4: Home Row Master
  ["F", "J", "D", "K", "S", "L", "A", ";", "G", "H", "F", "J"],
  // Level 5: Top Row Left
  ["Q", "W", "E", "R", "T", "F", "J", "Q", "W", "E", "R", "T"],
  // Level 6: Top Row Right
  ["Y", "U", "I", "O", "P", "F", "J", "Y", "U", "I", "O", "P"],
  // Level 7: Top Row Master
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  // Level 8: Bottom Row Left
  ["Z", "X", "C", "V", "B", "F", "J", "Z", "X", "C", "V", "B"],
  // Level 9: Bottom Row Right
  ["N", "M", ",", ".", "/", "F", "J", "N", "M", ",", ".", "/"],
  // Level 10: Bottom Row Master
  ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"],
  // Level 11: Number Row
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  // Level 12: Full Keyboard Challenge (generated randomly)
  generateLevel12(),
];

export const LEVEL_NAMES = [
  "Magic Buttons",
  "Home Row Fingers",
  "Full Home Row",
  "Home Row Master",
  "Top Row Left",
  "Top Row Right",
  "Top Row Master",
  "Bottom Row Left",
  "Bottom Row Right",
  "Bottom Row Master",
  "Number Row",
  "Full Keyboard Challenge",
];

export function getInitialState(): GameState {
  const letters = LEVELS[0];
  return {
    phase: "welcome",
    currentLevel: 0,
    currentLetterIndex: 0,
    targetLetter: letters[0],
    letters,
    score: 0,
    totalLetters: letters.length,
    celebrationMessage: "",
    wrongKey: false,
    wrongKeyMessage: "",
    wrongCountThisLevel: 0,
    perfectLevels: [],
    bonusAwarded: 0,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      const letters = LEVELS[0];
      return {
        ...state,
        phase: "playing",
        currentLevel: 0,
        currentLetterIndex: 0,
        targetLetter: letters[0],
        letters,
        score: 0,
        totalLetters: letters.length,
        celebrationMessage: "",
        wrongKey: false,
        wrongKeyMessage: "",
        wrongCountThisLevel: 0,
        perfectLevels: [],
        bonusAwarded: 0,
      };
    }

    case "RESUME_GAME": {
      const { save } = action;
      const levelIndex = Math.min(save.currentLevel, LEVELS.length - 1);
      // Regenerate level 12 if resuming there
      const letters = levelIndex === 11 ? generateLevel12() : LEVELS[levelIndex];
      const letterIndex = Math.min(save.currentLetterIndex, letters.length - 1);
      return {
        ...state,
        phase: "playing",
        currentLevel: levelIndex,
        currentLetterIndex: letterIndex,
        targetLetter: letters[letterIndex],
        letters,
        score: save.score,
        totalLetters: letters.length,
        celebrationMessage: "",
        wrongKey: false,
        wrongKeyMessage: "",
        wrongCountThisLevel: save.wrongCountThisLevel,
        perfectLevels: save.perfectLevels,
        bonusAwarded: 0,
      };
    }

    case "CORRECT_KEY": {
      return {
        ...state,
        phase: "celebrating",
        score: state.score + 100,
        wrongKey: false,
      };
    }

    case "WRONG_KEY": {
      return {
        ...state,
        wrongKey: true,
        wrongKeyMessage: action.message,
        score: Math.max(0, state.score - 100),
        wrongCountThisLevel: state.wrongCountThisLevel + 1,
      };
    }

    case "CLEAR_WRONG": {
      return { ...state, wrongKey: false, wrongKeyMessage: "" };
    }

    case "SET_CELEBRATION_MESSAGE": {
      return { ...state, celebrationMessage: action.message };
    }

    case "FINISH_CELEBRATION": {
      const nextIndex = state.currentLetterIndex + 1;

      if (nextIndex >= state.letters.length) {
        // Level complete — check for perfect bonus
        const isPerfect = state.wrongCountThisLevel === 0;
        let bonusAwarded = 0;
        let newScore = state.score;
        const newPerfectLevels = [...state.perfectLevels];

        if (isPerfect) {
          newPerfectLevels.push(state.currentLevel);
          if (newScore === 0) {
            bonusAwarded = 500;
          } else {
            const multiplier = 0.5 + Math.random() * 0.5; // 0.50 to 1.00
            bonusAwarded = Math.round(newScore * multiplier);
          }
          newScore += bonusAwarded;
        }

        return {
          ...state,
          phase: "level-complete",
          celebrationMessage: "",
          score: newScore,
          bonusAwarded,
          perfectLevels: newPerfectLevels,
        };
      }

      return {
        ...state,
        phase: "playing",
        currentLetterIndex: nextIndex,
        targetLetter: state.letters[nextIndex],
        celebrationMessage: "",
      };
    }

    case "NEXT_LEVEL": {
      const nextLevel = state.currentLevel + 1;
      if (nextLevel >= LEVELS.length) {
        // Wrap around to level 0 with shuffled letters
        const letters = [...LEVELS[0]].sort(() => Math.random() - 0.5);
        return {
          ...state,
          phase: "playing",
          currentLevel: 0,
          currentLetterIndex: 0,
          targetLetter: letters[0],
          letters,
          totalLetters: letters.length,
          celebrationMessage: "",
          wrongKey: false,
          wrongCountThisLevel: 0,
          bonusAwarded: 0,
        };
      }

      // Regenerate level 12 each time
      const letters = nextLevel === 11 ? generateLevel12() : LEVELS[nextLevel];
      return {
        ...state,
        phase: "playing",
        currentLevel: nextLevel,
        currentLetterIndex: 0,
        targetLetter: letters[0],
        letters,
        totalLetters: letters.length,
        celebrationMessage: "",
        wrongKey: false,
        wrongCountThisLevel: 0,
        bonusAwarded: 0,
      };
    }

    default:
      return state;
  }
}
