import type { GameMode } from "./game-state";

const STORAGE_KEY = "macquest-save";
const SAVE_VERSION = 2;

export interface SaveState {
  version: number;
  currentLevel: number;
  currentLetterIndex: number;
  score: number;
  perfectLevels: number[];
  wrongCountThisLevel: number;
  lastSavedAt: number;
  mode: GameMode;
  spellingWordIndex: number;
}

export function saveProgress(state: {
  currentLevel: number;
  currentLetterIndex: number;
  score: number;
  perfectLevels: number[];
  wrongCountThisLevel: number;
  mode: GameMode;
  spellingWordIndex: number;
}): void {
  try {
    const save: SaveState = {
      version: SAVE_VERSION,
      currentLevel: state.currentLevel,
      currentLetterIndex: state.currentLetterIndex,
      score: state.score,
      perfectLevels: state.perfectLevels,
      wrongCountThisLevel: state.wrongCountThisLevel,
      lastSavedAt: Date.now(),
      mode: state.mode,
      spellingWordIndex: state.spellingWordIndex,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  } catch {
    // Silent failure — game works without persistence
  }
}

export function loadProgress(): SaveState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    if (isValidSaveState(data)) return data;
    // Migrate v1 saves
    if (isValidV1SaveState(data)) return migrateV1(data);
    return null;
  } catch {
    return null;
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silent failure
  }
}

function isValidSaveState(data: unknown): data is SaveState {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    obj.version === SAVE_VERSION &&
    typeof obj.currentLevel === "number" &&
    typeof obj.currentLetterIndex === "number" &&
    typeof obj.score === "number" &&
    Array.isArray(obj.perfectLevels) &&
    typeof obj.wrongCountThisLevel === "number" &&
    typeof obj.lastSavedAt === "number" &&
    (obj.mode === "keys" || obj.mode === "spelling") &&
    typeof obj.spellingWordIndex === "number"
  );
}

interface V1SaveState {
  version: number;
  currentLevel: number;
  currentLetterIndex: number;
  score: number;
  perfectLevels: number[];
  wrongCountThisLevel: number;
  lastSavedAt: number;
}

function isValidV1SaveState(data: unknown): data is V1SaveState {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    obj.version === 1 &&
    typeof obj.currentLevel === "number" &&
    typeof obj.currentLetterIndex === "number" &&
    typeof obj.score === "number" &&
    Array.isArray(obj.perfectLevels) &&
    typeof obj.wrongCountThisLevel === "number" &&
    typeof obj.lastSavedAt === "number"
  );
}

function migrateV1(v1: V1SaveState): SaveState {
  return {
    ...v1,
    version: SAVE_VERSION,
    mode: "keys",
    spellingWordIndex: 0,
  };
}
