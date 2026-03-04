import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateText } from "ai";
import { generatePhrase } from "@/app/actions/generate-phrase";

// Mock the AI SDK
vi.mock("ai", () => ({
  generateText: vi.fn(),
}));

vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: vi.fn(() => "mock-model"),
}));

const mockGenerateText = vi.mocked(generateText);

describe("generatePhrase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns AI-generated text when generateText succeeds", async () => {
    mockGenerateText.mockResolvedValueOnce({
      text: "You're a star pilot!",
      finishReason: "stop",
      usage: { promptTokens: 10, completionTokens: 5 },
      toolCalls: [],
      toolResults: [],
      response: {
        id: "test",
        timestamp: new Date(),
        modelId: "mock",
        headers: {},
      },
      reasoning: undefined,
      reasoningDetails: [],
      sources: [],
      providerMetadata: undefined,
      experimental_providerMetadata: undefined,
      rawResponse: undefined,
      responseMessages: [],
      warnings: [],
      request: { body: "" },
      files: [],
      steps: [],
    } as unknown as Awaited<ReturnType<typeof generateText>>);

    const result = await generatePhrase();
    expect(result.text).toBe("You're a star pilot!");
    // AI-generated phrases have no audioFile
    expect(result.audioFile).toBeUndefined();
  });

  it("falls back to POSITIVE_PHRASES when AI returns empty text", async () => {
    mockGenerateText.mockResolvedValueOnce({
      text: "   ",
      finishReason: "stop",
      usage: { promptTokens: 10, completionTokens: 0 },
      toolCalls: [],
      toolResults: [],
      response: {
        id: "test",
        timestamp: new Date(),
        modelId: "mock",
        headers: {},
      },
      reasoning: undefined,
      reasoningDetails: [],
      sources: [],
      providerMetadata: undefined,
      experimental_providerMetadata: undefined,
      rawResponse: undefined,
      responseMessages: [],
      warnings: [],
      request: { body: "" },
      files: [],
      steps: [],
    } as unknown as Awaited<ReturnType<typeof generateText>>);

    const result = await generatePhrase();
    // Should have a non-empty text from the fallback phrases
    expect(result.text).toBeTruthy();
    expect(result.text.length).toBeGreaterThan(0);
    // Fallback phrases include audioFile
    expect(result.audioFile).toBeDefined();
    expect(result.audioFile).toMatch(/^\/audio\/positive\/\d{2}\.mp3$/);
  });

  it("falls back to POSITIVE_PHRASES on error", async () => {
    mockGenerateText.mockRejectedValueOnce(new Error("API error"));

    const result = await generatePhrase();
    // Should have a non-empty text from fallback phrases
    expect(result.text).toBeTruthy();
    expect(result.text.length).toBeGreaterThan(0);
    // Fallback phrases include audioFile
    expect(result.audioFile).toBeDefined();
    expect(result.audioFile).toMatch(/^\/audio\/positive\/\d{2}\.mp3$/);
  });

  it("result includes audioFile for fallback phrases", async () => {
    mockGenerateText.mockRejectedValueOnce(new Error("timeout"));

    const result = await generatePhrase();
    expect(result.audioFile).toBeDefined();
    expect(typeof result.audioFile).toBe("string");
    // Audio file should follow the pattern /audio/positive/NN.mp3
    expect(result.audioFile).toMatch(/^\/audio\/positive\/\d{2}\.mp3$/);
  });

  it("does not include audioFile for AI-generated phrases", async () => {
    mockGenerateText.mockResolvedValueOnce({
      text: "Amazing space explorer!",
      finishReason: "stop",
      usage: { promptTokens: 10, completionTokens: 5 },
      toolCalls: [],
      toolResults: [],
      response: {
        id: "test",
        timestamp: new Date(),
        modelId: "mock",
        headers: {},
      },
      reasoning: undefined,
      reasoningDetails: [],
      sources: [],
      providerMetadata: undefined,
      experimental_providerMetadata: undefined,
      rawResponse: undefined,
      responseMessages: [],
      warnings: [],
      request: { body: "" },
      files: [],
      steps: [],
    } as unknown as Awaited<ReturnType<typeof generateText>>);

    const result = await generatePhrase();
    expect(result.text).toBe("Amazing space explorer!");
    expect(result.audioFile).toBeUndefined();
  });

  it("calls generateText with correct parameters", async () => {
    mockGenerateText.mockResolvedValueOnce({
      text: "Great flying!",
      finishReason: "stop",
      usage: { promptTokens: 10, completionTokens: 5 },
      toolCalls: [],
      toolResults: [],
      response: {
        id: "test",
        timestamp: new Date(),
        modelId: "mock",
        headers: {},
      },
      reasoning: undefined,
      reasoningDetails: [],
      sources: [],
      providerMetadata: undefined,
      experimental_providerMetadata: undefined,
      rawResponse: undefined,
      responseMessages: [],
      warnings: [],
      request: { body: "" },
      files: [],
      steps: [],
    } as unknown as Awaited<ReturnType<typeof generateText>>);

    await generatePhrase();

    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "mock-model",
        maxOutputTokens: 30,
      })
    );
  });

  it("returns different phrases on subsequent fallback calls", async () => {
    // Call multiple times with errors to test history tracking
    mockGenerateText.mockRejectedValue(new Error("API error"));

    const results = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const result = await generatePhrase();
      results.add(result.text);
    }

    // With history tracking, we should get variety
    expect(results.size).toBeGreaterThan(1);
  });
});
