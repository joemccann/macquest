import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// Mock HTMLMediaElement.play
Object.defineProperty(HTMLMediaElement.prototype, "play", {
  value: vi.fn(() => Promise.resolve()),
  writable: true,
});

Object.defineProperty(HTMLMediaElement.prototype, "pause", {
  value: vi.fn(),
  writable: true,
});

// Mock server actions
vi.mock("@/app/actions/generate-phrase", () => ({
  generatePhrase: vi.fn(() =>
    Promise.resolve({ text: "Great job!", audioFile: "/audio/positive/00.mp3" })
  ),
}));
