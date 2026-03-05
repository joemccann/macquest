import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { useEffect, useState } from "react";
import { useMacShield } from "@/hooks/useMacShield";
import { useGameKeyboard } from "@/hooks/useGameKeyboard";
import { useSpeech } from "@/hooks/useSpeech";

// Test component for useMacShield
function MacShieldTestComponent() {
  useMacShield();
  return <div data-testid="mac-shield">Shield active</div>;
}

// Test component for useGameKeyboard
function GameKeyboardTestComponent({
  targetLetter,
  enabled,
  onCorrect,
  onWrong,
}: {
  targetLetter: string;
  enabled: boolean;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  useGameKeyboard({ targetLetter, enabled, onCorrect, onWrong });
  return <div data-testid="game-keyboard">Keyboard active</div>;
}

// Test component for useSpeech
function SpeechTestComponent({ onSpeak }: { onSpeak: (speak: (text: string, audioFile?: string) => void) => void }) {
  const { speak } = useSpeech();
  useEffect(() => {
    onSpeak(speak);
  }, [speak, onSpeak]);
  return <div data-testid="speech">Speech active</div>;
}

describe("useMacShield", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(<MacShieldTestComponent />);
    expect(getByTestId("mac-shield")).toBeInTheDocument();
  });

  it("blocks CMD+Q keydown events", () => {
    render(<MacShieldTestComponent />);
    const event = new KeyboardEvent("keydown", {
      key: "q",
      metaKey: true,
      cancelable: true,
      bubbles: true,
    });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("blocks CMD+W keydown events", () => {
    render(<MacShieldTestComponent />);
    const event = new KeyboardEvent("keydown", {
      key: "w",
      metaKey: true,
      cancelable: true,
      bubbles: true,
    });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("blocks CMD+R keydown events", () => {
    render(<MacShieldTestComponent />);
    const event = new KeyboardEvent("keydown", {
      key: "r",
      metaKey: true,
      cancelable: true,
      bubbles: true,
    });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("does not block regular key events without meta key", () => {
    render(<MacShieldTestComponent />);
    const event = new KeyboardEvent("keydown", {
      key: "q",
      metaKey: false,
      cancelable: true,
      bubbles: true,
    });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    window.dispatchEvent(event);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it("does not block unblocked CMD combinations", () => {
    render(<MacShieldTestComponent />);
    const event = new KeyboardEvent("keydown", {
      key: "a",
      metaKey: true,
      cancelable: true,
      bubbles: true,
    });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    window.dispatchEvent(event);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it("blocks CMD+T, CMD+N, CMD+H", () => {
    render(<MacShieldTestComponent />);
    for (const key of ["t", "n", "h"]) {
      const event = new KeyboardEvent("keydown", {
        key,
        metaKey: true,
        cancelable: true,
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");
      window.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    }
  });

  it("handles beforeunload event", () => {
    render(<MacShieldTestComponent />);
    const event = new Event("beforeunload", { cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");
    window.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});

describe("useGameKeyboard", () => {
  it("calls onCorrect when the correct key is pressed", () => {
    const onCorrect = vi.fn();
    const onWrong = vi.fn();
    render(
      <GameKeyboardTestComponent
        targetLetter="F"
        enabled={true}
        onCorrect={onCorrect}
        onWrong={onWrong}
      />
    );

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "f", bubbles: true })
      );
    });

    expect(onCorrect).toHaveBeenCalledTimes(1);
    expect(onWrong).not.toHaveBeenCalled();
  });

  it("calls onWrong when an incorrect key is pressed", () => {
    const onCorrect = vi.fn();
    const onWrong = vi.fn();
    render(
      <GameKeyboardTestComponent
        targetLetter="F"
        enabled={true}
        onCorrect={onCorrect}
        onWrong={onWrong}
      />
    );

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "a", bubbles: true })
      );
    });

    expect(onWrong).toHaveBeenCalledTimes(1);
    expect(onCorrect).not.toHaveBeenCalled();
  });

  it("ignores key events when disabled", () => {
    const onCorrect = vi.fn();
    const onWrong = vi.fn();
    render(
      <GameKeyboardTestComponent
        targetLetter="F"
        enabled={false}
        onCorrect={onCorrect}
        onWrong={onWrong}
      />
    );

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "f", bubbles: true })
      );
    });

    expect(onCorrect).not.toHaveBeenCalled();
    expect(onWrong).not.toHaveBeenCalled();
  });

  it("ignores repeated key events", () => {
    const onCorrect = vi.fn();
    const onWrong = vi.fn();
    render(
      <GameKeyboardTestComponent
        targetLetter="F"
        enabled={true}
        onCorrect={onCorrect}
        onWrong={onWrong}
      />
    );

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "f", repeat: true, bubbles: true })
      );
    });

    expect(onCorrect).not.toHaveBeenCalled();
  });

  it("ignores key events with modifier keys (meta)", () => {
    const onCorrect = vi.fn();
    const onWrong = vi.fn();
    render(
      <GameKeyboardTestComponent
        targetLetter="F"
        enabled={true}
        onCorrect={onCorrect}
        onWrong={onWrong}
      />
    );

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "f", metaKey: true, bubbles: true })
      );
    });

    expect(onCorrect).not.toHaveBeenCalled();
    expect(onWrong).not.toHaveBeenCalled();
  });

  it("ignores key events with ctrl modifier", () => {
    const onCorrect = vi.fn();
    const onWrong = vi.fn();
    render(
      <GameKeyboardTestComponent
        targetLetter="F"
        enabled={true}
        onCorrect={onCorrect}
        onWrong={onWrong}
      />
    );

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "f", ctrlKey: true, bubbles: true })
      );
    });

    expect(onCorrect).not.toHaveBeenCalled();
    expect(onWrong).not.toHaveBeenCalled();
  });

  it("ignores key events with alt modifier", () => {
    const onCorrect = vi.fn();
    const onWrong = vi.fn();
    render(
      <GameKeyboardTestComponent
        targetLetter="F"
        enabled={true}
        onCorrect={onCorrect}
        onWrong={onWrong}
      />
    );

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "f", altKey: true, bubbles: true })
      );
    });

    expect(onCorrect).not.toHaveBeenCalled();
    expect(onWrong).not.toHaveBeenCalled();
  });

  it("ignores non-printable keys like Shift", () => {
    const onCorrect = vi.fn();
    const onWrong = vi.fn();
    render(
      <GameKeyboardTestComponent
        targetLetter="F"
        enabled={true}
        onCorrect={onCorrect}
        onWrong={onWrong}
      />
    );

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Shift", bubbles: true })
      );
    });

    expect(onCorrect).not.toHaveBeenCalled();
    expect(onWrong).not.toHaveBeenCalled();
  });

  it("handles case-insensitive matching (uppercase target, lowercase press)", () => {
    const onCorrect = vi.fn();
    const onWrong = vi.fn();
    render(
      <GameKeyboardTestComponent
        targetLetter="F"
        enabled={true}
        onCorrect={onCorrect}
        onWrong={onWrong}
      />
    );

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "f", bubbles: true })
      );
    });

    expect(onCorrect).toHaveBeenCalledTimes(1);
  });
});

describe("useSpeech", () => {
  let speakFn: (text: string, audioFile?: string) => void;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { getByTestId } = render(
      <SpeechTestComponent onSpeak={(s) => { speakFn = s; }} />
    );
    expect(getByTestId("speech")).toBeInTheDocument();
  });

  it("plays audio file when audioFile is provided", () => {
    render(<SpeechTestComponent onSpeak={(s) => { speakFn = s; }} />);

    act(() => {
      speakFn("Hello world", "/audio/positive/00.mp3");
    });

    // HTMLMediaElement.play should have been called (it's mocked in setup)
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it("does nothing when no audioFile provided", () => {
    render(<SpeechTestComponent onSpeak={(s) => { speakFn = s; }} />);

    act(() => {
      speakFn("Hello world");
    });

    // No audio should be played
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it("pauses current audio before playing new one", () => {
    render(<SpeechTestComponent onSpeak={(s) => { speakFn = s; }} />);

    act(() => {
      speakFn("First", "/audio/positive/00.mp3");
    });

    act(() => {
      speakFn("Second", "/audio/positive/01.mp3");
    });

    // pause should have been called for the first audio
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it("silently handles audio play failure", async () => {
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = vi.fn(() => Promise.reject(new Error("play failed")));

    render(<SpeechTestComponent onSpeak={(s) => { speakFn = s; }} />);

    // Should not throw
    await act(async () => {
      speakFn("Fallback test", "/audio/positive/00.mp3");
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();

    HTMLMediaElement.prototype.play = originalPlay;
  });

  it("does not pause audio if no current audio is playing", () => {
    render(<SpeechTestComponent onSpeak={(s) => { speakFn = s; }} />);

    act(() => {
      speakFn("First call", "/audio/positive/00.mp3");
    });

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
  });
});
