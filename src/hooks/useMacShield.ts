"use client";

import { useEffect } from "react";

/**
 * Intercepts dangerous macOS keyboard shortcuts (CMD+Q, CMD+W, CMD+R)
 * to prevent a 5-year-old from accidentally closing the browser.
 */
export function useMacShield() {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!e.metaKey) return;

      const blocked = ["q", "w", "r", "t", "n", "h"];
      if (blocked.includes(e.key.toLowerCase())) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    // Use capture phase to intercept before anything else
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
}
