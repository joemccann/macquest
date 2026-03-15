"use client";

import { useCallback, useEffect, useRef } from "react";

export function useSpeech({ muted = false }: { muted?: boolean } = {}) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const abort = useRef<AbortController | null>(null);

  const stopCurrent = useCallback(() => {
    abort.current?.abort(); abort.current = null;
    audio.current?.pause(); audio.current = null;
  }, []);

  const playFile = useCallback((f: string): Promise<void> =>
    new Promise((ok, fail) => {
      const a = new Audio(f);
      a.volume = 1;
      audio.current = a;
      a.onended = () => ok();
      a.onerror = () => fail(new Error("Failed to play " + f));
      a.play().catch(fail);
    }), []);

  const speak = useCallback((_: string, file?: string) => {
    stopCurrent();
    if (!muted && file) playFile(file).catch(() => {});
  }, [muted, stopCurrent, playFile]);

  const speakSequence = useCallback((files: string[]) => {
    stopCurrent();
    if (muted) return;
    const c = new AbortController();
    abort.current = c;
    (async () => { for (const f of files) { if (c.signal.aborted) return; try { await playFile(f); } catch {} } })();
  }, [muted, stopCurrent, playFile]);

  useEffect(() => { if (muted) stopCurrent(); }, [muted, stopCurrent]);

  return { speak, speakSequence, stopCurrent };
}
