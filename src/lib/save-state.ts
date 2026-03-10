import type { GameMode } from "./game-state";

const STORAGE_KEY = "macquest-save";
const SAVE_VERSION = 2;
export const SAVE_STATE_EVENT = "macquest-save-changed";
let cachedSaveRaw: string | null | undefined;
let cachedSaveState: SaveState | null = null;

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function emitSaveStateChange(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(SAVE_STATE_EVENT));
}

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
    const storage = getStorage();
    if (!storage) return;

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
    storage.setItem(STORAGE_KEY, JSON.stringify(save));
    emitSaveStateChange();
  } catch {
    // Silent failure — game works without persistence
  }
}

export function loadProgress(): SaveState | null {
  try {
    const storage = getStorage();
    if (!storage) return null;

    const raw = storage.getItem(STORAGE_KEY);
    if (raw === cachedSaveRaw) {
      return cachedSaveState;
    }

    cachedSaveRaw = raw;

    if (!raw) {
      cachedSaveState = null;
      return null;
    }

    const data: unknown = JSON.parse(raw);
    if (isValidSaveState(data)) {
      cachedSaveState = data;
      return data;
    }
    // Migrate v1 saves
    if (isValidV1SaveState(data)) {
      cachedSaveState = migrateV1(data);
      return cachedSaveState;
    }

    cachedSaveState = null;
    return null;
  } catch {
    cachedSaveRaw = null;
    cachedSaveState = null;
    return null;
  }
}

export function clearProgress(): void {
  try {
    const storage = getStorage();
    if (!storage) return;

    storage.removeItem(STORAGE_KEY);
    emitSaveStateChange();
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
