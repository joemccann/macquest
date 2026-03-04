import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WelcomeScreen } from "@/components/WelcomeScreen";

describe("WelcomeScreen without save", () => {
  it('shows "Start Adventure" button', () => {
    render(<WelcomeScreen onStart={() => {}} />);
    expect(screen.getByText("Start Adventure")).toBeTruthy();
  });

  it('does not show "Continue Adventure" button', () => {
    render(<WelcomeScreen onStart={() => {}} />);
    expect(screen.queryByText("Continue Adventure")).toBeNull();
  });

  it("shows Magic Buttons text", () => {
    render(<WelcomeScreen onStart={() => {}} />);
    expect(screen.getByText(/Magic Buttons/)).toBeTruthy();
  });

  it("shows F and J key indicators", () => {
    render(<WelcomeScreen onStart={() => {}} />);
    expect(screen.getByText("F")).toBeTruthy();
    expect(screen.getByText("J")).toBeTruthy();
  });

  it("shows bumps text", () => {
    render(<WelcomeScreen onStart={() => {}} />);
    expect(screen.getByText(/bumps/i)).toBeTruthy();
  });
});

describe("WelcomeScreen with save", () => {
  const defaultSaveProps = {
    onStart: vi.fn(),
    onResume: vi.fn(),
    savedLevel: 5,
    savedScore: 1500,
  };

  it('shows "Continue Adventure" button', () => {
    render(<WelcomeScreen {...defaultSaveProps} />);
    expect(screen.getByText("Continue Adventure")).toBeTruthy();
  });

  it('shows "Start Over" button', () => {
    render(<WelcomeScreen {...defaultSaveProps} />);
    expect(screen.getByText("Start Over")).toBeTruthy();
  });

  it('shows "Welcome back!" text', () => {
    render(<WelcomeScreen {...defaultSaveProps} />);
    expect(screen.getByText(/Welcome back/i)).toBeTruthy();
  });

  it("shows saved level and score", () => {
    render(<WelcomeScreen {...defaultSaveProps} />);
    expect(
      screen.getByText(/Level 5/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/1,500/i)
    ).toBeTruthy();
  });

  it("calls onResume when clicking Continue Adventure", () => {
    const onResume = vi.fn();
    render(<WelcomeScreen {...defaultSaveProps} onResume={onResume} />);
    fireEvent.click(screen.getByText("Continue Adventure"));
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it("calls onStart when clicking Start Over", () => {
    const onStart = vi.fn();
    render(<WelcomeScreen {...defaultSaveProps} onStart={onStart} />);
    fireEvent.click(screen.getByText("Start Over"));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("does not show Magic Buttons text", () => {
    render(<WelcomeScreen {...defaultSaveProps} />);
    expect(screen.queryByText(/Magic Buttons/)).toBeNull();
  });

  it("does not show bumps text", () => {
    render(<WelcomeScreen {...defaultSaveProps} />);
    expect(screen.queryByText(/bumps/i)).toBeNull();
  });
});
