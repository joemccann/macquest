const STORAGE_KEY = "macquest-muted";
export const AUDIO_PREFERENCE_EVENT = "macquest-audio-preference-changed";

let cachedMutedRaw: string | null | undefined;
let cachedMutedPreference = false;

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

function emitAudioPreferenceChange(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUDIO_PREFERENCE_EVENT));
}

export function loadMutedPreference(): boolean {
  try {
    const storage = getStorage();
    if (!storage) return false;

    const raw = storage.getItem(STORAGE_KEY);
    if (raw === cachedMutedRaw) {
      return cachedMutedPreference;
    }

    cachedMutedRaw = raw;

    if (!raw) {
      cachedMutedPreference = false;
      return false;
    }

    const parsed = JSON.parse(raw);
    cachedMutedPreference = parsed === true;
    return cachedMutedPreference;
  } catch {
    cachedMutedRaw = null;
    cachedMutedPreference = false;
    return false;
  }
}

export function saveMutedPreference(muted: boolean): void {
  try {
    const storage = getStorage();
    if (!storage) return;

    const raw = JSON.stringify(muted);
    storage.setItem(STORAGE_KEY, raw);
    cachedMutedRaw = raw;
    cachedMutedPreference = muted;
    emitAudioPreferenceChange();
  } catch {
    // Silent failure — audio still works without persisted preferences
  }
}

export function subscribeToMutedPreference(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(AUDIO_PREFERENCE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(AUDIO_PREFERENCE_EVENT, onStoreChange);
  };
}
