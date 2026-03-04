import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges class names", () => {
      const result = cn("foo", "bar");
      expect(result).toBe("foo bar");
    });

    it("handles conditional classes", () => {
      const result = cn("base", false && "hidden", "visible");
      expect(result).toBe("base visible");
    });

    it("merges tailwind classes correctly", () => {
      const result = cn("px-4", "px-8");
      // tailwind-merge should keep only the last conflicting class
      expect(result).toBe("px-8");
    });

    it("handles empty inputs", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("handles undefined and null inputs", () => {
      const result = cn("foo", undefined, null, "bar");
      expect(result).toBe("foo bar");
    });
  });
});
