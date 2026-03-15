import type { GameMode } from "./game-state";

const KEY = "macquest-save";
export const SAVE_STATE_EVENT = "macquest-save-changed";
let _raw: string | null | undefined;
let _state: SaveState | null = null;

function ls(): Storage | null {
  try { return typeof window !== "undefined" ? window.localStorage : null; } catch { return null; }
}

function emit() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(SAVE_STATE_EVENT));
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
    const s = ls();
    if (!s) return;
    s.setItem(KEY, JSON.stringify({ version: 2, ...state, lastSavedAt: Date.now() }));
    emit();
  } catch { /* silent */ }
}

export function loadProgress(): SaveState | null {
  try {
    const s = ls();
    if (!s) return null;
    const raw = s.getItem(KEY);
    if (raw === _raw) return _state;
    _raw = raw;
    if (!raw) { _state = null; return null; }
    const d = JSON.parse(raw);
    if (typeof d !== "object" || !d) { _state = null; return null; }
    // V2 save
    if (d.version === 2 && typeof d.currentLevel === "number" && typeof d.score === "number" && Array.isArray(d.perfectLevels)) {
      _state = d;
      return d;
    }
    // V1 migration
    if (d.version === 1 && typeof d.currentLevel === "number") {
      _state = { ...d, version: 2, mode: "keys" as const, spellingWordIndex: 0 };
      return _state;
    }
    _state = null;
    return null;
  } catch { _raw = null; _state = null; return null; }
}

export function clearProgress(): void {
  try { const s = ls(); if (s) { s.removeItem(KEY); emit(); } } catch { /* silent */ }
}
