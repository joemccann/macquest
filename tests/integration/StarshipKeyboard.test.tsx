import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { StarshipKeyboard } from "@/components/StarshipKeyboard";
import { ALL_ROWS } from "@/lib/keyboard-layout";

describe("StarshipKeyboard", () => {
  it("renders all keyboard rows", () => {
    const { container } = render(
      <StarshipKeyboard targetLetter="F" pressedKey={null} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();

    // Count all key labels (text elements) in the SVG
    const textElements = svg!.querySelectorAll("text");
    const totalKeys = ALL_ROWS.flat().length;
    expect(textElements).toHaveLength(totalKeys);
  });

  it("renders all expected key labels", () => {
    const { container } = render(
      <StarshipKeyboard targetLetter="F" pressedKey={null} />
    );
    const textElements = container.querySelectorAll("text");
    const labels = Array.from(textElements).map((el) => el.textContent);

    // Verify some key labels exist
    expect(labels).toContain("A");
    expect(labels).toContain("F");
    expect(labels).toContain("J");
    expect(labels).toContain("Space");
    expect(labels).toContain("Return");
    expect(labels).toContain("Tab");
    expect(labels).toContain("Shift");
  });

  it("highlights target key with white text color", () => {
    const { container } = render(
      <StarshipKeyboard targetLetter="F" pressedKey={null} />
    );
    const textElements = container.querySelectorAll("text");
    const fKey = Array.from(textElements).find(
      (el) => el.textContent === "F"
    );
    expect(fKey).toBeDefined();
    // Target key gets fill="#ffffff"
    expect(fKey!.getAttribute("fill")).toBe("#ffffff");
  });

  it("non-target, non-magic keys have dimmed text color", () => {
    const { container } = render(
      <StarshipKeyboard targetLetter="F" pressedKey={null} />
    );
    const textElements = container.querySelectorAll("text");
    const aKey = Array.from(textElements).find(
      (el) => el.textContent === "A"
    );
    expect(aKey).toBeDefined();
    // Non-target, non-magic keys have dimmed color
    expect(aKey!.getAttribute("fill")).toBe("rgba(255,255,255,0.35)");
  });

  it("shows magic key indicators for F and J keys", () => {
    const { container } = render(
      <StarshipKeyboard targetLetter="A" pressedKey={null} />
    );
    // Magic keys (F and J) have bump indicator rects with width=16 and height=2.5
    const allRects = container.querySelectorAll("rect");
    const bumpRects = Array.from(allRects).filter((rect) => {
      return (
        rect.getAttribute("width") === "16" &&
        rect.getAttribute("height") === "2.5"
      );
    });
    // F and J both have bump indicators
    expect(bumpRects).toHaveLength(2);
  });

  it("magic keys have purple styling when not targeted", () => {
    const { container } = render(
      <StarshipKeyboard targetLetter="A" pressedKey={null} />
    );
    const textElements = container.querySelectorAll("text");
    const jKey = Array.from(textElements).find(
      (el) => el.textContent === "J"
    );
    expect(jKey).toBeDefined();
    // Magic keys when not target get purple text
    expect(jKey!.getAttribute("fill")).toBe("rgba(196, 181, 253, 1)");
  });

  it("handles case-insensitive target matching", () => {
    const { container: lower } = render(
      <StarshipKeyboard targetLetter="f" pressedKey={null} />
    );
    const { container: upper } = render(
      <StarshipKeyboard targetLetter="F" pressedKey={null} />
    );

    const getFKeyFill = (container: HTMLElement) => {
      const texts = container.querySelectorAll("text");
      const fKey = Array.from(texts).find((el) => el.textContent === "F");
      return fKey!.getAttribute("fill");
    };

    // Both should have the same target styling
    expect(getFKeyFill(lower)).toBe("#ffffff");
    expect(getFKeyFill(upper)).toBe("#ffffff");
  });

  it("handles case-insensitive pressed key matching", () => {
    const { container } = render(
      <StarshipKeyboard targetLetter="D" pressedKey="d" />
    );
    // The D key should be both target and pressed -- just verify it renders
    const textElements = container.querySelectorAll("text");
    const dKey = Array.from(textElements).find(
      (el) => el.textContent === "D"
    );
    expect(dKey).toBeDefined();
    expect(dKey!.getAttribute("fill")).toBe("#ffffff");
  });

  it("renders SVG with correct viewBox", () => {
    const { container } = render(
      <StarshipKeyboard targetLetter="F" pressedKey={null} />
    );
    const svg = container.querySelector("svg");
    expect(svg!.getAttribute("viewBox")).toBe("0 0 900 260");
  });

  it("renders gradient definitions in defs", () => {
    const { container } = render(
      <StarshipKeyboard targetLetter="F" pressedKey={null} />
    );
    const defs = container.querySelector("defs");
    expect(defs).toBeInTheDocument();

    const targetGradient = container.querySelector("#targetGradient");
    expect(targetGradient).toBeInTheDocument();

    const beaconGlow = container.querySelector("#beaconGlow");
    expect(beaconGlow).toBeInTheDocument();
  });

  it("renders target key glow ellipse only for target key", () => {
    const { container } = render(
      <StarshipKeyboard targetLetter="D" pressedKey={null} />
    );
    // Only the target key should have the beaconGlow ellipse
    const glowEllipses = container.querySelectorAll(
      'ellipse[fill="url(#beaconGlow)"]'
    );
    expect(glowEllipses).toHaveLength(1);
  });

  it("renders the keyboard body wrapper", () => {
    const { container } = render(
      <StarshipKeyboard targetLetter="F" pressedKey={null} />
    );
    const body = container.querySelector(".keyboard-body");
    expect(body).toBeInTheDocument();
  });
});
