const KEY = "macquest-muted";
export const AUDIO_PREFERENCE_EVENT = "macquest-audio-preference-changed";
let _raw: string | null | undefined;
let _muted = false;

function ls(): Storage | null {
  try { return typeof window !== "undefined" ? window.localStorage : null; } catch { return null; }
}

export function loadMutedPreference(): boolean {
  try {
    const s = ls();
    if (!s) return false;
    const raw = s.getItem(KEY);
    if (raw === _raw) return _muted;
    _raw = raw;
    _muted = raw ? JSON.parse(raw) === true : false;
    return _muted;
  } catch { _raw = null; _muted = false; return false; }
}

export function saveMutedPreference(muted: boolean): void {
  try {
    const s = ls();
    if (!s) return;
    const raw = JSON.stringify(muted);
    s.setItem(KEY, raw);
    _raw = raw;
    _muted = muted;
    window.dispatchEvent(new Event(AUDIO_PREFERENCE_EVENT));
  } catch { /* silent */ }
}

export function subscribeToMutedPreference(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const h = (e: StorageEvent) => { if (e.key === KEY || e.key === null) onStoreChange(); };
  window.addEventListener("storage", h);
  window.addEventListener(AUDIO_PREFERENCE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", h);
    window.removeEventListener(AUDIO_PREFERENCE_EVENT, onStoreChange);
  };
}
