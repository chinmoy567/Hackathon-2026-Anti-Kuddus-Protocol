import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../../src/app.js";
import { identityConn, anonymousConn, domainConn } from "../../src/config/db.js";
import { Student } from "../../src/models/identity/student.model.js";
import { LedgerEntry } from "../../src/models/anonymous/ledgerEntry.model.js";
import { FoodCatalog } from "../../src/models/domain/foodCatalog.model.js";
import { ReferenceConfig } from "../../src/models/domain/referenceConfig.model.js";
import { signTestToken } from "../authHelper.js";

const issueLedgerToken = async () => {
  const student = await Student.create({
    name: "Test Student",
    rollNumber: `STU-${Date.now()}-${Math.random()}`,
    pinHash: await bcrypt.hash("1234", 4),
    role: "student",
  });
  const token = signTestToken("student", student._id.toString());

  const res = await request(app)
    .post("/api/v1/anonymous-tokens")
    .set("Authorization", `Bearer ${token}`)
    .send({ purpose: "ledger_entry" });

  return res.body.data.token;
};

describe("POST /api/v1/ledger/entries and GET /api/v1/food-catalog", () => {
  let sandwich;

  beforeAll(async () => {
    await Promise.all([identityConn.asPromise(), anonymousConn.asPromise(), domainConn.asPromise()]);
  });

  beforeEach(async () => {
    await LedgerEntry.deleteMany({});
    await FoodCatalog.deleteMany({});
    await ReferenceConfig.deleteMany({});
    await ReferenceConfig.create({ key: "washroom_toll_amount_taka", value: 2 });
    sandwich = await FoodCatalog.create({ name: "Sandwich", caloriesPerUnit: 350, category: "desirable_tiffin" });
  });

  it("logs a cash entry with a server-set amount, ignoring any client-sent amount", async () => {
    const rawToken = await issueLedgerToken();

    const res = await request(app)
      .post("/api/v1/ledger/entries")
      .set("X-Anonymous-Token", rawToken)
      .send({ type: "cash", amount: 9999 });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeNull();

    const entries = await LedgerEntry.find({ type: "cash" });
    expect(entries).toHaveLength(1);
    expect(entries[0].amount).toBe(2);
    expect(entries[0].source).toBe("washroom_toll");
  });

  it("logs a food entry referencing an existing food_catalog item", async () => {
    const rawToken = await issueLedgerToken();

    const res = await request(app)
      .post("/api/v1/ledger/entries")
      .set("X-Anonymous-Token", rawToken)
      .send({ type: "food", foodItemId: sandwich._id.toString(), quantity: 2 });

    expect(res.status).toBe(201);
    expect(res.body.data).toBeNull();

    const entries = await LedgerEntry.find({ type: "food" });
    expect(entries).toHaveLength(1);
    expect(entries[0].source).toBe("tiffin_tax");
    expect(entries[0].quantity).toBe(2);
    expect(entries[0].foodItemId.toString()).toBe(sandwich._id.toString());
  });

  it("rejects reuse of the same anonymous token with 409", async () => {
    const rawToken = await issueLedgerToken();

    await request(app).post("/api/v1/ledger/entries").set("X-Anonymous-Token", rawToken).send({ type: "cash" });

    const res = await request(app)
      .post("/api/v1/ledger/entries")
      .set("X-Anonymous-Token", rawToken)
      .send({ type: "cash" });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("rejects a missing anonymous token with 401", async () => {
    const res = await request(app).post("/api/v1/ledger/entries").send({ type: "cash" });
    expect(res.status).toBe(401);
  });

  it("rejects an invalid food entry (bad quantity) with 400", async () => {
    const rawToken = await issueLedgerToken();

    const res = await request(app)
      .post("/api/v1/ledger/entries")
      .set("X-Anonymous-Token", rawToken)
      .send({ type: "food", foodItemId: sandwich._id.toString(), quantity: 21 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("GET /food-catalog returns seeded items to any authenticated role", async () => {
    const token = signTestToken("teacher");
    const res = await request(app).get("/api/v1/food-catalog").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].name).toBe("Sandwich");
  });

  afterAll(async () => {
    await identityConn.close();
    await anonymousConn.close();
    await domainConn.close();
  });
});
