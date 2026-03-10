import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { SITE_TITLE } from "@/lib/seo";

const { capturedDynamicConfig } = vi.hoisted(() => {
  const store: {
    loader: (() => Promise<unknown>) | null;
    options?: Record<string, unknown>;
  } = { loader: null };
  return {
    capturedDynamicConfig: store,
  };
});

vi.mock("next/dynamic", () => ({
  default: (
    loader: () => Promise<unknown>,
    opts?: Record<string, unknown>
  ) => {
    capturedDynamicConfig.loader = loader;
    capturedDynamicConfig.options = opts;
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

vi.mock("@/components/SpaceBackground", () => ({
  SpaceBackground: () =>
    React.createElement("div", { "data-testid": "space-background" }),
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
    expect(capturedDynamicConfig.loader).toBeDefined();

    const result = await capturedDynamicConfig.loader!();
    expect(result).toBeDefined();
    expect(typeof result).toBe("function");
  });

  it("keeps SSR enabled and configures a branded loading fallback", () => {
    expect(capturedDynamicConfig.options?.ssr).not.toBe(false);
    expect(capturedDynamicConfig.options?.loading).toBeTypeOf("function");

    const LoadingFallback = capturedDynamicConfig.options?.loading as
      | (() => React.ReactNode)
      | undefined;

    render(<>{LoadingFallback?.()}</>);

    expect(screen.getByTestId("space-background")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Typing and spelling practice for kids on a MacBook Pro",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Practice Typing" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Why families use MacQuest" })
    ).toBeInTheDocument();
    expect(screen.getByText("Loading game")).toBeInTheDocument();
  });

  it("renders structured data alongside the home route", () => {
    render(<Home />);

    expect(
      document.querySelector("#seo-structured-data")?.textContent
    ).toContain(SITE_TITLE);
  });
});
