import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app.js";
import { anonymousConn } from "../../src/config/db.js";
import { LedgerEntry } from "../../src/models/anonymous/ledgerEntry.model.js";
import { signTestToken } from "../authHelper.js";

// Only touches ledger_entries (Anonymous Store) — deliberately does not
// delete/reseed food_catalog or reference_config, since those Domain Store
// collections are shared fixtures with ledgerEntry.routes.test.js and Vitest
// runs test files concurrently against the same test database.
describe("GET /api/v1/ledger/summary", () => {
  beforeAll(async () => {
    await anonymousConn.asPromise();
  });

  beforeEach(async () => {
    await LedgerEntry.deleteMany({});
  });

  it("reflects newly logged entries in cashTotal/foodTotal and the day series", async () => {
    const token = signTestToken("teacher");

    await LedgerEntry.create([
      { type: "cash", source: "washroom_toll", amount: 2, loggedAtBucket: new Date("2026-07-10") },
      { type: "cash", source: "washroom_toll", amount: 2, loggedAtBucket: new Date("2026-07-10") },
      {
        type: "food",
        source: "tiffin_tax",
        foodItemId: new mongoose.Types.ObjectId(),
        quantity: 3,
        loggedAtBucket: new Date("2026-07-11"),
      },
    ]);

    const res = await request(app)
      .get("/api/v1/ledger/summary")
      .set("Authorization", `Bearer ${token}`)
      .query({ groupBy: "day" });

    expect(res.status).toBe(200);
    expect(res.body.data.cashTotal).toBe(4);
    expect(res.body.data.foodTotal).toBe(3);
    expect(res.body.data.series).toHaveLength(2);
    expect(res.body.data.series[0]).toEqual({ bucket: "2026-07-10", cash: 4, food: 0 });
    expect(res.body.data.series[1]).toEqual({ bucket: "2026-07-11", cash: 0, food: 3 });
  });

  it("collapses multiple daily buckets into one when groupBy=week", async () => {
    const token = signTestToken("teacher");

    await LedgerEntry.create([
      { type: "cash", source: "washroom_toll", amount: 2, loggedAtBucket: new Date("2026-07-06") },
      { type: "cash", source: "washroom_toll", amount: 2, loggedAtBucket: new Date("2026-07-08") },
    ]);

    const res = await request(app)
      .get("/api/v1/ledger/summary")
      .set("Authorization", `Bearer ${token}`)
      .query({ groupBy: "week" });

    expect(res.status).toBe(200);
    expect(res.body.data.series).toHaveLength(1);
    expect(res.body.data.series[0].cash).toBe(4);
  });

  it("returns an empty series and zero totals with no entries", async () => {
    const token = signTestToken("teacher");

    const res = await request(app).get("/api/v1/ledger/summary").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ cashTotal: 0, foodTotal: 0, series: [] });
  });

  it("rejects an invalid groupBy with 400", async () => {
    const token = signTestToken("teacher");

    const res = await request(app)
      .get("/api/v1/ledger/summary")
      .set("Authorization", `Bearer ${token}`)
      .query({ groupBy: "month" });

    expect(res.status).toBe(400);
  });

  it("rejects an unauthenticated request with 401", async () => {
    const res = await request(app).get("/api/v1/ledger/summary");
    expect(res.status).toBe(401);
  });

  afterAll(async () => {
    await anonymousConn.close();
  });
});
