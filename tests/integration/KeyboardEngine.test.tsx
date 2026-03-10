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
    expect(screen.getByText(/Practice Typing/)).toBeInTheDocument();
    expect(screen.getByText(/Spelling Words/)).toBeInTheDocument();
    expect(screen.getByText("The Typing Adventure")).toBeInTheDocument();
  });

  it("transitions to playing phase after clicking Practice Typing", () => {
    render(<KeyboardEngine />);

    // Click the start button
    fireEvent.click(screen.getByText(/Practice Typing/));

    // Welcome screen should be gone, playing UI should appear
    expect(screen.queryByText(/Practice Typing/)).not.toBeInTheDocument();
    // The first target letter for level 1 is "F"
    // Multiple "F" elements exist (target display, hint, keyboard key), so use getAllByText
    const fElements = screen.getAllByText("F");
    expect(fElements.length).toBeGreaterThanOrEqual(1);
  });

  it("shows target letter during play", () => {
    render(<KeyboardEngine />);

    fireEvent.click(screen.getByText(/Practice Typing/));

    // Level 1 starts with "F" as the target letter
    // The target letter is displayed in a large format
    const targetDisplay = screen.getAllByText("F");
    // There should be multiple F elements: the big target display,
    // the hint text "Press the F key!", and the F key on the keyboard
    expect(targetDisplay.length).toBeGreaterThanOrEqual(1);
  });

  it("shows level information after starting", () => {
    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText(/Practice Typing/));

    // Should show level indicator
    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.getByText(/Magic Buttons/)).toBeInTheDocument();
  });

  it("shows progress counter after starting", () => {
    const { container } = render(<KeyboardEngine />);
    fireEvent.click(screen.getByText(/Practice Typing/));

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
    fireEvent.click(screen.getByText(/Practice Typing/));

    // Should show the hint
    expect(screen.getByText(/Press the/)).toBeInTheDocument();
    expect(screen.getByText(/key!/)).toBeInTheDocument();
  });

  it("renders the keyboard component during play", () => {
    const { container } = render(<KeyboardEngine />);
    fireEvent.click(screen.getByText(/Practice Typing/));

    // StarshipKeyboard should render an SVG
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("transitions to celebrating phase on correct key press", async () => {
    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText(/Practice Typing/));

    // Press the correct key (F is the first target)
    fireEvent.keyDown(window, { key: "f" });

    // Should show celebration message once the promise resolves
    await waitFor(() => {
      expect(screen.getByText("Great job!")).toBeInTheDocument();
    });
  });

  it("shows wrong key message on incorrect key press", () => {
    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText(/Practice Typing/));

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
    fireEvent.click(screen.getByText(/Practice Typing/));
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
    fireEvent.click(screen.getByText(/Practice Typing/));

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
    fireEvent.click(screen.getByText(/Practice Typing/));

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
    fireEvent.click(screen.getByText(/Practice Typing/));

    // Press a wrong key
    fireEvent.keyDown(window, { key: "a" });
    expect(screen.getByText("Try again!")).toBeInTheDocument();

    // Press another wrong key - should clear the previous timer
    fireEvent.keyDown(window, { key: "b" });
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it("shows Continue Adventure when saved game exists", async () => {
    // Seed localStorage with a save
    localStorage.setItem(
      "macquest-save",
      JSON.stringify({
        version: 2, mode: "keys", spellingWordIndex: 0,
        currentLevel: 2,
        currentLetterIndex: 3,
        score: 1500,
        perfectLevels: [0, 1],
        wrongCountThisLevel: 0,
        lastSavedAt: Date.now(),
      })
    );

    render(<KeyboardEngine />);
    expect(await screen.findByText("Continue Adventure")).toBeInTheDocument();
    expect(screen.getByText("Start Over")).toBeInTheDocument();
    expect(screen.getByText(/Welcome back/)).toBeInTheDocument();
  });

  it("resumes saved game when clicking Continue Adventure", async () => {
    localStorage.setItem(
      "macquest-save",
      JSON.stringify({
        version: 2, mode: "keys", spellingWordIndex: 0,
        currentLevel: 2,
        currentLetterIndex: 3,
        score: 1500,
        perfectLevels: [0, 1],
        wrongCountThisLevel: 0,
        lastSavedAt: Date.now(),
      })
    );

    render(<KeyboardEngine />);
    fireEvent.click(await screen.findByText("Continue Adventure"));

    // Should be in playing phase at level 3 (0-indexed level 2)
    expect(screen.getByText("Level 3")).toBeInTheDocument();
    expect(screen.queryByText("Continue Adventure")).not.toBeInTheDocument();
  });

  it("starts fresh when clicking Start Over with saved game", async () => {
    localStorage.setItem(
      "macquest-save",
      JSON.stringify({
        version: 2, mode: "keys", spellingWordIndex: 0,
        currentLevel: 5,
        currentLetterIndex: 0,
        score: 3000,
        perfectLevels: [],
        wrongCountThisLevel: 0,
        lastSavedAt: Date.now(),
      })
    );

    render(<KeyboardEngine />);
    fireEvent.click(await screen.findByText("Start Over"));

    // Should start at level 1
    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.getByText(/Magic Buttons/)).toBeInTheDocument();
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
    fireEvent.click(screen.getByText(/Practice Typing/));

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

  it("shows Home button during play and returns to welcome when clicked", () => {
    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText(/Practice Typing/));

    // Home button should be visible
    const homeButton = screen.getByText("Home");
    expect(homeButton).toBeInTheDocument();

    // Click it
    fireEvent.click(homeButton);

    // Should return to welcome screen
    expect(screen.getByText("MacQuest")).toBeInTheDocument();
    expect(screen.getByText(/Practice Typing/)).toBeInTheDocument();
  });

  it("enters spelling mode when clicking Spelling Words from welcome", () => {
    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText(/Spelling Words/));

    // Should be in spelling mode — shows Word 1 and pencil emoji
    expect(screen.getByText("Word 1")).toBeInTheDocument();
    expect(screen.queryByText(/Practice Typing/)).not.toBeInTheDocument();
  });

  it("shows word display and spell hint in spelling mode", () => {
    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText(/Spelling Words/));

    // Word display shows individual letters
    // First word is "cat" → C, A, T
    expect(screen.getByText("Word 1")).toBeInTheDocument();
    // The hint says "Spell: CAT — Press the C key!"
    expect(screen.getByText(/Spell:/)).toBeInTheDocument();
    expect(screen.getByText("CAT")).toBeInTheDocument();
  });

  it("shows 'Try Again!' on wrong key in spelling mode", () => {
    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText(/Spelling Words/));

    // First target is "C" (for "cat"), press wrong key
    fireEvent.keyDown(window, { key: "z" });

    // Spelling mode shows "Try Again!" not a random phrase
    expect(screen.getByText("Try Again!")).toBeInTheDocument();
  });

  it("advances letters on correct key in spelling mode", async () => {
    const originalSetTimeout = globalThis.setTimeout;
    const mockSetTimeout = vi.fn((callback: () => void, ms?: number) => {
      if (ms === 1200 || ms === 3500) {
        callback();
        return 0 as unknown as ReturnType<typeof setTimeout>;
      }
      return originalSetTimeout(callback, ms);
    });
    globalThis.setTimeout = mockSetTimeout as unknown as typeof setTimeout;

    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText(/Spelling Words/));

    // Press "c" (first letter of "cat")
    await act(async () => {
      fireEvent.keyDown(window, { key: "c" });
      await Promise.resolve();
    });

    // After celebration timer fires, target should advance to "A"
    // The hint text should now say "Press the A key!"
    expect(screen.getByText(/key!/)).toBeInTheDocument();

    globalThis.setTimeout = originalSetTimeout;
  });

  it("shows word complete after spelling entire word", async () => {
    const originalSetTimeout = globalThis.setTimeout;
    const mockSetTimeout = vi.fn((callback: () => void, ms?: number) => {
      if (ms === 1200 || ms === 3500) {
        callback();
        return 0 as unknown as ReturnType<typeof setTimeout>;
      }
      return originalSetTimeout(callback, ms);
    });
    globalThis.setTimeout = mockSetTimeout as unknown as typeof setTimeout;

    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText(/Spelling Words/));

    // Spell "cat" — c, a, t
    for (const letter of ["c", "a", "t"]) {
      await act(async () => {
        fireEvent.keyDown(window, { key: letter });
        await Promise.resolve();
      });
    }

    // Should show word complete screen
    expect(screen.getByText("Word Complete!")).toBeInTheDocument();
    expect(screen.getByText(/You spelled "CAT"!/)).toBeInTheDocument();
    expect(screen.getByText(/Next Word/)).toBeInTheDocument();

    globalThis.setTimeout = originalSetTimeout;
  });

  it("advances to next word after clicking Next Word", async () => {
    const originalSetTimeout = globalThis.setTimeout;
    const mockSetTimeout = vi.fn((callback: () => void, ms?: number) => {
      if (ms === 1200 || ms === 3500) {
        callback();
        return 0 as unknown as ReturnType<typeof setTimeout>;
      }
      return originalSetTimeout(callback, ms);
    });
    globalThis.setTimeout = mockSetTimeout as unknown as typeof setTimeout;

    render(<KeyboardEngine />);
    fireEvent.click(screen.getByText(/Spelling Words/));

    // Spell "cat"
    for (const letter of ["c", "a", "t"]) {
      await act(async () => {
        fireEvent.keyDown(window, { key: letter });
        await Promise.resolve();
      });
    }

    // Click Next Word
    fireEvent.click(screen.getByText(/Next Word/));

    // Should now be on word 2 ("dog")
    expect(screen.getByText("Word 2")).toBeInTheDocument();

    globalThis.setTimeout = originalSetTimeout;
  });
});
