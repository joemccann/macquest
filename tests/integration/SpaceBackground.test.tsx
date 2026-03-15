import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SpaceBackground } from "@/components/SpaceBackground";

describe("SpaceBackground", () => {
  it("renders without crashing", () => {
    const { container } = render(<SpaceBackground />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders 25 regular star elements plus 3 bright stars (client-side)", () => {
    const { container } = render(<SpaceBackground />);
    // Stars are deferred to client via useSyncExternalStore — rendered on mount
    const twinkleElements = container.querySelectorAll(".animate-twinkle");
    expect(twinkleElements).toHaveLength(28); // 25 regular + 3 bright
  });

  it("renders the aurora/nebula elements", () => {
    const { container } = render(<SpaceBackground />);
    const auroraElements = container.querySelectorAll(".animate-aurora");
    expect(auroraElements).toHaveLength(2);
  });

  it("renders floating cosmic orb and ring planet", () => {
    const { container } = render(<SpaceBackground />);
    const floatingElements = container.querySelectorAll(".animate-float");
    // 1 cosmic orb + 1 ring planet container = 2
    expect(floatingElements.length).toBeGreaterThanOrEqual(2);
  });

  it("renders the ring planet", () => {
    const { container } = render(<SpaceBackground />);
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
});
