import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SpaceBackground } from "@/components/SpaceBackground";

describe("SpaceBackground", () => {
  it("renders without crashing", () => {
    const { container } = render(<SpaceBackground />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders as a single div with space-bg class", () => {
    const { container } = render(<SpaceBackground />);
    const el = container.firstChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el.className).toContain("space-bg");
  });

  it("is a lightweight pure-CSS component (no child elements)", () => {
    const { container } = render(<SpaceBackground />);
    const el = container.firstChild as HTMLElement;
    // Stars and decorations are rendered via CSS pseudo-elements, not DOM nodes
    expect(el.children.length).toBe(0);
  });
});
