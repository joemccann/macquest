import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// Mock SpeechSynthesisUtterance (not provided by jsdom)
class MockSpeechSynthesisUtterance {
  text: string;
  rate = 1;
  pitch = 1;
  volume = 1;
  voice: SpeechSynthesisVoice | null = null;
  lang = "";
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(text?: string) {
    this.text = text || "";
  }
}
(globalThis as Record<string, unknown>).SpeechSynthesisUtterance =
  MockSpeechSynthesisUtterance;

// Mock window.speechSynthesis
Object.defineProperty(window, "speechSynthesis", {
  value: {
    cancel: vi.fn(),
    speak: vi.fn(),
    getVoices: vi.fn(() => []),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
  writable: true,
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

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    motion: new Proxy(actual.motion, {
      get: (target, prop: string) => {
        if (typeof prop === "string" && !prop.startsWith("_")) {
          // Return a simple component that renders the HTML element
          const Component = (props: Record<string, unknown>) => {
            const {
              animate: _animate,
              initial: _initial,
              exit: _exit,
              transition: _transition,
              whileHover: _whileHover,
              whileTap: _whileTap,
              variants: _variants,
              ...rest
            } = props;
            const Tag = prop as keyof JSX.IntrinsicElements;
            // @ts-expect-error - dynamic element creation
            return <Tag {...rest} />;
          };
          Component.displayName = `motion.${prop}`;
          return Component;
        }
        return Reflect.get(target, prop);
      },
    }),
  };
});
