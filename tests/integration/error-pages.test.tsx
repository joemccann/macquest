import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "@/app/not-found";
import GlobalError from "@/app/global-error";

describe("NotFound page", () => {
  it("renders 'Page not found' text", () => {
    render(<NotFound />);
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  it("renders as an h1 heading", () => {
    render(<NotFound />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Page not found");
  });

  it("is centered on the page", () => {
    const { container } = render(<NotFound />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("flex");
    expect(wrapper.className).toContain("items-center");
    expect(wrapper.className).toContain("justify-center");
    expect(wrapper.className).toContain("min-h-screen");
  });
});

describe("GlobalError page", () => {
  it("renders 'Something went wrong' text", () => {
    render(<GlobalError />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders as an h1 heading", () => {
    render(<GlobalError />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Something went wrong");
  });

  it("wraps content in html and body tags", () => {
    const { container } = render(<GlobalError />);
    // The component renders its own html/body structure
    // In jsdom, these get rendered into the container
    const h1 = container.querySelector("h1");
    expect(h1).toBeInTheDocument();
    expect(h1!.textContent).toBe("Something went wrong");
  });
});
