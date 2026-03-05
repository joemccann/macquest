import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSpeech } from "@/hooks/useSpeech";

describe("useSpeech", () => {
  let originalAudio: typeof Audio;

  beforeEach(() => {
    originalAudio = globalThis.Audio;
  });

  afterEach(() => {
    globalThis.Audio = originalAudio;
  });

  function mockAudioConstructor(instance: Record<string, unknown>) {
    globalThis.Audio = class extends EventTarget {
      constructor() {
        super();
        Object.assign(this, instance);
      }
    } as unknown as typeof Audio;
  }

  it("returns speak, speakSequence, and stopCurrent functions", () => {
    const { result } = renderHook(() => useSpeech());
    expect(typeof result.current.speak).toBe("function");
    expect(typeof result.current.speakSequence).toBe("function");
    expect(typeof result.current.stopCurrent).toBe("function");
  });

  describe("audio file playback", () => {
    it("plays the provided audio file", () => {
      const mockPlay = vi.fn().mockResolvedValue(undefined);
      const mockPause = vi.fn();
      let capturedSrc = "";

      globalThis.Audio = class extends EventTarget {
        volume = 1;
        play = mockPlay;
        pause = mockPause;
        constructor(src?: string) {
          super();
          capturedSrc = src || "";
        }
      } as unknown as typeof Audio;

      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak("Hello", "/audio/hello.mp3");
      });

      expect(capturedSrc).toBe("/audio/hello.mp3");
      expect(mockPlay).toHaveBeenCalled();
    });

    it("sets volume to 1 on the audio element", () => {
      let capturedVolume = 0;
      const mockPlay = vi.fn().mockResolvedValue(undefined);

      globalThis.Audio = class extends EventTarget {
        play = mockPlay;
        pause = vi.fn();
        private _volume = 0;
        get volume() {
          return this._volume;
        }
        set volume(v: number) {
          this._volume = v;
          capturedVolume = v;
        }
      } as unknown as typeof Audio;

      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak("Hello", "/audio/hello.mp3");
      });

      expect(capturedVolume).toBe(1);
    });

    it("does nothing when no audio file is provided", () => {
      const mockPlay = vi.fn().mockResolvedValue(undefined);

      mockAudioConstructor({
        play: mockPlay,
        pause: vi.fn(),
        volume: 1,
      });

      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak("Hello");
      });

      expect(mockPlay).not.toHaveBeenCalled();
    });

    it("silently handles audio play failure", async () => {
      const failingPlay = vi.fn().mockRejectedValue(new Error("Playback failed"));

      mockAudioConstructor({
        play: failingPlay,
        pause: vi.fn(),
        volume: 1,
      });

      const { result } = renderHook(() => useSpeech());

      // Should not throw
      await act(async () => {
        result.current.speak("Fallback text", "/audio/broken.mp3");
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(failingPlay).toHaveBeenCalled();
    });
  });

  describe("stopping previous audio", () => {
    it("pauses previous audio before playing new audio", () => {
      const firstPause = vi.fn();
      const secondPlay = vi.fn().mockResolvedValue(undefined);
      let callCount = 0;

      globalThis.Audio = class extends EventTarget {
        volume = 1;
        play: ReturnType<typeof vi.fn>;
        pause: ReturnType<typeof vi.fn>;
        constructor() {
          super();
          callCount++;
          if (callCount === 1) {
            this.play = vi.fn().mockResolvedValue(undefined);
            this.pause = firstPause;
          } else {
            this.play = secondPlay;
            this.pause = vi.fn();
          }
        }
      } as unknown as typeof Audio;

      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak("First", "/audio/first.mp3");
      });

      act(() => {
        result.current.speak("Second", "/audio/second.mp3");
      });

      expect(firstPause).toHaveBeenCalled();
      expect(secondPlay).toHaveBeenCalled();
    });
  });

  describe("speakSequence", () => {
    it("plays multiple audio files in order", async () => {
      const playCalls: string[] = [];

      globalThis.Audio = class extends EventTarget {
        volume = 1;
        src = "";
        onended: (() => void) | null = null;
        onerror: (() => void) | null = null;
        pause = vi.fn();
        constructor(src?: string) {
          super();
          this.src = src || "";
          playCalls.push(this.src);
        }
        play = vi.fn().mockImplementation(() => {
          setTimeout(() => this.onended?.(), 0);
          return Promise.resolve();
        });
      } as unknown as typeof Audio;

      const { result } = renderHook(() => useSpeech());

      await act(async () => {
        result.current.speakSequence(["/audio/a.mp3", "/audio/b.mp3"]);
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(playCalls).toEqual(["/audio/a.mp3", "/audio/b.mp3"]);
    });

    it("stops previous audio when calling speakSequence", () => {
      const firstPause = vi.fn();
      let callCount = 0;

      globalThis.Audio = class extends EventTarget {
        volume = 1;
        pause: ReturnType<typeof vi.fn>;
        onended: (() => void) | null = null;
        onerror: (() => void) | null = null;
        constructor() {
          super();
          callCount++;
          this.pause = callCount === 1 ? firstPause : vi.fn();
        }
        play = vi.fn().mockResolvedValue(undefined);
      } as unknown as typeof Audio;

      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak("First", "/audio/first.mp3");
      });

      act(() => {
        result.current.speakSequence(["/audio/a.mp3"]);
      });

      expect(firstPause).toHaveBeenCalled();
    });
  });
});
