import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SpaceBackground } from "@/components/SpaceBackground";

describe("SpaceBackground", () => {
  it("renders without crashing", () => {
    const { container } = render(<SpaceBackground />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders 120 regular star elements plus 5 bright stars", () => {
    const { container } = render(<SpaceBackground />);
    // Regular stars and bright stars all use the animate-twinkle class
    const twinkleElements = container.querySelectorAll(".animate-twinkle");
    expect(twinkleElements).toHaveLength(125); // 120 regular + 5 bright
  });

  it("renders the aurora/nebula elements", () => {
    const { container } = render(<SpaceBackground />);
    const auroraElements = container.querySelectorAll(".animate-aurora");
    expect(auroraElements).toHaveLength(2);
  });

  it("renders floating cosmic orbs", () => {
    const { container } = render(<SpaceBackground />);
    const floatingElements = container.querySelectorAll(".animate-float");
    // 3 cosmic orbs + 1 ring planet container = 4
    expect(floatingElements.length).toBeGreaterThanOrEqual(4);
  });

  it("renders the ring planet", () => {
    const { container } = render(<SpaceBackground />);
    // The ring planet has a specific structure with rounded-full elements
    // and a rotateX(60deg) transform for the ring
    const ringPlanet = container.querySelector(
      '[style*="rotateX(60deg)"]'
    );
    expect(ringPlanet).toBeInTheDocument();
  });

  it("is non-interactive with pointer-events-none", () => {
    const { container } = render(<SpaceBackground />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("pointer-events-none");
  });

  it("is fixed position and covers the full viewport", () => {
    const { container } = render(<SpaceBackground />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("fixed");
    expect(wrapper.className).toContain("inset-0");
  });

  it("has grid overlay for depth", () => {
    const { container } = render(<SpaceBackground />);
    const gridOverlay = container.querySelector('.opacity-\\[0\\.02\\]');
    expect(gridOverlay).toBeInTheDocument();
  });
});
