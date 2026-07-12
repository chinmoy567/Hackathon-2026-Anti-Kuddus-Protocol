import { SosAlert } from "../models/domain/sosAlert.model.js";
import { Student } from "../models/identity/student.model.js";
import { NotFoundError, ConflictError } from "../utils/errors.js";
import { emitSosNew, emitSosAcknowledged, emitSosResolved } from "./socket.service.js";

// occurredAt sanity bound: not more than 24h in the past, not in the future —
// catches clock-skew abuse while still accepting legitimate offline-queue
// replays (API.md §11).
const isOccurredAtValid = (occurredAt) => {
  const now = Date.now();
  const then = new Date(occurredAt).getTime();
  return then <= now && then >= now - 24 * 60 * 60 * 1000;
};

const toAlertPayload = async (alert, student) => ({
  id: alert._id,
  location: alert.location,
  occurredAt: alert.occurredAt,
  status: alert.status,
  student: { name: student.name, rollNumber: student.rollNumber },
});

// Upsert on (studentId, clientEventId) — replaying the same offline-queued
// alert returns the existing record instead of creating a duplicate
// (database.md §6.4, idempotent sync per Requirements Report.md §2 M5).
export const createSosAlert = async ({ studentId, location, occurredAt, clientEventId }) => {
  const existing = await SosAlert.findOne({ studentId, clientEventId });
  if (existing) return { alert: existing, created: false };

  if (!isOccurredAtValid(occurredAt)) {
    throw new ConflictError("occurredAt must be within the last 24 hours and not in the future.", "SOS_INVALID_TIMESTAMP");
  }

  const alert = await SosAlert.create({
    studentId,
    location,
    occurredAt,
    clientEventId,
    syncedAt: new Date(),
  });

  const student = await Student.findById(studentId).select("name rollNumber");
  emitSosNew(await toAlertPayload(alert, student));

  return { alert, created: true };
};

export const acknowledgeSosAlert = async (id, captainId) => {
  const alert = await SosAlert.findById(id);
  if (!alert) throw new NotFoundError("SOS alert not found.");
  if (alert.status !== "active") {
    throw new ConflictError("This alert has already been acknowledged or resolved.", "SOS_ALREADY_ACTIONED");
  }

  alert.status = "acknowledged";
  alert.acknowledgedBy = captainId;
  alert.acknowledgedAt = new Date();
  await alert.save();

  emitSosAcknowledged({ id: alert._id, status: alert.status });
  return { status: alert.status };
};

export const resolveSosAlert = async (id) => {
  const alert = await SosAlert.findById(id);
  if (!alert) throw new NotFoundError("SOS alert not found.");
  if (!["active", "acknowledged"].includes(alert.status)) {
    throw new ConflictError("This alert has already been resolved.", "SOS_ALREADY_RESOLVED");
  }

  alert.status = "resolved";
  alert.resolvedAt = new Date();
  await alert.save();

  emitSosResolved({ id: alert._id, status: alert.status });
  return { status: alert.status };
};

// studentId resolved to { name, rollNumber } via an application-layer lookup
// into the Identity Store — the one place identity legitimately surfaces
// (API.md §11, database.md §9 allowed cross-store reference).
export const listActiveSosAlerts = async () => {
  const alerts = await SosAlert.find({ status: { $in: ["active", "acknowledged"] } }).sort({ occurredAt: -1 });
  const studentIds = [...new Set(alerts.map((alert) => String(alert.studentId)))];
  const students = await Student.find({ _id: { $in: studentIds } }).select("name rollNumber");
  const studentById = new Map(students.map((student) => [String(student._id), student]));

  return {
    alerts: alerts.map((alert) => ({
      id: alert._id,
      location: alert.location,
      occurredAt: alert.occurredAt,
      status: alert.status,
      student: studentById.get(String(alert.studentId)) ?? { name: "Unknown", rollNumber: "Unknown" },
    })),
  };
};
