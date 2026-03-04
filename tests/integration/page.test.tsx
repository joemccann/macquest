import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";

// Use vi.hoisted to make variable available in mock factory
const { capturedLoader } = vi.hoisted(() => {
  const store: { loader: (() => Promise<unknown>) | null } = { loader: null };
  return {
    capturedLoader: store,
  };
});

// Mock next/dynamic to capture and invoke the loader
vi.mock("next/dynamic", () => ({
  default: (
    loader: () => Promise<unknown>,
    _opts?: Record<string, unknown>
  ) => {
    capturedLoader.loader = loader;
    // Return a simple component
    const MockedDynamic = () =>
      React.createElement("div", { "data-testid": "keyboard-engine" }, "KeyboardEngine");
    MockedDynamic.displayName = "DynamicKeyboardEngine";
    return MockedDynamic;
  },
}));

// Mock KeyboardEngine to avoid loading the full component tree
vi.mock("@/components/KeyboardEngine", () => ({
  KeyboardEngine: () =>
    React.createElement("div", null, "MockedKeyboardEngine"),
}));

import Home from "@/app/page";

describe("Home page", () => {
  it("renders without crashing", () => {
    const { container } = render(<Home />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders the KeyboardEngine via dynamic import", () => {
    const { getByTestId } = render(<Home />);
    expect(getByTestId("keyboard-engine")).toBeInTheDocument();
  });

  it("dynamic import loader resolves to KeyboardEngine", async () => {
    // capturedLoader was set when page.tsx was imported
    expect(capturedLoader.loader).toBeDefined();

    // Call the loader to exercise the dynamic import callback: (m) => m.KeyboardEngine
    const result = await capturedLoader.loader!();
    // The result should be the KeyboardEngine component (mocked)
    expect(result).toBeDefined();
    expect(typeof result).toBe("function");
  });
});
