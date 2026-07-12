import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";

const { domainConn } = await import("../../src/config/db.js");
const { RuleBookEntry } = await import("../../src/models/domain/ruleBookEntry.model.js");
const factCheckService = await import("../../src/services/factCheck.service.js");

describe("factCheck.service.search", () => {
  beforeAll(async () => {
    await domainConn.asPromise();
  });

  beforeEach(async () => {
    await RuleBookEntry.deleteMany({});
    await RuleBookEntry.create({
      title: "Washroom Break Policy",
      text: "Students may use the washroom during free periods without charge or permission slip.",
      category: "discipline",
      keywords: ["washroom", "toll", "bribe"],
    });
    await RuleBookEntry.ensureIndexes();
  });

  it("is case-insensitive", async () => {
    const { matches } = await factCheckService.search("WASHROOM");
    expect(matches).toHaveLength(1);
  });

  it("returns ruleId, title, and text for each match", async () => {
    const { matches } = await factCheckService.search("washroom");
    expect(matches[0]).toEqual(
      expect.objectContaining({
        ruleId: expect.anything(),
        title: "Washroom Break Policy",
        text: expect.stringContaining("washroom"),
      })
    );
  });

  it("returns an empty array for no match", async () => {
    const { matches } = await factCheckService.search("cricket bat pricing");
    expect(matches).toEqual([]);
  });

  afterAll(async () => {
    await domainConn.close();
  });
});
