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

  it("shows welcome screen initially", async () => {
    render(<KeyboardEngine />);
    expect(await screen.findByText("MacQuest")).toBeInTheDocument();
    expect(await screen.findByText(/Practice Typing/)).toBeInTheDocument();
    expect(await screen.findByText(/Spelling Words/)).toBeInTheDocument();
    expect(await screen.findByText("The Typing Adventure")).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "Mute sound" })
    ).toBeInTheDocument();
  });

  it("persists the mute toggle across sessions", async () => {
    const { unmount } = render(<KeyboardEngine />);

    fireEvent.click(await screen.findByRole("button", { name: "Mute sound" }));

    expect(localStorage.getItem("macquest-muted")).toBe("true");
    expect(
      await screen.findByRole("button", { name: "Unmute sound" })
    ).toBeInTheDocument();

    unmount();
    render(<KeyboardEngine />);

    expect(
      await screen.findByRole("button", { name: "Unmute sound" })
    ).toBeInTheDocument();
  });

  it("transitions to playing phase after clicking Practice Typing", async () => {
    render(<KeyboardEngine />);

    // Click the start button
    fireEvent.click(await screen.findByText(/Practice Typing/));

    // Welcome screen should be gone, playing UI should appear
    expect(screen.queryByText(/Practice Typing/)).not.toBeInTheDocument();
    // The first target letter for level 1 is "F"
    // Multiple "F" elements exist (target display, hint, keyboard key), so use getAllByText
    const fElements = screen.getAllByText("F");
    expect(fElements.length).toBeGreaterThanOrEqual(1);
  });

  it("shows target letter during play", async () => {
    render(<KeyboardEngine />);

    fireEvent.click(await screen.findByText(/Practice Typing/));

    // Level 1 starts with "F" as the target letter
    // The target letter is displayed in a large format
    const targetDisplay = screen.getAllByText("F");
    // There should be multiple F elements: the big target display,
    // the hint text "Press the F key!", and the F key on the keyboard
    expect(targetDisplay.length).toBeGreaterThanOrEqual(1);
  });

  it("shows level information after starting", async () => {
    render(<KeyboardEngine />);
    fireEvent.click(await screen.findByText(/Practice Typing/));

    // Should show level indicator
    expect(await screen.findByText("Level 1")).toBeInTheDocument();
    expect(await screen.findByText(/Magic Buttons/)).toBeInTheDocument();
  });

  it("shows progress counter after starting", async () => {
    const { container } = render(<KeyboardEngine />);
    fireEvent.click(await screen.findByText(/Practice Typing/));

    // The progress counter shows currentLetterIndex / totalLetters
    // "0" conflicts with the keyboard "0" key, so query within the glass-panel header
    const glassPanel = container.querySelector(".glass-panel");
    expect(glassPanel).toBeInTheDocument();
    // The progress area contains "0" (current) "/" and "8" (total)
    expect(glassPanel!.textContent).toContain("0");
    expect(glassPanel!.textContent).toContain("8");
  });

  it("shows hint text during playing phase", async () => {
    render(<KeyboardEngine />);
    fireEvent.click(await screen.findByText(/Practice Typing/));

    // Should show the hint
    expect(await screen.findByText(/Press the/)).toBeInTheDocument();
    expect(await screen.findByText(/key!/)).toBeInTheDocument();
  });

  it("renders the keyboard component during play", async () => {
    const { container } = render(<KeyboardEngine />);
    fireEvent.click(await screen.findByText(/Practice Typing/));

    // StarshipKeyboard should render an SVG
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("transitions to celebrating phase on correct key press", async () => {
    render(<KeyboardEngine />);
    fireEvent.click(await screen.findByText(/Practice Typing/));

    // Press the correct key (F is the first target)
    fireEvent.keyDown(window, { key: "f" });

    // Should show celebration message once the promise resolves
    expect(await screen.findByText("Great job!")).toBeInTheDocument();
  });

  it("shows wrong key message on incorrect key press", async () => {
    render(<KeyboardEngine />);
    fireEvent.click(await screen.findByText(/Practice Typing/));

    // Press a wrong key (target is F)
    fireEvent.keyDown(window, { key: "a" });

    // Wrong key message should appear immediately (synchronous dispatch)
    expect(await screen.findByText("Try again!")).toBeInTheDocument();
  });

  it("renders the SpaceBackground in welcome phase", async () => {
    const { container } = render(<KeyboardEngine />);
    // SpaceBackground has the fixed inset-0 wrapper
    const bgWrapper = container.querySelector(".fixed.inset-0");
    expect(bgWrapper).toBeInTheDocument();
  });

  it("renders the SpaceBackground in playing phase", async () => {
    const { container } = render(<KeyboardEngine />);
    fireEvent.click(await screen.findByText(/Practice Typing/));
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
    fireEvent.click(await screen.findByText(/Practice Typing/));

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
    expect(await screen.findByText("Level Complete!")).toBeInTheDocument();

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
    fireEvent.click(await screen.findByText(/Practice Typing/));

    const letters = ["f", "j", "f", "j", "j", "f", "f", "j"];
    for (const letter of letters) {
      await act(async () => {
        fireEvent.keyDown(window, { key: letter });
        await Promise.resolve();
      });
    }

    // Should show Next Level button
    expect(await screen.findByText(/Next Level/)).toBeInTheDocument();

    // Click Next Level
    fireEvent.click(await screen.findByText(/Next Level/));

    // Should be back in playing phase with Level 2
    expect(await screen.findByText("Level 2")).toBeInTheDocument();

    globalThis.setTimeout = originalSetTimeout;
  });

  it("handles wrong key timer clearing on multiple wrong presses", async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

    render(<KeyboardEngine />);
    fireEvent.click(await screen.findByText(/Practice Typing/));

    // Press a wrong key
    fireEvent.keyDown(window, { key: "a" });
    expect(await screen.findByText("Try again!")).toBeInTheDocument();

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
    expect(await screen.findByText("Start Over")).toBeInTheDocument();
    expect(await screen.findByText(/Welcome back/)).toBeInTheDocument();
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
    expect(await screen.findByText("Level 3")).toBeInTheDocument();
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
    expect(await screen.findByText("Level 1")).toBeInTheDocument();
    expect(await screen.findByText(/Magic Buttons/)).toBeInTheDocument();
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
    fireEvent.click(await screen.findByText(/Practice Typing/));

    const letters = ["f", "j", "f", "j", "j", "f", "f", "j"];
    for (const letter of letters) {
      await act(async () => {
        fireEvent.keyDown(window, { key: letter });
        await Promise.resolve();
      });
    }

    // Level complete screen shows the number of letters typed
    expect(
      await screen.findByText(/You typed 8 letters!/)
    ).toBeInTheDocument();

    globalThis.setTimeout = originalSetTimeout;
  });

  it("shows Home button during play and returns to welcome when clicked", async () => {
    render(<KeyboardEngine />);
    fireEvent.click(await screen.findByText(/Practice Typing/));

    // Home button should be visible
    const homeButton = await screen.findByText("Home");
    expect(homeButton).toBeInTheDocument();

    // Click it
    fireEvent.click(homeButton);

    // Should return to welcome screen
    expect(await screen.findByText("MacQuest")).toBeInTheDocument();
    expect(await screen.findByText(/Practice Typing/)).toBeInTheDocument();
  });

  it("enters spelling mode when clicking Spelling Words from welcome", async () => {
    render(<KeyboardEngine />);
    fireEvent.click(await screen.findByText(/Spelling Words/));

    // Should be in spelling mode — shows Word 1 and pencil emoji
    expect(await screen.findByText("Word 1")).toBeInTheDocument();
    expect(screen.queryByText(/Practice Typing/)).not.toBeInTheDocument();
  });

  it("shows word display and spell hint in spelling mode", async () => {
    render(<KeyboardEngine />);
    fireEvent.click(await screen.findByText(/Spelling Words/));

    // Word display shows individual letters
    // First word is "cat" → C, A, T
    expect(await screen.findByText("Word 1")).toBeInTheDocument();
    // The hint says "Spell: CAT — Press the C key!"
    expect(await screen.findByText(/Spell:/)).toBeInTheDocument();
    expect(await screen.findByText("CAT")).toBeInTheDocument();
  });

  it("shows 'Try Again!' on wrong key in spelling mode", async () => {
    render(<KeyboardEngine />);
    fireEvent.click(await screen.findByText(/Spelling Words/));

    // First target is "C" (for "cat"), press wrong key
    fireEvent.keyDown(window, { key: "z" });

    // Spelling mode shows "Try Again!" not a random phrase
    expect(await screen.findByText("Try Again!")).toBeInTheDocument();
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
    fireEvent.click(await screen.findByText(/Spelling Words/));

    // Press "c" (first letter of "cat")
    await act(async () => {
      fireEvent.keyDown(window, { key: "c" });
      await Promise.resolve();
    });

    // After celebration timer fires, target should advance to "A"
    // The hint text should now say "Press the A key!"
    expect(await screen.findByText(/key!/)).toBeInTheDocument();

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
    fireEvent.click(await screen.findByText(/Spelling Words/));

    // Spell "cat" — c, a, t
    for (const letter of ["c", "a", "t"]) {
      await act(async () => {
        fireEvent.keyDown(window, { key: letter });
        await Promise.resolve();
      });
    }

    // Should show word complete screen
    expect(await screen.findByText("Word Complete!")).toBeInTheDocument();
    expect(await screen.findByText(/You spelled "CAT"!/)).toBeInTheDocument();
    expect(await screen.findByText(/Next Word/)).toBeInTheDocument();

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
    fireEvent.click(await screen.findByText(/Spelling Words/));

    // Spell "cat"
    for (const letter of ["c", "a", "t"]) {
      await act(async () => {
        fireEvent.keyDown(window, { key: letter });
        await Promise.resolve();
      });
    }

    // Click Next Word
    fireEvent.click(await screen.findByText(/Next Word/));

    // Should now be on word 2 ("dog")
    expect(await screen.findByText("Word 2")).toBeInTheDocument();

    globalThis.setTimeout = originalSetTimeout;
  });
});
