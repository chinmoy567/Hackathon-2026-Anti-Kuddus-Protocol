import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../../src/app.js";
import { identityConn, domainConn } from "../../src/config/db.js";
import { Student } from "../../src/models/identity/student.model.js";
import { SosAlert } from "../../src/models/domain/sosAlert.model.js";
import { signTestToken } from "../authHelper.js";

const createStudent = async (role = "student") => {
  const student = await Student.create({
    name: `Test ${role} ${Date.now()}-${Math.random()}`,
    rollNumber: `TST-${Date.now()}-${Math.random()}`,
    pinHash: await bcrypt.hash("1234", 4),
    role,
  });
  return { student, token: signTestToken(role, student._id.toString()) };
};

describe("SOS routes (Mission 5)", () => {
  beforeAll(async () => {
    await Promise.all([identityConn.asPromise(), domainConn.asPromise()]);
  });

  beforeEach(async () => {
    await SosAlert.deleteMany({});
  });

  it("creates a new SOS alert with 201 and emits no error", async () => {
    const { token } = await createStudent("student");

    const res = await request(app).post("/api/v1/sos").set("Authorization", `Bearer ${token}`).send({
      location: "Library",
      occurredAt: new Date().toISOString(),
      clientEventId: `evt-${Date.now()}`,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("active");

    const alerts = await SosAlert.find({});
    expect(alerts).toHaveLength(1);
    expect(alerts[0].location).toBe("Library");
  });

  it("replaying the same clientEventId returns 200 and does not duplicate", async () => {
    const { token } = await createStudent("student");
    const clientEventId = `evt-dup-${Date.now()}`;
    const occurredAt = new Date().toISOString();

    const first = await request(app)
      .post("/api/v1/sos")
      .set("Authorization", `Bearer ${token}`)
      .send({ location: "Canteen", occurredAt, clientEventId });
    expect(first.status).toBe(201);

    const second = await request(app)
      .post("/api/v1/sos")
      .set("Authorization", `Bearer ${token}`)
      .send({ location: "Canteen", occurredAt, clientEventId });
    expect(second.status).toBe(200);
    expect(second.body.data.id).toBe(first.body.data.id);

    const alerts = await SosAlert.find({});
    expect(alerts).toHaveLength(1);
  });

  it("rejects an occurredAt more than 24h in the past with 409", async () => {
    const { token } = await createStudent("student");
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const res = await request(app).post("/api/v1/sos").set("Authorization", `Bearer ${token}`).send({
      location: "Corridor",
      occurredAt: twoDaysAgo,
      clientEventId: `evt-stale-${Date.now()}`,
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("rejects a non-student role with 403", async () => {
    const { token } = await createStudent("teacher");

    const res = await request(app).post("/api/v1/sos").set("Authorization", `Bearer ${token}`).send({
      location: "Playground",
      occurredAt: new Date().toISOString(),
      clientEventId: `evt-role-${Date.now()}`,
    });

    expect(res.status).toBe(403);
  });

  it("rejects an invalid location with 400", async () => {
    const { token } = await createStudent("student");

    const res = await request(app).post("/api/v1/sos").set("Authorization", `Bearer ${token}`).send({
      location: "Rooftop",
      occurredAt: new Date().toISOString(),
      clientEventId: `evt-badloc-${Date.now()}`,
    });

    expect(res.status).toBe(400);
  });

  it("GET /sos/active excludes captain_1st with 403", async () => {
    const { token } = await createStudent("captain_1st");

    const res = await request(app).get("/api/v1/sos/active").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it("GET /sos/active returns active+acknowledged alerts with resolved student info, newest first", async () => {
    const { student, token: studentToken } = await createStudent("student");
    const { token: captainToken } = await createStudent("captain_2nd");

    await request(app)
      .post("/api/v1/sos")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ location: "Classroom", occurredAt: new Date(Date.now() - 1000).toISOString(), clientEventId: `evt-a-${Date.now()}` });
    await request(app)
      .post("/api/v1/sos")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ location: "Library", occurredAt: new Date().toISOString(), clientEventId: `evt-b-${Date.now()}` });

    const res = await request(app).get("/api/v1/sos/active").set("Authorization", `Bearer ${captainToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.alerts).toHaveLength(2);
    expect(res.body.data.alerts[0].location).toBe("Library");
    expect(res.body.data.alerts[0].student.rollNumber).toBe(student.rollNumber);
  });

  it("acknowledge transitions active -> acknowledged, and rejects a second acknowledge with 409", async () => {
    const { token: studentToken } = await createStudent("student");
    const { token: captainToken } = await createStudent("captain_3rd");

    const created = await request(app)
      .post("/api/v1/sos")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ location: "Playground", occurredAt: new Date().toISOString(), clientEventId: `evt-ack-${Date.now()}` });
    const alertId = created.body.data.id;

    const ack = await request(app)
      .patch(`/api/v1/sos/${alertId}/acknowledge`)
      .set("Authorization", `Bearer ${captainToken}`);
    expect(ack.status).toBe(200);
    expect(ack.body.data.status).toBe("acknowledged");

    const ackAgain = await request(app)
      .patch(`/api/v1/sos/${alertId}/acknowledge`)
      .set("Authorization", `Bearer ${captainToken}`);
    expect(ackAgain.status).toBe(409);
  });

  it("resolve transitions active -> resolved directly, and rejects resolving twice with 409", async () => {
    const { token: studentToken } = await createStudent("student");
    const { token: captainToken } = await createStudent("captain_2nd");

    const created = await request(app)
      .post("/api/v1/sos")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ location: "Canteen", occurredAt: new Date().toISOString(), clientEventId: `evt-res-${Date.now()}` });
    const alertId = created.body.data.id;

    const resolve = await request(app)
      .patch(`/api/v1/sos/${alertId}/resolve`)
      .set("Authorization", `Bearer ${captainToken}`);
    expect(resolve.status).toBe(200);
    expect(resolve.body.data.status).toBe("resolved");

    const resolveAgain = await request(app)
      .patch(`/api/v1/sos/${alertId}/resolve`)
      .set("Authorization", `Bearer ${captainToken}`);
    expect(resolveAgain.status).toBe(409);
  });

  it("rejects acknowledge/resolve from a student or teacher role with 403", async () => {
    const { token: studentToken } = await createStudent("student");
    const { token: teacherToken } = await createStudent("teacher");

    const created = await request(app)
      .post("/api/v1/sos")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ location: "Library", occurredAt: new Date().toISOString(), clientEventId: `evt-role2-${Date.now()}` });
    const alertId = created.body.data.id;

    const asStudent = await request(app)
      .patch(`/api/v1/sos/${alertId}/acknowledge`)
      .set("Authorization", `Bearer ${studentToken}`);
    expect(asStudent.status).toBe(403);

    const asTeacher = await request(app)
      .patch(`/api/v1/sos/${alertId}/resolve`)
      .set("Authorization", `Bearer ${teacherToken}`);
    expect(asTeacher.status).toBe(403);
  });

  afterAll(async () => {
    await identityConn.close();
    await domainConn.close();
  });
});
