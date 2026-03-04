import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { KeyboardEngine } from "@/components/KeyboardEngine";

// Mock the server action
vi.mock("@/app/actions/generate-phrase", () => ({
  generatePhrase: vi.fn(() =>
    Promise.resolve({ text: "Great job!", audioFile: "/audio/positive/00.mp3" })
  ),
}));

// Mock the phrases module
vi.mock("@/lib/phrases", () => ({
  getRandomWrongPhrase: vi.fn(() => ({
    text: "Try again!",
    audioFile: "/audio/wrong/00.mp3",
  })),
}));

describe("KeyboardEngine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("shows welcome screen initially", () => {
    render(<KeyboardEngine />);
    expect(screen.getByText("MacQuest")).toBeInTheDocument();
    expect(screen.getByText("Start Adventure")).toBeInTheDocument();
    expect(screen.getByText("The Typing Adventure")).toBeInTheDocument();
  });

  it("transitions to playing phase after clicking Start Adventure", () => {
    render(<KeyboardEngine />);

    // Click the start button
    fireEvent.click(screen.getByText("Start Adventure"));

    // Welcome screen should be gone, playing UI should appear
    expect(screen.queryByText("Start Adventure")).not.toBeInTheDocument();
    // The first target letter for level 1 is "F"
    // Multiple "F" elements exist (target display, hint, keyboard key), so use getAllByText
    const fElements = screen.getAllByText("F");
    expect(fElements.length).toBeGreaterThanOrEqual(1);
  });

  it("shows target letter during play", () => {
    render(<KeyboardEngine />);

    fireEvent.click(screen.getByText("Start Adventure"));

    // Level 1 starts with "F" as the target letter
    // The target letter is displayed in a large format
    const targetDisplay = screen.getAllByText("F");
    // There should be multiple F elements: the big target display,
    // the hint text "Press the F key!", and the F key on the keyboard
    expect(targetDisplay.length).toBeGreaterThanOrEqual(1);
  });

  it("shows level information after starting", () => {
    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText("Start Adventure"));

    // Should show level indicator
    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.getByText(/Magic Buttons/)).toBeInTheDocument();
  });

  it("shows progress counter after starting", () => {
    const { container } = render(<KeyboardEngine />);
    fireEvent.click(screen.getByText("Start Adventure"));

    // The progress counter shows currentLetterIndex / totalLetters
    // "0" conflicts with the keyboard "0" key, so query within the glass-panel header
    const glassPanel = container.querySelector(".glass-panel");
    expect(glassPanel).toBeInTheDocument();
    // The progress area contains "0" (current) "/" and "8" (total)
    expect(glassPanel!.textContent).toContain("0");
    expect(glassPanel!.textContent).toContain("8");
  });

  it("shows hint text during playing phase", () => {
    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText("Start Adventure"));

    // Should show the hint
    expect(screen.getByText(/Press the/)).toBeInTheDocument();
    expect(screen.getByText(/key!/)).toBeInTheDocument();
  });

  it("renders the keyboard component during play", () => {
    const { container } = render(<KeyboardEngine />);
    fireEvent.click(screen.getByText("Start Adventure"));

    // StarshipKeyboard should render an SVG
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("transitions to celebrating phase on correct key press", async () => {
    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText("Start Adventure"));

    // Press the correct key (F is the first target)
    fireEvent.keyDown(window, { key: "f" });

    // Should show celebration message once the promise resolves
    await waitFor(() => {
      expect(screen.getByText("Great job!")).toBeInTheDocument();
    });
  });

  it("shows wrong key message on incorrect key press", () => {
    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText("Start Adventure"));

    // Press a wrong key (target is F)
    fireEvent.keyDown(window, { key: "a" });

    // Wrong key message should appear immediately (synchronous dispatch)
    expect(screen.getByText("Try again!")).toBeInTheDocument();
  });

  it("renders the SpaceBackground in welcome phase", () => {
    const { container } = render(<KeyboardEngine />);
    // SpaceBackground has the fixed inset-0 wrapper
    const bgWrapper = container.querySelector(".fixed.inset-0");
    expect(bgWrapper).toBeInTheDocument();
  });

  it("renders the SpaceBackground in playing phase", () => {
    const { container } = render(<KeyboardEngine />);
    fireEvent.click(screen.getByText("Start Adventure"));
    const bgWrapper = container.querySelector(".fixed.inset-0");
    expect(bgWrapper).toBeInTheDocument();
  });

  it("transitions to level-complete after finishing all letters", async () => {
    // Override setTimeout to invoke callback immediately for celebration timers
    const originalSetTimeout = globalThis.setTimeout;
    const mockSetTimeout = vi.fn((callback: () => void, ms?: number) => {
      // Execute celebration timers immediately
      if (ms === 2500) {
        callback();
        return 0 as unknown as ReturnType<typeof setTimeout>;
      }
      return originalSetTimeout(callback, ms);
    });
    globalThis.setTimeout = mockSetTimeout as unknown as typeof setTimeout;

    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText("Start Adventure"));

    // Level 0 has 8 letters: F, J, F, J, J, F, F, J
    const letters = ["f", "j", "f", "j", "j", "f", "f", "j"];
    for (const letter of letters) {
      await act(async () => {
        fireEvent.keyDown(window, { key: letter });
        // Let promises resolve
        await Promise.resolve();
      });
    }

    // Should show level complete screen
    expect(screen.getByText("Level Complete!")).toBeInTheDocument();

    globalThis.setTimeout = originalSetTimeout;
  });

  it("shows Next Level button and advances on click", async () => {
    const originalSetTimeout = globalThis.setTimeout;
    const mockSetTimeout = vi.fn((callback: () => void, ms?: number) => {
      if (ms === 2500) {
        callback();
        return 0 as unknown as ReturnType<typeof setTimeout>;
      }
      return originalSetTimeout(callback, ms);
    });
    globalThis.setTimeout = mockSetTimeout as unknown as typeof setTimeout;

    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText("Start Adventure"));

    const letters = ["f", "j", "f", "j", "j", "f", "f", "j"];
    for (const letter of letters) {
      await act(async () => {
        fireEvent.keyDown(window, { key: letter });
        await Promise.resolve();
      });
    }

    // Should show Next Level button
    expect(screen.getByText(/Next Level/)).toBeInTheDocument();

    // Click Next Level
    fireEvent.click(screen.getByText(/Next Level/));

    // Should be back in playing phase with Level 2
    expect(screen.getByText("Level 2")).toBeInTheDocument();

    globalThis.setTimeout = originalSetTimeout;
  });

  it("handles wrong key timer clearing on multiple wrong presses", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText("Start Adventure"));

    // Press a wrong key
    fireEvent.keyDown(window, { key: "a" });
    expect(screen.getByText("Try again!")).toBeInTheDocument();

    // Press another wrong key - should clear the previous timer
    fireEvent.keyDown(window, { key: "b" });
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it("displays letter count on level-complete screen", async () => {
    const originalSetTimeout = globalThis.setTimeout;
    const mockSetTimeout = vi.fn((callback: () => void, ms?: number) => {
      if (ms === 2500) {
        callback();
        return 0 as unknown as ReturnType<typeof setTimeout>;
      }
      return originalSetTimeout(callback, ms);
    });
    globalThis.setTimeout = mockSetTimeout as unknown as typeof setTimeout;

    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText("Start Adventure"));

    const letters = ["f", "j", "f", "j", "j", "f", "f", "j"];
    for (const letter of letters) {
      await act(async () => {
        fireEvent.keyDown(window, { key: letter });
        await Promise.resolve();
      });
    }

    // Level complete screen shows the number of letters typed
    expect(
      screen.getByText(/You typed 8 letters!/)
    ).toBeInTheDocument();

    globalThis.setTimeout = originalSetTimeout;
  });
});
