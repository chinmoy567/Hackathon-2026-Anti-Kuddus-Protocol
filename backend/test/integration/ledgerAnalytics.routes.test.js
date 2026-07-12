import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app.js";
import { anonymousConn, domainConn } from "../../src/config/db.js";
import { LedgerEntry } from "../../src/models/anonymous/ledgerEntry.model.js";
import { FoodCatalog } from "../../src/models/domain/foodCatalog.model.js";
import { ReferenceConfig } from "../../src/models/domain/referenceConfig.model.js";
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

  it("returns an empty series, zero totals, and zeroed derived metrics with no entries", async () => {
    const token = signTestToken("teacher");

    const res = await request(app).get("/api/v1/ledger/summary").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.cashTotal).toBe(0);
    expect(res.body.data.foodTotal).toBe(0);
    expect(res.body.data.series).toEqual([]);
    expect(res.body.data.caloricSurplus).toEqual({
      totalCaloriesIntake: 0,
      totalCaloriesExpended: 0,
      surplus: 0,
    });
    expect(res.body.data.conversions).toEqual({ cricketBats: 0, jhalmuriPackets: 0 });
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
});

// Owns its own food_catalog/reference_config fixtures (distinct names/keys
// from ledgerEntry.routes.test.js's "Sandwich"/washroom_toll_amount_taka
// fixtures) so it can run concurrently without colliding on unique indexes.
describe("GET /api/v1/ledger/summary — caloric disparity + weaponry conversion (Task 3)", () => {
  let friedRice;
  let banana;

  beforeAll(async () => {
    await Promise.all([anonymousConn.asPromise(), domainConn.asPromise()]);
    friedRice = await FoodCatalog.findOneAndUpdate(
      { name: "__test_fried_rice" },
      { name: "__test_fried_rice", caloriesPerUnit: 550, category: "desirable_tiffin", unitLabel: "plate" },
      { upsert: true, returnDocument: "after" }
    );
    banana = await FoodCatalog.findOneAndUpdate(
      { name: "__test_banana" },
      { name: "__test_banana", caloriesPerUnit: 105, category: "standard_tiffin", unitLabel: "piece" },
      { upsert: true, returnDocument: "after" }
    );
    await ReferenceConfig.findOneAndUpdate(
      { key: "cricket_bat_price_taka" },
      { key: "cricket_bat_price_taka", value: 1500 },
      { upsert: true }
    );
    await ReferenceConfig.findOneAndUpdate(
      { key: "jhalmuri_packet_price_taka" },
      { key: "jhalmuri_packet_price_taka", value: 30 },
      { upsert: true }
    );
  });

  beforeEach(async () => {
    await LedgerEntry.deleteMany({});
  });

  it("sums quantity x caloriesPerUnit across mixed food entries for totalCaloriesIntake", async () => {
    const token = signTestToken("teacher");

    await LedgerEntry.create([
      {
        type: "food",
        source: "tiffin_tax",
        foodItemId: friedRice._id,
        quantity: 2,
        loggedAtBucket: new Date("2026-07-10"),
      },
      {
        type: "food",
        source: "tiffin_tax",
        foodItemId: banana._id,
        quantity: 3,
        loggedAtBucket: new Date("2026-07-10"),
      },
    ]);

    const res = await request(app).get("/api/v1/ledger/summary").set("Authorization", `Bearer ${token}`);

    // 2*550 + 3*105 = 1415
    expect(res.status).toBe(200);
    expect(res.body.data.caloricSurplus.totalCaloriesIntake).toBe(1415);
    expect(res.body.data.caloricSurplus.totalCaloriesExpended).toBe(0);
    expect(res.body.data.caloricSurplus.surplus).toBe(1415);
  });

  it("floors conversions so partial cricket bats/jhalmuri packets never display", async () => {
    const token = signTestToken("teacher");

    // 5 cash entries * 2 Taka (Task 1 seed default not guaranteed here — use
    // an explicit amount) = a cashTotal that does not evenly divide either price.
    await LedgerEntry.create(
      Array.from({ length: 5 }, () => ({
        type: "cash",
        source: "washroom_toll",
        amount: 401, // cashTotal = 2005
        loggedAtBucket: new Date("2026-07-10"),
      }))
    );

    const res = await request(app).get("/api/v1/ledger/summary").set("Authorization", `Bearer ${token}`);

    // cashTotal = 2005; 2005/1500 = 1.336.. -> 1; 2005/30 = 66.83.. -> 66
    expect(res.status).toBe(200);
    expect(res.body.data.cashTotal).toBe(2005);
    expect(res.body.data.conversions).toEqual({ cricketBats: 1, jhalmuriPackets: 66 });
  });

  afterAll(async () => {
    await FoodCatalog.deleteMany({ name: { $in: ["__test_fried_rice", "__test_banana"] } });
    await anonymousConn.close();
    await domainConn.close();
  });
});
