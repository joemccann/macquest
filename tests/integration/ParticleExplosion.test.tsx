import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ParticleExplosion } from "@/components/ParticleExplosion";

describe("ParticleExplosion", () => {
  it("renders nothing when not active", () => {
    const { container } = render(
      <ParticleExplosion active={false} id={0} />
    );
    // When inactive, AnimatePresence should render nothing
    expect(container.innerHTML).toBe("");
  });

  it("renders particles when active", () => {
    const { container } = render(
      <ParticleExplosion active={true} id={1} />
    );
    // 32 particles + 1 central flash = 33 motion.div elements
    // The wrapper div is also present
    const wrapper = container.querySelector(".pointer-events-none");
    expect(wrapper).toBeInTheDocument();
    // Each particle is an absolute-positioned div inside the wrapper
    const particles = wrapper!.querySelectorAll(":scope > div");
    // 32 particles + 1 central flash div = 33 child divs
    expect(particles).toHaveLength(33);
  });

  it("renders the central flash element when active", () => {
    const { container } = render(
      <ParticleExplosion active={true} id={1} />
    );
    const centralFlash = container.querySelector(".rounded-full");
    expect(centralFlash).toBeInTheDocument();
  });

  it("generates different particles for different ids", () => {
    const { container: container1 } = render(
      <ParticleExplosion active={true} id={1} />
    );
    const { container: container2 } = render(
      <ParticleExplosion active={true} id={2} />
    );

    // Get all particle style attributes for each render
    const getParticleStyles = (container: HTMLElement) => {
      const wrapper = container.querySelector(".pointer-events-none");
      const particles = wrapper!.querySelectorAll(":scope > div.absolute");
      return Array.from(particles).map(
        (p) => (p as HTMLElement).style.cssText
      );
    };

    const styles1 = getParticleStyles(container1);
    const styles2 = getParticleStyles(container2);

    // The particles should differ between different ids (seeded random)
    // At least some styles should be different
    const allSame = styles1.every((s, i) => s === styles2[i]);
    expect(allSame).toBe(false);
  });

  it("particles have box-shadow for glow effect", () => {
    const { container } = render(
      <ParticleExplosion active={true} id={1} />
    );
    const wrapper = container.querySelector(".pointer-events-none");
    const particles = wrapper!.querySelectorAll(":scope > div.absolute");
    // At least some particles should have box-shadow
    const hasBoxShadow = Array.from(particles).some((p) =>
      (p as HTMLElement).style.boxShadow.includes("0 0")
    );
    expect(hasBoxShadow).toBe(true);
  });

  it("does not render wrapper div when inactive", () => {
    const { container } = render(
      <ParticleExplosion active={false} id={0} />
    );
    const wrapper = container.querySelector(".pointer-events-none");
    expect(wrapper).toBeNull();
  });
});
