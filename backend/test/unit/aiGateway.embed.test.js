import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/config/cohere.js", () => ({
  cohereEmbed: vi.fn(),
}));

const { cohereEmbed } = await import("../../src/config/cohere.js");
const { embed, EXPECTED_EMBEDDING_DIMENSION } = await import("../../src/services/aiGateway.service.js");
const { AiProviderError } = await import("../../src/utils/errors.js");
const { env } = await import("../../src/config/env.js");

describe("aiGateway.embed()", () => {
  beforeEach(() => {
    // embed() checks env.cohereApiKey before calling cohereEmbed() — these tests exercise
    // the "configured" path (see test/setupEnv.js for the placeholder value).
    env.cohereApiKey = env.cohereApiKey || "test-cohere-key";
  });

  it("returns the vector when dimension matches", async () => {
    const vector = new Array(EXPECTED_EMBEDDING_DIMENSION).fill(0.1);
    cohereEmbed.mockResolvedValueOnce(vector);

    const result = await embed("some text");
    expect(result).toHaveLength(EXPECTED_EMBEDDING_DIMENSION);
  });

  it("throws AiProviderError when the embedding dimension does not match (would silently corrupt Pinecone)", async () => {
    const wrongDimensionVector = new Array(768).fill(0.1);
    cohereEmbed.mockResolvedValueOnce(wrongDimensionVector);

    await expect(embed("some text")).rejects.toThrow(AiProviderError);
  });

  it("wraps a raw provider error as AiProviderError", async () => {
    cohereEmbed.mockRejectedValueOnce(new Error("network error"));

    await expect(embed("some text")).rejects.toThrow(AiProviderError);
  });
});
