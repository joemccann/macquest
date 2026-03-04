import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSpeech } from "@/hooks/useSpeech";

describe("useSpeech", () => {
  let mockCancel: ReturnType<typeof vi.fn>;
  let mockSpeak: ReturnType<typeof vi.fn>;
  let mockGetVoices: ReturnType<typeof vi.fn>;
  let originalAudio: typeof Audio;

  beforeEach(() => {
    // Reset speechSynthesis fns (already writable from setup)
    mockCancel = vi.fn();
    mockSpeak = vi.fn();
    mockGetVoices = vi.fn().mockReturnValue([]);

    (window as unknown as Record<string, unknown>).speechSynthesis = {
      cancel: mockCancel,
      speak: mockSpeak,
      getVoices: mockGetVoices,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    // Save original Audio for restoration
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

  it("returns a speak function", () => {
    const { result } = renderHook(() => useSpeech());
    expect(typeof result.current.speak).toBe("function");
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

    it("does not use speech synthesis when audio file is provided and plays successfully", () => {
      mockAudioConstructor({
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
        volume: 1,
      });

      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak("Hello", "/audio/hello.mp3");
      });

      expect(mockSpeak).not.toHaveBeenCalled();
    });
  });

  describe("speech synthesis fallback", () => {
    it("uses speech synthesis when no audio file is provided", () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak("Hello world");
      });

      expect(mockCancel).toHaveBeenCalled();
      expect(mockSpeak).toHaveBeenCalled();

      const utterance = mockSpeak.mock.calls[0][0];
      expect(utterance.text).toBe("Hello world");
      expect(utterance.rate).toBe(0.9);
      expect(utterance.pitch).toBe(1.2);
      expect(utterance.volume).toBe(1);
    });

    it("cancels any existing synthesis before speaking", () => {
      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak("First");
      });

      const cancelOrder = mockCancel.mock.invocationCallOrder[0];
      const speakOrder = mockSpeak.mock.invocationCallOrder[0];
      expect(cancelOrder).toBeLessThan(speakOrder);
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

    it("pauses previous audio before falling back to synthesis", () => {
      const prevPause = vi.fn();

      globalThis.Audio = class extends EventTarget {
        volume = 1;
        play = vi.fn().mockResolvedValue(undefined);
        pause = prevPause;
      } as unknown as typeof Audio;

      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak("Audio", "/audio/file.mp3");
      });

      act(() => {
        result.current.speak("Synthesis only");
      });

      expect(prevPause).toHaveBeenCalled();
      expect(mockSpeak).toHaveBeenCalled();
    });
  });

  describe("audio play failure fallback", () => {
    it("falls back to speech synthesis when audio play fails", async () => {
      const playError = new Error("Playback failed");
      const failingPlay = vi.fn().mockRejectedValue(playError);

      mockAudioConstructor({
        play: failingPlay,
        pause: vi.fn(),
        volume: 1,
      });

      const { result } = renderHook(() => useSpeech());

      await act(async () => {
        result.current.speak("Fallback text", "/audio/broken.mp3");
        // Allow the rejected promise to resolve
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(failingPlay).toHaveBeenCalled();
      expect(mockCancel).toHaveBeenCalled();
      expect(mockSpeak).toHaveBeenCalled();
    });
  });

  describe("voice selection", () => {
    it("selects a preferred English voice with 'Enhanced' in the name", () => {
      const enhancedVoice = {
        name: "English Enhanced",
        lang: "en-US",
      } as SpeechSynthesisVoice;
      const regularVoice = {
        name: "English Regular",
        lang: "en-US",
      } as SpeechSynthesisVoice;
      mockGetVoices.mockReturnValue([regularVoice, enhancedVoice]);

      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak("Hello");
      });

      const utterance = mockSpeak.mock.calls[0][0];
      expect(utterance.voice).toBe(enhancedVoice);
    });

    it("selects a preferred English voice with 'Premium' in the name", () => {
      const premiumVoice = {
        name: "Premium English",
        lang: "en-GB",
      } as SpeechSynthesisVoice;
      const regularVoice = {
        name: "Regular",
        lang: "en-US",
      } as SpeechSynthesisVoice;
      mockGetVoices.mockReturnValue([regularVoice, premiumVoice]);

      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak("Hello");
      });

      const utterance = mockSpeak.mock.calls[0][0];
      expect(utterance.voice).toBe(premiumVoice);
    });

    it("selects a preferred English voice with 'Samantha' in the name", () => {
      const samanthaVoice = {
        name: "Samantha",
        lang: "en-US",
      } as SpeechSynthesisVoice;
      const otherVoice = {
        name: "Alex",
        lang: "en-US",
      } as SpeechSynthesisVoice;
      mockGetVoices.mockReturnValue([otherVoice, samanthaVoice]);

      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak("Hello");
      });

      const utterance = mockSpeak.mock.calls[0][0];
      expect(utterance.voice).toBe(samanthaVoice);
    });

    it("does not set a voice when no preferred English voice is found", () => {
      const frenchVoice = {
        name: "French Enhanced",
        lang: "fr-FR",
      } as SpeechSynthesisVoice;
      const plainEnglish = {
        name: "Alex",
        lang: "en-US",
      } as SpeechSynthesisVoice;
      mockGetVoices.mockReturnValue([frenchVoice, plainEnglish]);

      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak("Hello");
      });

      const utterance = mockSpeak.mock.calls[0][0];
      expect(utterance.voice).toBeNull();
    });

    it("filters out non-English voices when looking for preferred", () => {
      const frenchEnhanced = {
        name: "French Enhanced",
        lang: "fr-FR",
      } as SpeechSynthesisVoice;
      const regularEnglish = {
        name: "Regular",
        lang: "en-US",
      } as SpeechSynthesisVoice;
      mockGetVoices.mockReturnValue([frenchEnhanced, regularEnglish]);

      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak("Hello");
      });

      const utterance = mockSpeak.mock.calls[0][0];
      // "French Enhanced" has "Enhanced" but is not English, so should not be selected
      expect(utterance.voice).toBeNull();
    });

    it("does not set voice when no voices are available", () => {
      mockGetVoices.mockReturnValue([]);

      const { result } = renderHook(() => useSpeech());

      act(() => {
        result.current.speak("Hello");
      });

      const utterance = mockSpeak.mock.calls[0][0];
      expect(utterance.voice).toBeNull();
    });
  });
});
