import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { signTestToken } from "../authHelper.js";

const app = (await import("../../src/app.js")).default;
const { identityConn, anonymousConn, domainConn } = await import("../../src/config/db.js");
const { RuleBookEntry } = await import("../../src/models/domain/ruleBookEntry.model.js");

describe("GET /api/v1/fact-check/search", () => {
  beforeAll(async () => {
    await Promise.all([identityConn.asPromise(), anonymousConn.asPromise(), domainConn.asPromise()]);
  });

  beforeEach(async () => {
    await RuleBookEntry.deleteMany({});
    await RuleBookEntry.create([
      {
        title: "Captain Conduct — Complaint Immunity",
        text:
          "Class Captains, including the 1st Captain, are not exempt from any classroom rule " +
          "by virtue of their position. No captain may claim special exemption from homework.",
        category: "captain_conduct",
        keywords: ["captain", "exemption", "homework"],
      },
      {
        title: "Prohibition on Financial Levies",
        text:
          "No student, including any Class Captain, may collect money from classmates for any " +
          "reason without prior written approval from the class teacher.",
        category: "discipline",
        keywords: ["money", "fund", "toll", "bribe"],
      },
    ]);
    // ensureIndexes is needed because mongodb-memory-server starts each suite with a fresh
    // collection whose text index is created asynchronously on first model use.
    await RuleBookEntry.ensureIndexes();
  });

  it("returns matching rules for a forgiving keyword search (case-insensitive)", async () => {
    const token = signTestToken("student");

    const res = await request(app)
      .get("/api/v1/fact-check/search")
      .query({ q: "HOMEWORK" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.matches).toHaveLength(1);
    expect(res.body.data.matches[0].title).toBe("Captain Conduct — Complaint Immunity");
    expect(res.body.data.matches[0].text).toContain("homework");
  });

  it("matches on keywords even when the exact phrase isn't a substring of the claim", async () => {
    const token = signTestToken("student");

    const res = await request(app)
      .get("/api/v1/fact-check/search")
      .query({ q: "welfare fund bribe" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.matches.some((m) => m.title === "Prohibition on Financial Levies")).toBe(true);
  });

  it("returns an empty array, not an error, for a genuinely unmatched query", async () => {
    const token = signTestToken("student");

    const res = await request(app)
      .get("/api/v1/fact-check/search")
      .query({ q: "quantum physics" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.matches).toEqual([]);
  });

  it("rejects a missing q with 400", async () => {
    const token = signTestToken("student");

    const res = await request(app)
      .get("/api/v1/fact-check/search")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects a non-string q (repeated query param, parsed as array) with 400, not a raw 500", async () => {
    const token = signTestToken("student");

    const res = await request(app)
      .get("/api/v1/fact-check/search?q=a&q=b")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects a q over 300 characters with 400", async () => {
    const token = signTestToken("student");

    const res = await request(app)
      .get("/api/v1/fact-check/search")
      .query({ q: "a".repeat(301) })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  it("rejects an unauthenticated request with 401", async () => {
    const res = await request(app).get("/api/v1/fact-check/search").query({ q: "homework" });

    expect(res.status).toBe(401);
  });

  afterAll(async () => {
    await identityConn.close();
    await anonymousConn.close();
    await domainConn.close();
  });
});
