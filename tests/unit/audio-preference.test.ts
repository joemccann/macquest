import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  loadMutedPreference,
  saveMutedPreference,
} from "@/lib/audio-preference";

describe("audio-preference", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("defaults to unmuted when no preference is stored", () => {
    expect(loadMutedPreference()).toBe(false);
  });

  it("persists a muted preference", () => {
    saveMutedPreference(true);

    expect(localStorage.getItem("macquest-muted")).toBe("true");
    expect(loadMutedPreference()).toBe(true);
  });

  it("persists an unmuted preference", () => {
    localStorage.setItem("macquest-muted", "true");

    saveMutedPreference(false);

    expect(localStorage.getItem("macquest-muted")).toBe("false");
    expect(loadMutedPreference()).toBe(false);
  });

  it("falls back to unmuted when stored data is invalid", () => {
    localStorage.setItem("macquest-muted", "not-json");

    expect(loadMutedPreference()).toBe(false);
  });

  it("swallows storage write failures", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    expect(() => saveMutedPreference(true)).not.toThrow();
  });
});
