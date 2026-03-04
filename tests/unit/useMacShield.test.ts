import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMacShield } from "@/hooks/useMacShield";

describe("useMacShield", () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, "addEventListener");
    removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it("registers keydown and beforeunload listeners on mount", () => {
    renderHook(() => useMacShield());

    const keydownCall = addEventListenerSpy.mock.calls.find(
      (call) => call[0] === "keydown"
    );
    const beforeunloadCall = addEventListenerSpy.mock.calls.find(
      (call) => call[0] === "beforeunload"
    );

    expect(keydownCall).toBeDefined();
    expect(keydownCall![2]).toEqual({ capture: true });
    expect(beforeunloadCall).toBeDefined();
  });

  it("removes keydown and beforeunload listeners on unmount", () => {
    const { unmount } = renderHook(() => useMacShield());
    unmount();

    const keydownCall = removeEventListenerSpy.mock.calls.find(
      (call) => call[0] === "keydown"
    );
    const beforeunloadCall = removeEventListenerSpy.mock.calls.find(
      (call) => call[0] === "beforeunload"
    );

    expect(keydownCall).toBeDefined();
    expect(keydownCall![2]).toEqual({ capture: true });
    expect(beforeunloadCall).toBeDefined();
  });

  describe("blocked CMD shortcuts", () => {
    const blockedKeys = ["q", "w", "r", "t", "n", "h"];

    blockedKeys.forEach((key) => {
      it(`blocks CMD+${key.toUpperCase()}`, () => {
        renderHook(() => useMacShield());

        const event = new KeyboardEvent("keydown", {
          key,
          metaKey: true,
          bubbles: true,
          cancelable: true,
        });
        const preventDefaultSpy = vi.spyOn(event, "preventDefault");
        const stopPropagationSpy = vi.spyOn(event, "stopPropagation");

        window.dispatchEvent(event);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(stopPropagationSpy).toHaveBeenCalled();
      });
    });

    it("blocks uppercase CMD+Q as well", () => {
      renderHook(() => useMacShield());

      const event = new KeyboardEvent("keydown", {
        key: "Q",
        metaKey: true,
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");
      const stopPropagationSpy = vi.spyOn(event, "stopPropagation");

      window.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });

  describe("non-blocked shortcuts", () => {
    const allowedKeys = ["a", "s", "c", "v", "z", "x"];

    allowedKeys.forEach((key) => {
      it(`allows CMD+${key.toUpperCase()} through`, () => {
        renderHook(() => useMacShield());

        const event = new KeyboardEvent("keydown", {
          key,
          metaKey: true,
          bubbles: true,
          cancelable: true,
        });
        const preventDefaultSpy = vi.spyOn(event, "preventDefault");

        window.dispatchEvent(event);

        expect(preventDefaultSpy).not.toHaveBeenCalled();
      });
    });
  });

  it("does not intercept keys without metaKey", () => {
    renderHook(() => useMacShield());

    const event = new KeyboardEvent("keydown", {
      key: "q",
      metaKey: false,
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    window.dispatchEvent(event);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it("handles beforeunload by calling preventDefault", () => {
    renderHook(() => useMacShield());

    const event = new Event("beforeunload", {
      cancelable: true,
    }) as BeforeUnloadEvent;
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
