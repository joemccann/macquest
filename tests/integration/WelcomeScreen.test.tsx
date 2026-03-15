import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WelcomeScreen } from "@/components/WelcomeScreen";

describe("WelcomeScreen", () => {
  const defaultProps = {
    onStart: vi.fn(),
    onStartSpelling: vi.fn(),
  };

  it("renders the title 'MacQuest'", () => {
    render(<WelcomeScreen {...defaultProps} />);
    expect(screen.getByText("MacQuest")).toBeInTheDocument();
  });

  it("renders the title as an h1 element", () => {
    render(<WelcomeScreen {...defaultProps} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("MacQuest");
  });

  it("shows 'The Typing Adventure' subtitle", () => {
    render(<WelcomeScreen {...defaultProps} />);
    expect(screen.getByText("The Typing Adventure")).toBeInTheDocument();
  });

  it("shows F and J key indicators", () => {
    render(<WelcomeScreen {...defaultProps} />);
    expect(screen.getByText("F")).toBeInTheDocument();
    expect(screen.getByText("J")).toBeInTheDocument();
    expect(screen.getByText("and")).toBeInTheDocument();
  });

  it("shows 'Practice Typing' button", () => {
    render(<WelcomeScreen {...defaultProps} />);
    expect(screen.getByText(/Practice Typing/)).toBeInTheDocument();
  });

  it("shows 'Spelling Words' button", () => {
    render(<WelcomeScreen {...defaultProps} />);
    expect(screen.getByText(/Spelling Words/)).toBeInTheDocument();
  });

  it('shows "What is MacQuest?" button', () => {
    render(<WelcomeScreen {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /What is MacQuest\?/ })
    ).toBeInTheDocument();
  });

  it("calls onStart when 'Practice Typing' button is clicked", () => {
    const onStart = vi.fn();
    render(<WelcomeScreen {...defaultProps} onStart={onStart} />);
    fireEvent.click(screen.getByText(/Practice Typing/));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("calls onStartSpelling when 'Spelling Words' button is clicked", () => {
    const onStartSpelling = vi.fn();
    render(<WelcomeScreen {...defaultProps} onStartSpelling={onStartSpelling} />);
    fireEvent.click(screen.getByText(/Spelling Words/));
    expect(onStartSpelling).toHaveBeenCalledTimes(1);
  });

  it("shows instruction text about Magic Buttons", () => {
    render(<WelcomeScreen {...defaultProps} />);
    expect(screen.getByText("Magic Buttons")).toBeInTheDocument();
    expect(screen.getByText(/Find the/)).toBeInTheDocument();
    expect(screen.getByText(/on your keyboard!/)).toBeInTheDocument();
  });

  it("shows the bump hint text", () => {
    render(<WelcomeScreen {...defaultProps} />);
    expect(
      screen.getByText("They have little bumps you can feel!")
    ).toBeInTheDocument();
  });

  it("renders the rocket emoji with accessible label", () => {
    render(<WelcomeScreen {...defaultProps} />);
    const rockets = screen.getAllByLabelText("rocket");
    expect(rockets.length).toBeGreaterThanOrEqual(1);
  });

  it("renders floating decorative elements", () => {
    const { container } = render(<WelcomeScreen {...defaultProps} />);
    // The decorative elements contain emojis as text content
    expect(container.textContent).toContain("\u2728"); // sparkles
    expect(container.textContent).toContain("\u2B50"); // star
  });

  it("renders both mode buttons as button elements", () => {
    render(<WelcomeScreen {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /Practice Typing/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Spelling Words/ })
    ).toBeInTheDocument();
  });

  it("opens and closes the MacQuest info modal", async () => {
    render(<WelcomeScreen {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /What is MacQuest\?/ }));

    // AboutModal is lazy-loaded — wait for it
    expect(
      await screen.findByRole("dialog", { name: "What is MacQuest?" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/started in PhD research/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Back to the cockpit" })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Close MacQuest info modal" })
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
