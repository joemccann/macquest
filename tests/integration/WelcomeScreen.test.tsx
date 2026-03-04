import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WelcomeScreen } from "@/components/WelcomeScreen";

describe("WelcomeScreen", () => {
  it("renders the title 'MacQuest'", () => {
    render(<WelcomeScreen onStart={vi.fn()} />);
    expect(screen.getByText("MacQuest")).toBeInTheDocument();
  });

  it("renders the title as an h1 element", () => {
    render(<WelcomeScreen onStart={vi.fn()} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("MacQuest");
  });

  it("shows 'The Typing Adventure' subtitle", () => {
    render(<WelcomeScreen onStart={vi.fn()} />);
    expect(screen.getByText("The Typing Adventure")).toBeInTheDocument();
  });

  it("shows F and J key indicators", () => {
    render(<WelcomeScreen onStart={vi.fn()} />);
    expect(screen.getByText("F")).toBeInTheDocument();
    expect(screen.getByText("J")).toBeInTheDocument();
    expect(screen.getByText("and")).toBeInTheDocument();
  });

  it("shows 'Start Adventure' button", () => {
    render(<WelcomeScreen onStart={vi.fn()} />);
    expect(screen.getByText("Start Adventure")).toBeInTheDocument();
  });

  it("calls onStart when 'Start Adventure' button is clicked", () => {
    const onStart = vi.fn();
    render(<WelcomeScreen onStart={onStart} />);
    fireEvent.click(screen.getByText("Start Adventure"));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("shows instruction text about Magic Buttons", () => {
    render(<WelcomeScreen onStart={vi.fn()} />);
    expect(screen.getByText("Magic Buttons")).toBeInTheDocument();
    expect(screen.getByText(/Find the/)).toBeInTheDocument();
    expect(screen.getByText(/on your keyboard!/)).toBeInTheDocument();
  });

  it("shows the bump hint text", () => {
    render(<WelcomeScreen onStart={vi.fn()} />);
    expect(
      screen.getByText("They have little bumps you can feel!")
    ).toBeInTheDocument();
  });

  it("renders the rocket emoji with accessible label", () => {
    render(<WelcomeScreen onStart={vi.fn()} />);
    const rocket = screen.getByLabelText("rocket");
    expect(rocket).toBeInTheDocument();
  });

  it("renders floating decorative elements", () => {
    const { container } = render(<WelcomeScreen onStart={vi.fn()} />);
    // The decorative elements contain emojis as text content
    expect(container.textContent).toContain("\u2728"); // sparkles
    expect(container.textContent).toContain("\u2B50"); // star
  });

  it("renders the start button as a button element", () => {
    render(<WelcomeScreen onStart={vi.fn()} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
