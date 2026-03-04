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
}

export type GameAction =
  | { type: "START_GAME" }
  | { type: "CORRECT_KEY" }
  | { type: "WRONG_KEY"; message: string }
  | { type: "CLEAR_WRONG" }
  | { type: "SET_CELEBRATION_MESSAGE"; message: string }
  | { type: "FINISH_CELEBRATION" }
  | { type: "NEXT_LEVEL" };

const LEVELS: string[][] = [
  // Level 1: Magic Buttons only
  ["F", "J", "F", "J", "J", "F", "F", "J"],
  // Level 2: Home row fingers
  ["D", "K", "F", "J", "D", "K", "S", "L", "F", "J"],
  // Level 3: Full home row
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"],
  // Level 4: Home row mixed
  ["F", "J", "D", "K", "S", "L", "A", ";", "G", "H", "F", "J"],
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
      };
    }

    case "CORRECT_KEY": {
      return {
        ...state,
        phase: "celebrating",
        score: state.score + 1,
        wrongKey: false,
      };
    }

    case "WRONG_KEY": {
      return { ...state, wrongKey: true, wrongKeyMessage: action.message };
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
        // Level complete
        return {
          ...state,
          phase: "level-complete",
          celebrationMessage: "",
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
          score: 0,
          totalLetters: letters.length,
          celebrationMessage: "",
          wrongKey: false,
        };
      }

      const letters = LEVELS[nextLevel];
      return {
        ...state,
        phase: "playing",
        currentLevel: nextLevel,
        currentLetterIndex: 0,
        targetLetter: letters[0],
        letters,
        score: 0,
        totalLetters: letters.length,
        celebrationMessage: "",
        wrongKey: false,
      };
    }

    default:
      return state;
  }
}
