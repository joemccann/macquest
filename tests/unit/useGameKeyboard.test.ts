import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGameKeyboard } from "@/hooks/useGameKeyboard";

function fireKeyDown(
  key: string,
  options: Partial<KeyboardEventInit> = {}
): KeyboardEvent {
  const event = new KeyboardEvent("keydown", {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  window.dispatchEvent(event);
  return event;
}

describe("useGameKeyboard", () => {
  let onCorrect: ReturnType<typeof vi.fn>;
  let onWrong: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onCorrect = vi.fn();
    onWrong = vi.fn();
  });

  describe("correct key detection", () => {
    it("calls onCorrect when the correct key is pressed", () => {
      renderHook(() =>
        useGameKeyboard({
          targetLetter: "A",
          enabled: true,
          onCorrect,
          onWrong,
        })
      );

      fireKeyDown("a");

      expect(onCorrect).toHaveBeenCalledTimes(1);
      expect(onWrong).not.toHaveBeenCalled();
    });

    it("matches case-insensitively (lowercase target, uppercase press)", () => {
      renderHook(() =>
        useGameKeyboard({
          targetLetter: "a",
          enabled: true,
          onCorrect,
          onWrong,
        })
      );

      fireKeyDown("A");

      expect(onCorrect).toHaveBeenCalledTimes(1);
    });

    it("matches case-insensitively (uppercase target, lowercase press)", () => {
      renderHook(() =>
        useGameKeyboard({
          targetLetter: "F",
          enabled: true,
          onCorrect,
          onWrong,
        })
      );

      fireKeyDown("f");

      expect(onCorrect).toHaveBeenCalledTimes(1);
    });
  });

  describe("wrong key detection", () => {
    it("calls onWrong when the wrong key is pressed", () => {
      renderHook(() =>
        useGameKeyboard({
          targetLetter: "A",
          enabled: true,
          onCorrect,
          onWrong,
        })
      );

      fireKeyDown("b");

      expect(onWrong).toHaveBeenCalledTimes(1);
      expect(onCorrect).not.toHaveBeenCalled();
    });

    it("calls onWrong for each distinct wrong key press", () => {
      renderHook(() =>
        useGameKeyboard({
          targetLetter: "J",
          enabled: true,
          onCorrect,
          onWrong,
        })
      );

      fireKeyDown("k");
      fireKeyDown("l");
      fireKeyDown("a");

      expect(onWrong).toHaveBeenCalledTimes(3);
    });
  });

  describe("enabled/disabled state", () => {
    it("does not fire callbacks when disabled", () => {
      renderHook(() =>
        useGameKeyboard({
          targetLetter: "A",
          enabled: false,
          onCorrect,
          onWrong,
        })
      );

      fireKeyDown("a");
      fireKeyDown("b");

      expect(onCorrect).not.toHaveBeenCalled();
      expect(onWrong).not.toHaveBeenCalled();
    });

    it("starts responding after being re-enabled", () => {
      const { rerender } = renderHook(
        ({ enabled }) =>
          useGameKeyboard({
            targetLetter: "A",
            enabled,
            onCorrect,
            onWrong,
          }),
        { initialProps: { enabled: false } }
      );

      fireKeyDown("a");
      expect(onCorrect).not.toHaveBeenCalled();

      rerender({ enabled: true });
      fireKeyDown("a");
      expect(onCorrect).toHaveBeenCalledTimes(1);
    });
  });

  describe("modifier keys ignored", () => {
    it("ignores keydown with metaKey", () => {
      renderHook(() =>
        useGameKeyboard({
          targetLetter: "A",
          enabled: true,
          onCorrect,
          onWrong,
        })
      );

      fireKeyDown("a", { metaKey: true });

      expect(onCorrect).not.toHaveBeenCalled();
      expect(onWrong).not.toHaveBeenCalled();
    });

    it("ignores keydown with ctrlKey", () => {
      renderHook(() =>
        useGameKeyboard({
          targetLetter: "A",
          enabled: true,
          onCorrect,
          onWrong,
        })
      );

      fireKeyDown("a", { ctrlKey: true });

      expect(onCorrect).not.toHaveBeenCalled();
      expect(onWrong).not.toHaveBeenCalled();
    });

    it("ignores keydown with altKey", () => {
      renderHook(() =>
        useGameKeyboard({
          targetLetter: "A",
          enabled: true,
          onCorrect,
          onWrong,
        })
      );

      fireKeyDown("a", { altKey: true });

      expect(onCorrect).not.toHaveBeenCalled();
      expect(onWrong).not.toHaveBeenCalled();
    });
  });

  describe("repeat events ignored", () => {
    it("ignores repeated keydown events", () => {
      renderHook(() =>
        useGameKeyboard({
          targetLetter: "A",
          enabled: true,
          onCorrect,
          onWrong,
        })
      );

      fireKeyDown("a", { repeat: true });

      expect(onCorrect).not.toHaveBeenCalled();
      expect(onWrong).not.toHaveBeenCalled();
    });
  });

  describe("non-printable keys ignored", () => {
    const nonPrintableKeys = [
      "Shift",
      "Control",
      "Alt",
      "Meta",
      "Enter",
      "Tab",
      "Backspace",
      "Escape",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "CapsLock",
      "Delete",
    ];

    nonPrintableKeys.forEach((key) => {
      it(`ignores ${key}`, () => {
        renderHook(() =>
          useGameKeyboard({
            targetLetter: "A",
            enabled: true,
            onCorrect,
            onWrong,
          })
        );

        fireKeyDown(key);

        expect(onCorrect).not.toHaveBeenCalled();
        expect(onWrong).not.toHaveBeenCalled();
      });
    });
  });

  it("calls preventDefault on valid key presses", () => {
    renderHook(() =>
      useGameKeyboard({
        targetLetter: "A",
        enabled: true,
        onCorrect,
        onWrong,
      })
    );

    const event = new KeyboardEvent("keydown", {
      key: "a",
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("removes event listener on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() =>
      useGameKeyboard({
        targetLetter: "A",
        enabled: true,
        onCorrect,
        onWrong,
      })
    );

    unmount();

    const keydownCall = removeSpy.mock.calls.find(
      (call) => call[0] === "keydown"
    );
    expect(keydownCall).toBeDefined();

    removeSpy.mockRestore();
  });

  it("updates handler when targetLetter changes", () => {
    const { rerender } = renderHook(
      ({ targetLetter }) =>
        useGameKeyboard({
          targetLetter,
          enabled: true,
          onCorrect,
          onWrong,
        }),
      { initialProps: { targetLetter: "A" } }
    );

    fireKeyDown("a");
    expect(onCorrect).toHaveBeenCalledTimes(1);

    rerender({ targetLetter: "B" });

    fireKeyDown("a");
    expect(onWrong).toHaveBeenCalledTimes(1);

    fireKeyDown("b");
    expect(onCorrect).toHaveBeenCalledTimes(2);
  });
});
