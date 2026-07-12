import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { domainConn } from "../../src/config/db.js";
import { SeatStudent } from "../../src/models/domain/seatStudent.model.js";
import { SeatPlan } from "../../src/models/domain/seatPlan.model.js";
import { signTestToken } from "../authHelper.js";

const BATCH_ID = "test-batch-2";

const roster = [
  { rollNumber: "003", name: "Charlie", heightCm: 170, batchId: BATCH_ID },
  { rollNumber: "001", name: "Alice", heightCm: 150, batchId: BATCH_ID },
  { rollNumber: "002", name: "Bob", heightCm: 160, batchId: BATCH_ID },
];

describe("POST /api/v1/seat-plans and GET /api/v1/seat-plans/:id", () => {
  beforeAll(async () => {
    await domainConn.asPromise();
  });

  beforeEach(async () => {
    await SeatStudent.deleteMany({});
    await SeatPlan.deleteMany({});
    await SeatStudent.insertMany(roster);
  });

  afterAll(async () => {
    await domainConn.close();
  });

  it("generates a height_sort plan as teacher, then GET returns the identical assignments", async () => {
    const token = signTestToken("teacher");

    const createRes = await request(app)
      .post("/api/v1/seat-plans")
      .set("Authorization", `Bearer ${token}`)
      .send({
        batchId: BATCH_ID,
        gridRows: 2,
        gridCols: 2,
        teacherPosition: { row: 0, col: 0 },
        algorithm: "height_sort",
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.feasible).toBe(true);
    expect(createRes.body.data.assignments).toHaveLength(4);

    const planId = createRes.body.data._id;
    const getRes = await request(app)
      .get(`/api/v1/seat-plans/${planId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.data.assignments).toEqual(createRes.body.data.assignments);
  });

  it("rejects non-teacher roles with 403", async () => {
    const token = signTestToken("student");

    const res = await request(app)
      .post("/api/v1/seat-plans")
      .set("Authorization", `Bearer ${token}`)
      .send({
        batchId: BATCH_ID,
        gridRows: 2,
        gridCols: 2,
        teacherPosition: { row: 0, col: 0 },
        algorithm: "height_sort",
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("rejects an out-of-bounds teacherPosition with 400", async () => {
    const token = signTestToken("teacher");

    const res = await request(app)
      .post("/api/v1/seat-plans")
      .set("Authorization", `Bearer ${token}`)
      .send({
        batchId: BATCH_ID,
        gridRows: 2,
        gridCols: 2,
        teacherPosition: { row: 5, col: 0 },
        algorithm: "height_sort",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects requests with no auth token with 401", async () => {
    const res = await request(app).post("/api/v1/seat-plans").send({
      batchId: BATCH_ID,
      gridRows: 2,
      gridCols: 2,
      teacherPosition: { row: 0, col: 0 },
      algorithm: "height_sort",
    });

    expect(res.status).toBe(401);
  });

  it("returns 404 for a well-formed but nonexistent plan id", async () => {
    const token = signTestToken("teacher");
    const res = await request(app)
      .get("/api/v1/seat-plans/000000000000000000000000")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
