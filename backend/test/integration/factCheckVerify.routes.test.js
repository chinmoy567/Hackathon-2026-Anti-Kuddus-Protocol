import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from "vitest";
import request from "supertest";
import { signTestToken } from "../authHelper.js";

vi.mock("../../src/config/groq.js", () => ({
  groqClient: { chat: { completions: { create: vi.fn() } } },
}));
vi.mock("../../src/services/retrieval.service.js", () => ({
  queryRuleChunks: vi.fn(),
}));

const { groqClient } = await import("../../src/config/groq.js");
const retrieval = await import("../../src/services/retrieval.service.js");
const app = (await import("../../src/app.js")).default;
const { identityConn, anonymousConn, domainConn } = await import("../../src/config/db.js");
const { RuleBookEntry } = await import("../../src/models/domain/ruleBookEntry.model.js");
const { RuleBookChunk } = await import("../../src/models/domain/ruleBookChunk.model.js");

const mockChatResponse = (text) => {
  groqClient.chat.completions.create.mockResolvedValueOnce({
    choices: [{ message: { content: text } }],
  });
};

describe("POST /api/v1/fact-check/verify", () => {
  let chunkId;

  beforeAll(async () => {
    await Promise.all([identityConn.asPromise(), anonymousConn.asPromise(), domainConn.asPromise()]);
  });

  beforeEach(async () => {
    await RuleBookEntry.deleteMany({});
    await RuleBookChunk.deleteMany({});

    const entry = await RuleBookEntry.create({
      title: "Captain Conduct — Complaint Immunity",
      text: "Class Captains are not exempt from any classroom rule by virtue of their position.",
    });
    const chunk = await RuleBookChunk.create({
      ruleEntryId: entry._id,
      chunkText: entry.text,
      chunkIndex: 0,
    });
    chunkId = chunk._id.toString();

    vi.mocked(retrieval.queryRuleChunks).mockReset();
    groqClient.chat.completions.create.mockReset();
  });

  it("returns a TRUE/FALSE validation card with a real quote for a genuine match", async () => {
    retrieval.queryRuleChunks.mockResolvedValueOnce([{ mongoId: chunkId, score: 0.9 }]);
    mockChatResponse("VERDICT: FALSE\nCONFIDENCE: 0.8");
    const token = signTestToken("student");

    const res = await request(app)
      .post("/api/v1/fact-check/verify")
      .set("Authorization", `Bearer ${token}`)
      .send({ claim: "1st Captains are exempt from every rule" });

    expect(res.status).toBe(200);
    expect(res.body.data.verdict).toBe("FALSE");
    expect(res.body.data.confidence).toBe(0.8);
    expect(res.body.data.quote).toContain("not exempt");
    expect(res.body.data.ruleTitle).toBe("Captain Conduct — Complaint Immunity");
  });

  it("returns UNVERIFIABLE with null quote/ruleTitle when nothing clears the threshold", async () => {
    retrieval.queryRuleChunks.mockResolvedValueOnce([{ mongoId: chunkId, score: 0.05 }]);
    const token = signTestToken("student");

    const res = await request(app)
      .post("/api/v1/fact-check/verify")
      .set("Authorization", `Bearer ${token}`)
      .send({ claim: "Kuddus can ban all sandwiches forever" });

    expect(res.status).toBe(200);
    expect(res.body.data.verdict).toBe("UNVERIFIABLE");
    expect(res.body.data.quote).toBeNull();
    expect(res.body.data.ruleTitle).toBeNull();
  });

  it("rejects a missing claim with 400", async () => {
    const token = signTestToken("student");

    const res = await request(app)
      .post("/api/v1/fact-check/verify")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("rejects a non-string claim (number/array/object) with 400, not a raw 500/502", async () => {
    const token = signTestToken("student");

    for (const badClaim of [12345, ["a", "b"], { nested: "value" }]) {
      const res = await request(app)
        .post("/api/v1/fact-check/verify")
        .set("Authorization", `Bearer ${token}`)
        .send({ claim: badClaim });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    }
  });

  it("rejects a claim over 500 characters with 400", async () => {
    const token = signTestToken("student");

    const res = await request(app)
      .post("/api/v1/fact-check/verify")
      .set("Authorization", `Bearer ${token}`)
      .send({ claim: "a".repeat(501) });

    expect(res.status).toBe(400);
  });

  it("rejects an unauthenticated request with 401", async () => {
    const res = await request(app).post("/api/v1/fact-check/verify").send({ claim: "Some claim" });

    expect(res.status).toBe(401);
  });

  afterAll(async () => {
    await identityConn.close();
    await anonymousConn.close();
    await domainConn.close();
  });
});
